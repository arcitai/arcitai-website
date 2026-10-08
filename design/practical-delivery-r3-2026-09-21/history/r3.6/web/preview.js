import {
  PARTICLE_COUNT,
  createFlow,
  advanceFlow,
  sampleFlow,
  setFlowTarget,
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
const stagePositions = [125, 365, 630, 865];
const stages = [...document.querySelectorAll(".method-stage")];
const particleGroup = document.querySelector(".method-particles");
const particles = Array.from({ length: PARTICLE_COUNT }, () => {
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  particleGroup.append(rect);
  return rect;
});
const simulation = createFlow();
let paused = false,
  pinned = false,
  interacting = false,
  until = 0,
  frame = 0,
  previousTime = 0;
const hint = document.querySelector("#method-hint");
const idleHint = matchMedia("(hover: none)").matches
  ? "Tap the flow to open it. Tap again to release."
  : "Move across the flow. Click to keep it open.";
hint.textContent = idleHint;

function drawFlow() {
  const state = sampleFlow(simulation);
  state.points.forEach((point, index) => {
    const rect = particles[index];
    rect.setAttribute("x", String(point.x - point.size / 2));
    rect.setAttribute("y", String(point.y - point.size / 2));
    rect.setAttribute("width", String(point.size));
    rect.setAttribute("height", String(point.size));
  });
  stages.forEach((stage, index) => {
    const x = stagePositions[index] - 65;
    stage.querySelector(".method-bar").setAttribute("d", `M${x} 36H${x + 130 * state.bars[index]}`);
    stage.classList.toggle("is-waiting", index >= 2 && simulation.openness[index - 2] < 0.85);
  });
  method.classList.toggle(
    "is-open",
    simulation.openness.every((value) => value > 0.98),
  );
  document.querySelector(".method-wall").setAttribute("d", state.rails);
}
function isFlowRunning() {
  return (
    canAnimate({
      reduced: reduced.matches,
      paused,
      hidden: document.hidden,
      visible: method.classList.contains("is-visible"),
    }) &&
    (interacting || pinned || performance.now() < until)
  );
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
function setTarget(target) {
  setFlowTarget(simulation, target, reduced.matches || paused);
  drawFlow();
  syncMotion();
}
toggles.forEach((button) =>
  button.addEventListener("click", () => {
    paused = !paused;
    until = performance.now() + 4500;
    syncMotion();
  }),
);
const visibility = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      entry.target.classList.toggle("is-visible", entry.isIntersecting);
      if (entry.isIntersecting) {
        entry.target.classList.add("has-entered");
        if (entry.target === method) until = performance.now() + 4500;
      }
    }
    syncMotion();
  },
  { threshold: 0.15 },
);
scenes.forEach((scene) => visibility.observe(scene));
document.addEventListener("visibilitychange", syncMotion);
reduced.addEventListener("change", () => {
  if (reduced.matches) setFlowTarget(simulation, simulation.target, true);
  drawFlow();
  syncMotion();
});
function enter(target) {
  interacting = true;
  if (!pinned) setTarget(target);
  else syncMotion();
}
function leave() {
  interacting = false;
  until = performance.now() + 1200;
  if (!pinned) setTarget(0);
  else syncMotion();
}
method.addEventListener("pointermove", (event) => {
  if (event.pointerType !== "mouse") return;
  const rect = method.getBoundingClientRect();
  const position = (event.clientX - rect.left) / rect.width;
  enter(position > 0.77 ? 2 : position > 0.48 ? 1 : 0);
});
method.addEventListener("pointerleave", leave);
method.addEventListener("focus", () => enter(2));
method.addEventListener("blur", leave);
method.addEventListener("click", () => {
  pinned = !pinned;
  until = performance.now() + 4500;
  method.setAttribute("aria-pressed", String(pinned));
  hint.textContent = pinned ? "Flow held open. Click again to release." : idleHint;
  setTarget(pinned ? 2 : 0);
});
drawFlow();
syncMotion();
