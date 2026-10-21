import { afterEach, describe, expect, it, vi } from "vitest";
import { createFactoryDissolve, copyFadeOutMs, copyFadeInMs } from "./factory-copy-motion";

afterEach(() => vi.useRealTimers());

describe("Factory surface dissolve", () => {
  it("keeps old content until it has faded out, then fades in its replacement", () => {
    vi.useFakeTimers();
    const paint = vi.fn();
    const motion = createFactoryDissolve<string>("AgentOps", "ops", paint);
    motion.update("Communication", "communication", true);
    expect(paint.mock.calls).toEqual([["AgentOps", "out"]]);
    vi.advanceTimersByTime(copyFadeOutMs - 1);
    expect(paint).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(1);
    expect(paint).toHaveBeenLastCalledWith("Communication", "in");
    vi.advanceTimersByTime(copyFadeInMs);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("uses the latest selection without replacing text partway through fade-out", () => {
    vi.useFakeTimers();
    const paint = vi.fn();
    const motion = createFactoryDissolve<string>("Software", "software", paint);
    motion.update("BI", "bi", true);
    vi.advanceTimersByTime(200);
    motion.update("Defence", "defence", true);
    expect(paint.mock.calls).toEqual([["Software", "out"]]);
    vi.advanceTimersByTime(copyFadeOutMs - 200);
    expect(paint).toHaveBeenLastCalledWith("Defence", "in");
    motion.update("Research", "research", true);
    expect(paint).toHaveBeenLastCalledWith("Defence", "out");
    vi.advanceTimersByTime(copyFadeOutMs);
    expect(paint).toHaveBeenLastCalledWith("Research", "in");
    motion.stop();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("settles immediately when motion is disabled and cancels pending replacements", () => {
    vi.useFakeTimers();
    const paint = vi.fn();
    const motion = createFactoryDissolve<string>("Host", "host", paint);
    motion.update("Isolation", "isolation", true);
    vi.advanceTimersByTime(300);
    motion.update("Linux", "linux", false);
    expect(paint).toHaveBeenLastCalledWith("Linux", "steady");
    expect(vi.getTimerCount()).toBe(0);
    vi.runAllTimers();
    motion.update("Linux", "linux", true);
    expect(paint).toHaveBeenCalledTimes(2);
  });

  it("does not paint after cleanup or restart an unchanged cue", () => {
    vi.useFakeTimers();
    const paint = vi.fn();
    const motion = createFactoryDissolve<string>("Data", "data", paint);
    motion.update("Data", "data", true);
    expect(paint).not.toHaveBeenCalled();
    motion.update("Metadata", "metadata", true);
    motion.stop();
    vi.runAllTimers();
    motion.update("Permissions", "permissions", true);
    expect(paint.mock.calls).toEqual([["Data", "out"]]);
    expect(vi.getTimerCount()).toBe(0);
  });
});
