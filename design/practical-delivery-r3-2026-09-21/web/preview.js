import {
  PARTICLE_COUNT,
  GATES,
  createFlow,
  advanceFlow,
  sampleFlow,
  setFlowProgress,
  scrollProgress,
  canAnimate,
} from "./motion-model.js";

const offersTrigger = document.querySelector(".offers-trigger");
const offersMenu = document.querySelector("#offers-menu");

function setOffersOpen(open) {
  offersTrigger.setAttribute("aria-expanded", String(open));
  offersMenu.hidden = !open;
}

offersTrigger.addEventListener("click", () => {
  setOffersOpen(offersMenu.hidden);
});

document.addEventListener("click", (event) => {
  if (!offersMenu.contains(event.target) && !offersTrigger.contains(event.target)) {
    setOffersOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !offersMenu.hidden) {
    setOffersOpen(false);
    offersTrigger.focus();
  }
});

offersMenu.addEventListener("click", (event) => {
  if (event.target.closest("a")) setOffersOpen(false);
});

document.addEventListener("focusin", (event) => {
  if (!offersMenu.contains(event.target) && event.target !== offersTrigger) {
    setOffersOpen(false);
  }
});

// Keep the first Tab inside the disclosure before continuing to the other links.
offersTrigger.addEventListener("keydown", (event) => {
  if (!offersMenu.hidden && event.key === "Tab" && !event.shiftKey) {
    event.preventDefault();
    offersMenu.querySelector("a").focus();
  }
});
offersMenu.addEventListener("keydown", (event) => {
  const links = [...offersMenu.querySelectorAll("a")];
  if (event.key !== "Tab") return;
  if (event.shiftKey && event.target === links[0]) {
    event.preventDefault();
    offersTrigger.focus();
  } else if (!event.shiftKey && event.target === links.at(-1)) {
    event.preventDefault();
    [...document.querySelectorAll(".site-header nav a")]
      .find((link) => link.getClientRects().length > 0)
      .focus();
  }
});

const themeToggle = document.querySelector(".theme-toggle");
themeToggle.addEventListener("click", () => {
  const dark = document.documentElement.dataset.theme !== "dark";
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  themeToggle.setAttribute("aria-pressed", String(dark));
  themeToggle.setAttribute("aria-label", `Switch to ${dark ? "light" : "dark"} theme`);
  document.querySelector('meta[name="theme-color"]').content = dark ? "#171814" : "#f8f2e8";
});

// The preview has no submission endpoint, no form field names and a form-action
// CSP of 'none'. Never send or persist the visitor's input, including on Enter.
document.querySelector(".inquiry-form").addEventListener("submit", (event) => {
  event.preventDefault();
});
document.querySelector(".submit-preview").addEventListener("click", () => {
  document.querySelector("#preview-note").textContent = "Preview only — nothing was sent or saved.";
});

const root = document.documentElement;
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
const scenes = document.querySelectorAll(".motion-scene");
const toggles = document.querySelectorAll(".motion-toggle");
const method = document.querySelector(".method-flow");
const stages = [...document.querySelectorAll(".method-stage")];
const stops = [...document.querySelectorAll(".method-stop")];
const mobileStages = [...document.querySelectorAll(".method-mobile-stages > span")];
const channel = document.querySelector(".method-wall");
const particleGroup = document.querySelector(".method-particles");
const particles = Array.from({ length: PARTICLE_COUNT }, () => {
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  particleGroup.append(rect);
  return rect;
});
const simulation = createFlow(reduced.matches ? 1 : 0);
let paused = false,
  frame = 0,
  previousTime = 0,
  scrollAmount = 0,
  pointerAmount = 0,
  manualPreview = false;
const hint = document.querySelector("#method-hint");
const idleHint = matchMedia("(hover: none)").matches
  ? "Scroll down to open, up to close. Tap to preview."
  : "Scroll down to open, up to close. Or move across.";
hint.textContent = idleHint;

function drawFlow() {
  const state = sampleFlow(simulation);
  const phases = state.bars.map((value) =>
    value === 1 ? "ready" : value > 0 ? "active" : "waiting",
  );
  state.points.forEach((point, index) => {
    const rect = particles[index];
    rect.setAttribute("x", String(point.x - point.size / 2));
    rect.setAttribute("y", String(point.y - point.size / 2));
    rect.setAttribute("width", String(point.size));
    rect.setAttribute("height", String(point.size));
    const nextStage = GATES.findIndex((x) => point.x <= x);
    rect.dataset.phase = phases[nextStage < 0 ? 3 : nextStage];
  });
  stages.forEach((stage, index) => {
    const x = GATES[index] - 65;
    stage.querySelector(".method-bar").setAttribute("d", `M${x} 36H${x + 130 * state.bars[index]}`);
    stage.classList.toggle("is-complete", state.bars[index] === 1);
    stage.dataset.phase = phases[index];
    stops[index].dataset.phase = phases[index];
    mobileStages[index].dataset.phase = phases[index];
  });
  channel.setAttribute("d", state.rails);
  const complete = simulation.progress === 1;
  method.classList.toggle("is-open", complete);
  hint.textContent = reduced.matches
    ? "Static workflow · reduced motion."
    : manualPreview || pointerAmount > scrollAmount
      ? "Previewing the opening. Scroll sets the lasting position."
      : complete
        ? "Open at this scroll position. Scroll up to close."
        : idleHint;
}
function isFlowRunning() {
  return canAnimate({
    reduced: reduced.matches,
    paused,
    hidden: document.hidden,
    visible: method.classList.contains("is-visible"),
  });
}
function tick(now) {
  frame = 0;
  if (!isFlowRunning()) {
    previousTime = 0;
    return;
  }
  if (previousTime) advanceFlow(simulation, (now - previousTime) / 1000);
  previousTime = now;
  drawFlow();
  frame = requestAnimationFrame(tick);
}
function syncMotion() {
  root.classList.toggle("page-hidden", document.hidden);
  root.classList.toggle("motion-enabled", !reduced.matches);
  root.classList.toggle("motion-paused", paused || reduced.matches);
  toggles.forEach((button) => {
    button.hidden = false;
    button.disabled = reduced.matches;
    button.setAttribute("aria-pressed", String(paused || reduced.matches));
    button.textContent = reduced.matches
      ? "Reduced motion"
      : paused
        ? "Play motion"
        : "Pause motion";
  });
  if (isFlowRunning() && !frame) frame = requestAnimationFrame(tick);
  if (!isFlowRunning()) {
    cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
  }
}
function updateFlowTarget() {
  const target = reduced.matches ? 1 : Math.max(scrollAmount, pointerAmount, manualPreview ? 1 : 0);
  setFlowProgress(simulation, target, reduced.matches);
  method.setAttribute("aria-pressed", String(manualPreview));
  drawFlow();
  syncMotion();
}
toggles.forEach((button) =>
  button.addEventListener("click", () => {
    paused = !paused;
    syncMotion();
  }),
);
const visibility = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      entry.target.classList.toggle("is-visible", entry.isIntersecting);
      if (entry.isIntersecting) {
        entry.target.classList.add("has-entered");
      }
    }
    syncMotion();
  },
  { threshold: 0.15 },
);
scenes.forEach((scene) => visibility.observe(scene));
document.addEventListener("visibilitychange", syncMotion);
reduced.addEventListener("change", () => {
  updateFlowTarget();
});
method.addEventListener("pointermove", (event) => {
  if (event.pointerType !== "mouse") return;
  const rect = method.getBoundingClientRect();
  const position = (event.clientX - rect.left) / rect.width;
  pointerAmount = Math.min(1, Math.max(0, (position - 0.05) / 0.9));
  updateFlowTarget();
});
method.addEventListener("pointerleave", (event) => {
  if (event.pointerType !== "mouse") return;
  pointerAmount = 0;
  manualPreview = false;
  updateFlowTarget();
});
method.addEventListener("click", () => {
  manualPreview = !manualPreview;
  updateFlowTarget();
});
method.addEventListener("blur", () => {
  manualPreview = false;
  updateFlowTarget();
});
method.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  manualPreview = false;
  pointerAmount = 0;
  updateFlowTarget();
});
let scrollFrame = 0;
function syncScroll(event) {
  // A stationary pointer or old tap must not keep it open while scrolling back up.
  if (event?.type === "scroll") {
    pointerAmount = 0;
    manualPreview = false;
  }
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = 0;
    const bounds = method.getBoundingClientRect();
    scrollAmount = scrollProgress(bounds.top + bounds.height / 2, innerHeight);
    updateFlowTarget();
  });
}
window.addEventListener("scroll", syncScroll, { passive: true });
window.addEventListener("resize", syncScroll);
drawFlow();
syncMotion();
syncScroll();
