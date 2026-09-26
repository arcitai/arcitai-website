import { describe, expect, it } from "vitest";
import { ambientPhase, playbackVideo, scenePoster, sceneVideo } from "./media";

describe("shared scene media", () => {
  it("uses matching poster and clip revisions for received scenes", () => {
    for (const scene of ["morning", "day", "evening", "night"] as const) {
      expect(scenePoster(scene)).toContain(`arcitai-${scene}-poster-v6.jpg`);
      expect(sceneVideo(scene)).toContain(`arcitai-${scene}-loop-v6.mp4`);
    }
  });
  it("plays the landscape until a separate walkthrough is supplied", () => {
    expect(playbackVideo("night")).toEqual({
      source: sceneVideo("night"),
      title: "Arc’IT AI landscape video",
    });
    expect(playbackVideo("morning", "   ").source).toBe(sceneVideo("morning"));
    expect(playbackVideo("night", " /assets/gustav-walkthrough.mp4 ")).toEqual({
      source: "/assets/gustav-walkthrough.mp4",
      title: "Arc’IT AI walkthrough",
    });
    expect(sceneVideo("night")).toContain("arcitai-night-loop-v6.mp4");
  });
  it("synchronises visible loops to a shared clock and handles unknown duration", () => {
    expect(ambientPhase(12500, 1000, 10)).toBe(1.5);
    expect(ambientPhase(500, 1000, 10)).toBe(0);
    expect(ambientPhase(12500, 1000, NaN)).toBe(0);
  });
});
