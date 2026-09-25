import {
  advanceFlow,
  canAnimate,
  createFlow,
  GATES,
  PARTICLE_COUNT,
  sampleFlow,
  scrollProgress,
  setFlowProgress,
} from "./factory-motion";

export function mountFactoryFlow(figure: HTMLElement) {
  const method = figure.querySelector<HTMLButtonElement>(".method-flow")!;
  const stages = [...figure.querySelectorAll<SVGGElement>(".method-stage")];
  const stops = [...figure.querySelectorAll<SVGStopElement>(".method-stop")];
  const mobileStages = [...figure.querySelectorAll<HTMLElement>(".method-mobile-stages > span")];
  const channel = figure.querySelector<SVGPathElement>(".method-wall")!;
  const group = figure.querySelector<SVGGElement>(".method-particles")!;
  const hint = figure.querySelector<HTMLElement>("#method-hint")!;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const particles = Array.from({ length: PARTICLE_COUNT }, () => {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    group.append(rect);
    return rect;
  });
  const simulation = createFlow(reduced.matches ? 1 : 0);
  let frame = 0,
    scrollFrame = 0,
    previousTime = 0,
    scrollAmount = 0,
    pointerAmount = 0,
    manualPreview = false,
    visible = false;
  const running = () =>
    canAnimate({ reduced: reduced.matches, paused: false, hidden: document.hidden, visible });
  const draw = () => {
    const state = sampleFlow(simulation);
    const phases = state.bars.map((value) =>
      value === 1 ? "ready" : value > 0 ? "active" : "waiting",
    );
    state.points.forEach((point, i) => {
      const rect = particles[i];
      rect.setAttribute("x", String(point.x - point.size / 2));
      rect.setAttribute("y", String(point.y - point.size / 2));
      rect.setAttribute("width", String(point.size));
      rect.setAttribute("height", String(point.size));
      const nextStage = GATES.findIndex((x) => point.x <= x);
      rect.dataset.phase = phases[nextStage < 0 ? 3 : nextStage];
    });
    stages.forEach((stage, i) => {
      const x = GATES[i] - 65;
      stage.querySelector(".method-bar")!.setAttribute("d", `M${x} 36H${x + 130 * state.bars[i]}`);
      stage.dataset.phase = phases[i];
      stops[i].dataset.phase = phases[i];
      mobileStages[i].dataset.phase = phases[i];
    });
    channel.setAttribute("d", state.rails);
    method.classList.toggle("is-open", simulation.progress === 1);
    hint.textContent = reduced.matches
      ? "Static workflow. Reduced motion."
      : "Scroll down to open, up to close. Move across or press Enter to preview. Escape returns to the scroll position.";
  };
  const tick = (now: number) => {
    frame = 0;
    if (!running()) {
      previousTime = 0;
      return;
    }
    if (previousTime) advanceFlow(simulation, (now - previousTime) / 1000);
    previousTime = now;
    draw();
    frame = requestAnimationFrame(tick);
  };
  const syncMotion = () => {
    if (running() && !frame) frame = requestAnimationFrame(tick);
    if (!running()) {
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
    }
  };
  const updateTarget = () => {
    setFlowProgress(
      simulation,
      reduced.matches ? 1 : Math.max(scrollAmount, pointerAmount, manualPreview ? 1 : 0),
      reduced.matches,
    );
    method.setAttribute("aria-pressed", String(manualPreview));
    draw();
    syncMotion();
  };
  const move = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    const bounds = method.getBoundingClientRect();
    pointerAmount = Math.min(
      1,
      Math.max(0, ((event.clientX - bounds.left) / bounds.width - 0.05) / 0.9),
    );
    updateTarget();
  };
  const leave = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    pointerAmount = 0;
    manualPreview = false;
    updateTarget();
  };
  const click = () => {
    manualPreview = !manualPreview;
    updateTarget();
  };
  const blur = () => {
    manualPreview = false;
    updateTarget();
  };
  const keydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      manualPreview = false;
      pointerAmount = 0;
      updateTarget();
    }
  };
  const syncScroll = (event?: Event) => {
    if (event?.type === "scroll") {
      pointerAmount = 0;
      manualPreview = false;
    }
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      const bounds = method.getBoundingClientRect();
      scrollAmount = scrollProgress(bounds.top + bounds.height / 2, innerHeight);
      updateTarget();
    });
  };
  const observer = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      syncMotion();
    },
    { threshold: 0.15 },
  );
  observer.observe(method);
  method.addEventListener("pointermove", move);
  method.addEventListener("pointerleave", leave);
  method.addEventListener("click", click);
  method.addEventListener("blur", blur);
  method.addEventListener("keydown", keydown);
  window.addEventListener("scroll", syncScroll, { passive: true });
  window.addEventListener("resize", syncScroll);
  document.addEventListener("visibilitychange", syncMotion);
  reduced.addEventListener("change", updateTarget);
  draw();
  syncScroll();
  return () => {
    observer.disconnect();
    cancelAnimationFrame(frame);
    cancelAnimationFrame(scrollFrame);
    method.removeEventListener("pointermove", move);
    method.removeEventListener("pointerleave", leave);
    method.removeEventListener("click", click);
    method.removeEventListener("blur", blur);
    method.removeEventListener("keydown", keydown);
    window.removeEventListener("scroll", syncScroll);
    window.removeEventListener("resize", syncScroll);
    document.removeEventListener("visibilitychange", syncMotion);
    reduced.removeEventListener("change", updateTarget);
    particles.forEach((point) => point.remove());
  };
}
