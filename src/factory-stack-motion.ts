export const factoryUnfoldStart = 0.85;
export const factoryUnfoldEnd = 0.4;

/** Unfold on entry; begin work while the Factory is still near the middle of the viewport. */
export function stackOpenProgress(top: number, viewportHeight: number) {
  if (!Number.isFinite(top) || !Number.isFinite(viewportHeight) || viewportHeight <= 0) return 1;
  const progress = Math.max(
    0,
    Math.min(
      1,
      (viewportHeight * factoryUnfoldStart - top) /
        (viewportHeight * (factoryUnfoldStart - factoryUnfoldEnd)),
    ),
  );
  // Hold the assembled factory through the first half, then spend the remaining
  // scroll distance opening it fully. The endpoint stays early in the viewport.
  const opening = Math.max(0, (progress - 0.5) * 2);
  return opening * opening * (3 - 2 * opening);
}

export function canUnfoldFactory(width: number) {
  return width >= 360;
}

export function observeStackOpening(
  track: HTMLElement,
  onProgress: (progress: number) => void = () => {},
) {
  let animationFrame = 0;
  let visible = false;
  let enabled = false;
  let progress = 1;
  let settledOpen = false;
  let stopped = false;
  const update = () => {
    animationFrame = 0;
    const top = track.getBoundingClientRect().top;
    // A small reverse-scroll margin prevents trackpad jitter from removing/restarting the team.
    progress =
      !enabled || (settledOpen && top <= window.innerHeight * (factoryUnfoldEnd + 0.025))
        ? 1
        : stackOpenProgress(top, window.innerHeight);
    settledOpen = progress === 1;
    track.style.setProperty("--stack-open", progress.toFixed(4));
    onProgress(progress);
  };
  const queue = () => {
    if (!animationFrame && !document.hidden && visible && !stopped)
      animationFrame = requestAnimationFrame(update);
  };
  const sync = () => {
    enabled = canUnfoldFactory(window.innerWidth);
    track.dataset.scroll = enabled ? "entry" : "static";
    window.removeEventListener("scroll", queue);
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    if (!visible || document.hidden || stopped) return;
    if (enabled) window.addEventListener("scroll", queue, { passive: true });
    queue();
  };
  const observer = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      sync();
    },
    { rootMargin: "25% 0px" },
  );
  observer.observe(track);

  window.addEventListener("resize", sync, { passive: true });
  document.addEventListener("visibilitychange", sync);
  sync();
  return {
    explore(open: boolean) {
      if (!enabled) return;
      const top =
        window.scrollY +
        track.getBoundingClientRect().top -
        window.innerHeight * (open ? factoryUnfoldEnd : factoryUnfoldStart) +
        // Land beyond the boundary even when scroll coordinates are rounded.
        (open ? 2 : 0);
      window.scrollTo({ top, behavior: "smooth" });
    },
    isOpen: () => progress === 1,
    stop() {
      stopped = true;
      observer.disconnect();
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", sync);
      document.removeEventListener("visibilitychange", sync);

      if (animationFrame) cancelAnimationFrame(animationFrame);
      track.style.removeProperty("--stack-open");
      delete track.dataset.scroll;
    },
  };
}
