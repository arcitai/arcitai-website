import { afterEach, describe, expect, it, vi } from "vitest";
import { canUnfoldFactory, observeStackOpening, stackOpenProgress } from "./factory-stack-motion";
import { moduleSource } from "./factory-stack-data";

describe("Factory stack opening", () => {
  it("opens on entry and is fully open before the section reaches the header", () => {
    const positions = [1000, 850, 625, 400, 100, 400, 625, 850, 1000];
    const expected = [0, 0, 0, 1, 1, 1, 0, 0, 0];
    positions.forEach((top, i) => expect(stackOpenProgress(top, 1000)).toBeCloseTo(expected[i]));
    expect(stackOpenProgress(200, 500)).toBe(1);
    expect(stackOpenProgress(312.5, 500)).toBeCloseTo(0);
  });

  it("keeps the first half assembled and unfolds completely over the final half", () => {
    const half = stackOpenProgress(625, 1000);
    const threeQuarters = stackOpenProgress(512.5, 1000);
    expect(half).toBeCloseTo(0, 10);
    expect(stackOpenProgress(700, 1000)).toBe(0);
    expect(1 - half).toBeGreaterThan(0.5);
    expect(threeQuarters).toBeCloseTo(0.5);
    expect(1 - threeQuarters).toBeGreaterThan(0.2);
    expect(stackOpenProgress(400, 1000)).toBe(1);
  });

  it("leaves invalid geometry readable", () => {
    expect(stackOpenProgress(NaN, 1000)).toBe(1);
    expect(stackOpenProgress(0, 0)).toBe(1);
    expect(stackOpenProgress(0, Infinity)).toBe(1);
  });

  it("uses static layers for narrow viewports and reduced motion", () => {
    expect(canUnfoldFactory(1440, false)).toBe(true);
    expect(canUnfoldFactory(1040, false)).toBe(false);
    expect(canUnfoldFactory(1440, true)).toBe(false);
  });

  it("only links verified module repositories, with no guessed links for other work areas", () => {
    expect(moduleSource("software")?.url).toBe("https://github.com/arcitai/factory");
    expect(moduleSource("powerbi")?.url).toBe("https://github.com/arcitai/Agentic-PowerBI-System");
    expect(moduleSource("research")).toBeNull();
    expect(moduleSource("defence")).toBeNull();
    for (const snapshot of [
      null,
      {},
      { sources: null },
      { sources: { software: { repository: "arcitai/factory", url: "javascript:alert(1)" } } },
      {
        sources: {
          defence: {
            repository: "arcitai/factory-software-defence",
            url: "https://github.com/arcitai/factory-software-defence",
          },
        },
      },
    ]) {
      expect(moduleSource("software", snapshot)).toBeNull();
      expect(moduleSource("defence", snapshot)).toBeNull();
    }
  });
});

// Browser event/visibility simulation; this exercises lifecycle, not rendered geometry.
function motionEnvironment() {
  const reduced = Object.assign(new EventTarget(), { matches: false });
  const win = Object.assign(new EventTarget(), {
    innerHeight: 1000,
    innerWidth: 1440,
    scrollY: 2000,
    scrollTo: vi.fn(),
    matchMedia: () => reduced,
  });
  const doc = Object.assign(new EventTarget(), { hidden: false });
  const frames = new Map<number, FrameRequestCallback>();
  let sequence = 0;
  let intersect: (entries: { isIntersecting: boolean }[]) => void;
  const disconnect = vi.fn();
  vi.stubGlobal("window", win);
  vi.stubGlobal("document", doc);
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    frames.set(++sequence, callback);
    return sequence;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: typeof intersect) {
        intersect = callback;
      }
      observe() {}
      disconnect = disconnect;
    },
  );
  const setProperty = vi.fn();
  const removeProperty = vi.fn();
  let top = 625;
  const element = {
    style: { setProperty, removeProperty },
    dataset: {},
    getBoundingClientRect: vi.fn(() => ({ top })),
  } as unknown as HTMLElement;
  return {
    element,
    win,
    doc,
    reduced,
    frames,
    disconnect,
    setProperty,
    removeProperty,
    setTop(value: number) {
      top = value;
    },
    visible(value: boolean) {
      intersect([{ isIntersecting: value }]);
    },
    flush() {
      const pending = [...frames.values()];
      frames.clear();
      pending.forEach((callback) => callback(0));
    },
  };
}

afterEach(() => vi.unstubAllGlobals());

describe("Factory motion lifecycle", () => {
  it("coalesces scrolling, suspends offscreen/hidden work and cleans up on unmount", () => {
    const env = motionEnvironment();
    const controller = observeStackOpening(env.element);
    env.win.dispatchEvent(new Event("scroll"));
    expect(env.frames.size).toBe(0);
    env.visible(true);
    env.win.dispatchEvent(new Event("scroll"));
    env.win.dispatchEvent(new Event("scroll"));
    expect(env.frames.size).toBe(1);
    env.flush();
    expect(env.setProperty).toHaveBeenLastCalledWith("--stack-open", "0.0000");
    env.setTop(400);
    env.win.dispatchEvent(new Event("scroll"));
    env.visible(false);
    expect(env.frames.size).toBe(0);
    env.visible(true);
    env.doc.hidden = true;
    env.doc.dispatchEvent(new Event("visibilitychange"));
    expect(env.frames.size).toBe(0);
    env.doc.hidden = false;
    env.doc.dispatchEvent(new Event("visibilitychange"));
    env.flush();
    expect(env.setProperty).toHaveBeenLastCalledWith("--stack-open", "1.0000");
    env.win.dispatchEvent(new Event("scroll"));
    controller.stop();
    expect(env.frames.size).toBe(0);
    expect(env.disconnect).toHaveBeenCalledOnce();
    expect(env.element.dataset.scroll).toBeUndefined();
    expect(env.removeProperty).toHaveBeenCalledWith("--stack-open");
    env.win.dispatchEvent(new Event("scroll"));
    env.win.dispatchEvent(new Event("resize"));
    env.doc.dispatchEvent(new Event("visibilitychange"));
    expect(env.frames.size).toBe(0);
  });

  it("stays open on small screens or reduced motion and responds to preference changes", () => {
    const env = motionEnvironment();
    env.setTop(900);
    env.reduced.matches = true;
    const controller = observeStackOpening(env.element);
    env.visible(true);
    env.flush();
    expect(env.setProperty).toHaveBeenLastCalledWith("--stack-open", "1.0000");
    env.win.dispatchEvent(new Event("scroll"));
    expect(env.frames.size).toBe(0);
    env.reduced.matches = false;
    env.reduced.dispatchEvent(new Event("change"));
    env.flush();
    expect(env.setProperty).toHaveBeenLastCalledWith("--stack-open", "0.0000");
    env.win.innerWidth = 900;
    env.win.dispatchEvent(new Event("resize"));
    env.flush();
    expect(env.setProperty).toHaveBeenLastCalledWith("--stack-open", "1.0000");
    controller.stop();
  });
});

describe("Factory entry and click navigation", () => {
  it("reaches opening after rounded navigation and ignores small scroll jitter before closing", () => {
    const env = motionEnvironment();
    env.win.innerHeight = 913;
    const progress = vi.fn();
    const controller = observeStackOpening(env.element, progress);
    env.visible(true);
    env.flush();
    controller.explore(true);
    const target = env.win.scrollTo.mock.calls.at(-1)![0].top;
    env.setTop(env.win.scrollY + 625 - Math.floor(target));
    env.win.dispatchEvent(new Event("scroll"));
    env.flush();
    expect(progress).toHaveBeenLastCalledWith(1);
    expect(controller.isOpen()).toBe(true);
    env.setTop(env.win.innerHeight * 0.4 + 1);
    env.win.dispatchEvent(new Event("scroll"));
    env.flush();
    expect(controller.isOpen()).toBe(true);
    expect(progress).toHaveBeenLastCalledWith(1);
    env.setTop(env.win.innerHeight * 0.425 + 1);
    env.win.dispatchEvent(new Event("scroll"));
    env.flush();
    expect(progress.mock.calls.at(-1)![0]).toBeLessThan(1);
    expect(controller.isOpen()).toBe(false);
    controller.stop();
  });

  it("recomputes the early opening window when the viewport height changes", () => {
    const env = motionEnvironment();
    const controller = observeStackOpening(env.element);
    env.visible(true);
    env.flush();
    expect(env.element.dataset.scroll).toBe("entry");
    env.win.innerHeight = 500;
    env.win.dispatchEvent(new Event("resize"));
    env.flush();
    expect(env.setProperty).toHaveBeenLastCalledWith("--stack-open", "0.0000");
    env.win.innerHeight = 1000;
    env.win.dispatchEvent(new Event("resize"));
    env.flush();
    expect(env.setProperty).toHaveBeenLastCalledWith("--stack-open", "0.0000");
    controller.stop();
  });

  it("navigates to the two scroll endpoints without a competing expansion state", () => {
    const env = motionEnvironment();
    const controller = observeStackOpening(env.element);
    env.visible(true);
    env.flush();
    controller.explore(true);
    expect(env.win.scrollTo).toHaveBeenLastCalledWith({ top: 2227, behavior: "smooth" });
    controller.explore(false);
    expect(env.win.scrollTo).toHaveBeenLastCalledWith({ top: 1775, behavior: "smooth" });
    expect(controller.isOpen()).toBe(false);
    env.setTop(400);
    env.win.dispatchEvent(new Event("scroll"));
    env.flush();
    expect(controller.isOpen()).toBe(true);
    env.reduced.matches = true;
    env.reduced.dispatchEvent(new Event("change"));
    env.flush();
    controller.explore(false);
    expect(env.win.scrollTo).toHaveBeenCalledTimes(2);
    controller.stop();
  });
});
