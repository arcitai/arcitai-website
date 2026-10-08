import { PARTICLE_COUNT, flowFrame, flowRails, canAnimate } from "./motion-model.js";

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
  document.querySelector('meta[name="theme-color"]').content = dark ? "#14211d" : "#f8f2e8";
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
const figure = document.querySelector(".flow-figure");
const bars = [...document.querySelectorAll(".stage-track i")];
const particleGroup = document.querySelector(".flow-particles");
const particles = Array.from({ length: PARTICLE_COUNT }, () => {
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  particleGroup.append(rect);
  return rect;
});
let paused = false;
let mode = "connected";
let elapsed = 4.2;
let frame = 0;
let previousTime = 0;

function drawFlow() {
  const state = flowFrame(elapsed, mode);
  state.points.forEach((point, index) => {
    const rect = particles[index];
    rect.setAttribute("x", String(point.x - point.size / 2));
    rect.setAttribute("y", String(point.y - point.size / 2));
    rect.setAttribute("width", String(point.size));
    rect.setAttribute("height", String(point.size));
  });
  bars.forEach((bar, index) => {
    bar.style.transform = `scaleX(${state.bars[index]})`;
  });
  document.querySelector(".flow-rail").setAttribute("d", flowRails(mode));
}

function isFlowRunning() {
  return canAnimate({
    reduced: reduced.matches,
    paused,
    hidden: document.hidden,
    visible: figure.classList.contains("is-visible"),
  });
}

function tick(now) {
  frame = 0;
  if (!isFlowRunning()) {
    previousTime = 0;
    return;
  }
  if (previousTime) elapsed += Math.min((now - previousTime) / 1000, 0.05);
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

toggles.forEach((button) =>
  button.addEventListener("click", () => {
    paused = !paused;
    syncMotion();
  }),
);

const visibility = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    entry.target.classList.toggle("is-visible", entry.isIntersecting);
    if (entry.isIntersecting) entry.target.classList.add("has-entered");
  }
  syncMotion();
});
scenes.forEach((scene) => visibility.observe(scene));
document.addEventListener("visibilitychange", syncMotion);
reduced.addEventListener("change", syncMotion);
document.querySelector(".flow-options").hidden = false;
document.querySelectorAll("[data-flow-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    mode = button.dataset.flowMode;
    figure.dataset.mode = mode;
    document.querySelectorAll("[data-flow-mode]").forEach((option) => {
      option.setAttribute("aria-pressed", String(option === button));
    });
    document.querySelector("#flow-caption").textContent =
      mode === "connected"
        ? "A shared path through the work. Review and approval stay part of it."
        : "Work piles up when writing code gets ahead of review and testing.";
    drawFlow();
  });
});
drawFlow();
syncMotion();
