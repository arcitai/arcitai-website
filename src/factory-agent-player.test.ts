import { afterEach, describe, expect, it, vi } from "vitest";
import { playAgentScene } from "./factory-agent-player";
import { createAgentScene, nextAgentScene } from "./factory-agent-motion";

function environment() {
  let now = 0,
    next = 0;
  const frames = new Map<number, FrameRequestCallback>();
  const reduced = Object.assign(new EventTarget(), { matches: false });
  const mobile = Object.assign(new EventTarget(), { matches: false });
  const doc = Object.assign(new EventTarget(), { hidden: false });
  let intersection: IntersectionObserverCallback;
  vi.stubGlobal("window", {
    matchMedia: (query: string) => (query.includes("reduced") ? reduced : mobile),
  });
  vi.stubGlobal("document", doc);
  vi.stubGlobal("performance", { now: () => now });
  vi.stubGlobal("requestAnimationFrame", (fn: FrameRequestCallback) => {
    frames.set(++next, fn);
    return next;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        intersection = callback;
      }
      observe() {}
      disconnect() {}
    },
  );
  return {
    reduced,
    mobile,
    doc,
    frames,
    visible(value: boolean) {
      intersection(
        [{ isIntersecting: value } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    },
    advance(ms: number) {
      for (let t = 0; t < ms; t += 20) {
        now += 20;
        const current = [...frames.values()];
        frames.clear();
        for (const fn of current) fn(now);
      }
    },
  };
}
afterEach(() => vi.unstubAllGlobals());
describe("Factory story lifecycle", () => {
  it("plays once, finishes and leaves no animation frame running", () => {
    const env = environment(),
      paint = vi.fn();
    const stop = playAgentScene(
      {} as SVGSVGElement,
      createAgentScene("work", "software", undefined, true),
      paint,
    );
    env.visible(true);
    env.advance(22000);
    expect(paint.mock.lastCall?.[2]).toBe(false);
    expect(env.frames.size).toBe(0);
    const count = paint.mock.calls.length;
    env.visible(false);
    env.visible(true);
    env.advance(22000);
    expect(paint).toHaveBeenCalledTimes(count);
    stop();
  });
  it("freezes offscreen and while hidden, and resumes without skipping the job", () => {
    const env = environment(),
      paint = vi.fn();
    const stop = playAgentScene(
      {} as SVGSVGElement,
      createAgentScene("compute", "software"),
      paint,
    );
    env.visible(true);
    env.advance(500);
    const before = paint.mock.lastCall![1] as number;
    env.visible(false);
    env.advance(20000);
    expect(paint.mock.lastCall![1]).toBe(before);
    env.visible(true);
    env.advance(100);
    expect(paint.mock.lastCall![1]).toBeLessThan(before + 0.15);
    env.doc.hidden = true;
    env.doc.dispatchEvent(new Event("visibilitychange"));
    const count = paint.mock.calls.length;
    env.advance(20000);
    expect(paint).toHaveBeenCalledTimes(count);
    stop();
    expect(env.frames.size).toBe(0);
  });
  it.each(["reduced", "mobile"] as const)(
    "settles without motion for %s and does not restart automatically",
    (preference) => {
      const env = environment(),
        paint = vi.fn();
      env[preference].matches = true;
      const stop = playAgentScene({} as SVGSVGElement, createAgentScene("work", "software"), paint);
      env.visible(true);
      expect(paint.mock.lastCall?.[2]).toBe(false);
      expect(env.frames.size).toBe(0);
      env[preference].matches = false;
      env[preference].dispatchEvent(new Event("change"));
      env.advance(1000);
      expect(paint).toHaveBeenCalledTimes(1);
      stop();
    },
  );
  it("installs only after the active job, once per scene, then continues from the same positions", () => {
    const env = environment(),
      paint = vi.fn(),
      beat = vi.fn();
    const first = createAgentScene("work", "software");
    const next = vi.fn((scene, poses) => nextAgentScene(scene, poses, false));
    const stop = playAgentScene({} as SVGSVGElement, first, paint, { beat, next });
    env.visible(true);
    env.advance(Math.floor((first.installAt - 0.1) * 1000));
    expect(beat.mock.calls.map((call) => call[1])).toEqual(["arrive"]);
    env.advance(200);
    expect(beat.mock.calls.map((call) => call[1])).toEqual(["arrive", "install"]);
    env.advance(65000);
    expect(next.mock.calls.length).toBeGreaterThan(3);
    for (let i = 0; i < beat.mock.calls.length - 1; i += 2) {
      expect(beat.mock.calls[i][1]).toBe("arrive");
      expect(beat.mock.calls[i + 1][1]).toBe("install");
      expect(beat.mock.calls[i][0]).toBe(beat.mock.calls[i + 1][0]);
    }
    stop();
    const count = beat.mock.calls.length;
    env.advance(10000);
    expect(env.frames.size).toBe(0);
    expect(beat).toHaveBeenCalledTimes(count);
  });
  it("does not advance the story or install anything while hidden", () => {
    const env = environment(),
      beat = vi.fn(),
      next = vi.fn();
    const stop = playAgentScene(
      {} as SVGSVGElement,
      createAgentScene("work", "software"),
      vi.fn(),
      { beat, next },
    );
    env.visible(true);
    env.advance(200);
    env.visible(false);
    env.advance(60000);
    expect(beat).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    stop();
  });
  it("settles an active story when reduced motion is enabled without starting another job", () => {
    const env = environment(),
      next = vi.fn(),
      beat = vi.fn();
    const stop = playAgentScene(
      {} as SVGSVGElement,
      createAgentScene("work", "software"),
      vi.fn(),
      { beat, next },
    );
    env.visible(true);
    env.advance(200);
    env.reduced.matches = true;
    env.reduced.dispatchEvent(new Event("change"));
    expect(beat.mock.calls.map((call) => call[1])).toEqual(["install"]);
    env.advance(20000);
    expect(next).not.toHaveBeenCalled();
    expect(env.frames.size).toBe(0);
    stop();
  });
});
