import type { Scene } from "./scene";
import { runtimeAsset } from "./site-data";

// Only received, reviewed exports belong in the runtime manifest.
const animatedScenes: readonly Scene[] = ["day", "evening"];
export const scenePoster = (scene: Scene) =>
  runtimeAsset(
    animatedScenes.includes(scene)
      ? `assets/arcitai-${scene}-poster-v6.jpg`
      : `assets/arcitai-panorama-${scene}-v1.jpg`,
  );
export const sceneVideo = (scene: Scene) =>
  animatedScenes.includes(scene) ? runtimeAsset(`assets/arcitai-${scene}-loop-v6.mp4`) : undefined;

export function ambientPhase(now: number, epoch: number, duration: number) {
  return Number.isFinite(duration) && duration > 0
    ? Math.max(0, (now - epoch) / 1000) % duration
    : 0;
}
