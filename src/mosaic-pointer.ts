import { storyAmbient, storyPointerEnergy, type StoryPoint } from "./mosaic-story";

export type PointerTrail = { energy: number; dx: number; dy: number };
export type PointerTrails = Record<string, PointerTrail>;

/** Pointer impulses decay after movement; a stationary cursor never holds a tile up. */
export function advancePointerTrails(
  previous: PointerTrails,
  centres: { id: string; point: StoryPoint }[],
  pointer: StoryPoint | null,
  speed: number,
  moved: boolean,
  seconds: number,
): PointerTrails {
  return Object.fromEntries(
    centres.map(({ id, point }) => {
      const old = previous[id];
      const distance = pointer ? Math.hypot(point.x - pointer.x, point.y - pointer.y) : Infinity;
      const energy = storyPointerEnergy(old?.energy ?? 0, distance, speed, moved, seconds);
      const direction = moved && pointer && distance > 0 && distance < 140;
      return [
        id,
        {
          energy: energy < 0.0001 ? 0 : energy,
          dx: direction ? (point.x - pointer.x) / distance : (old?.dx ?? 0),
          dy: direction ? (point.y - pointer.y) / distance : (old?.dy ?? 0),
        },
      ];
    }),
  );
}

/** `reach` scales displacement only. The phone camera shows the scene at roughly a third
 * of desktop size, where the approved one-unit crest would fall below a device pixel. */
export function storyEntityMotion(
  column: number,
  row: number,
  seconds: number,
  trail?: PointerTrail,
  strength = 1,
  reach = 1,
) {
  const energy = trail?.energy ?? 0;
  const ambient = storyAmbient(column, row, seconds, energy, (column * 0.17 + row * 0.31) % 1);
  return {
    x: (trail?.dx ?? 0) * 4 * energy * strength * reach,
    y: (ambient.lift + (trail?.dy ?? 0) * 4 * energy) * strength * reach,
    scale: ambient.scale,
    shine: ambient.shine * strength,
  };
}
