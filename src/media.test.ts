import { describe, expect, it } from "vitest";
import { ambientPhase, scenePoster, sceneVideo } from "./media";

describe("shared scene media", () => {
  it("uses matching poster and clip revisions for received scenes", () => {
    for (const scene of ["day", "evening"] as const) {
      expect(scenePoster(scene)).toContain(`arcitai-${scene}-poster-v6.jpg`);
      expect(sceneVideo(scene)).toContain(`arcitai-${scene}-loop-v6.mp4`);
    }
  });
  it("does not request exports that have not been delivered", () => {
    for (const scene of ["morning", "night"] as const) {
      expect(sceneVideo(scene)).toBeUndefined();
      expect(scenePoster(scene)).toContain(`arcitai-panorama-${scene}-v1.jpg`);
    }
  });
  it("synchronises visible loops to a shared clock and handles unknown duration", () => {
    expect(ambientPhase(12500, 1000, 10)).toBe(1.5);
    expect(ambientPhase(500, 1000, 10)).toBe(0);
    expect(ambientPhase(12500, 1000, NaN)).toBe(0);
  });
});
