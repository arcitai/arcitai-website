import type { Scene } from "./scene";
import { runtimeAsset } from "./site-data";

export const scenePoster = (scene: Scene) => runtimeAsset(`assets/arcitai-${scene}-poster-v6.jpg`);
export const sceneVideo = (scene: Scene) => runtimeAsset(`assets/arcitai-${scene}-loop-v6.mp4`);

// Until Gustav's VSL is recorded, clicking plays the landscape with controls.
// A future VSL replaces only explicit playback, never the ambient cover.
export function playbackVideo(scene: Scene, walkthrough?: string) {
  const source = walkthrough?.trim();
  return {
    source: source || sceneVideo(scene),
    title: source ? "Arc’IT AI walkthrough" : "Arc’IT AI landscape video",
  };
}

export function ambientPhase(now: number, epoch: number, duration: number) {
  return Number.isFinite(duration) && duration > 0
    ? Math.max(0, (now - epoch) / 1000) % duration
    : 0;
}
