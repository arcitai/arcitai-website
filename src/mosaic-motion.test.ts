import { describe, expect, it } from "vitest";
import {
  createMosaicVisit,
  mosaicPoint,
  mosaicSceneFrame,
  mosaicWorkLayout,
  type MosaicLayout,
} from "./mosaic-motion";

const seeds = [0, 17, 4294967295];
describe.each<MosaicLayout>(["wings", "floor"])("mosaic work: %s", (layout) => {
  const { build: mosaicBuildCells, source: mosaicSourceCells } = mosaicWorkLayout(layout);
  const point = (column: number, row: number) => mosaicPoint(column, row, layout);
  const frame = (time: number, visit: ReturnType<typeof createMosaicVisit>, complete = false) =>
    mosaicSceneFrame(time, visit, complete, 1.35, layout);
  it("reads as a broad floor with visible depth rather than a narrow diagonal edge", () => {
    const a = point(-8, -4);
    const b = point(8, -4);
    const c = point(-8, 4);
    const horizontal = { x: b.x - a.x, y: b.y - a.y };
    const depth = { x: c.x - a.x, y: c.y - a.y };
    expect(horizontal.x).toBeGreaterThan(0);
    expect(Math.abs(horizontal.y / horizontal.x)).toBeLessThan(0.1);
    // A collapsed or flipped projection loses the positive floor area.
    const area = horizontal.x * depth.y - horizontal.y * depth.x;
    expect(area / (horizontal.x * horizontal.x)).toBeGreaterThan(0.2);
  });
  it("gives each visit a stable story, with different roles and rhythms between visits", () => {
    expect(createMosaicVisit(17)).toEqual(createMosaicVisit(17));
    expect(createMosaicVisit(17)).not.toEqual(createMosaicVisit(18));
    const roles = new Set(Array.from({ length: 12 }, (_, seed) => createMosaicVisit(seed).carrier));
    expect(roles.size).toBe(2);
  });
  it("installs each tile at the end of the physical journey and never removes it", () => {
    for (const seed of seeds) {
      const visit = createMosaicVisit(seed);
      for (let i = 0; i < mosaicBuildCells.length; i++) {
        const at = (i + 0.59) * visit.duration - visit.leadIn;
        const before = frame(at - 0.00001, visit);
        const after = frame(at + 0.00001, visit);
        expect(before.installed).toBe(i);
        expect(after.installed).toBe(i + 1);
        expect(after.tile).toBeNull();
        const cell = mosaicBuildCells[i];
        const slot = point(cell[0], cell[1]);
        expect(
          Math.hypot(before.tile!.point.x - slot.x, before.tile!.point.y - slot.y),
        ).toBeLessThan(0.001);
        expect(before.tile!.organised).toBeCloseTo(1);
      }
      let previous = 0;
      for (let t = 0; t < 1000; t++) {
        const scene = frame(t, visit);
        expect(scene.installed).toBeGreaterThanOrEqual(previous);
        // The loose, carried and installed pieces always describe the same eight tiles.
        expect(
          mosaicSourceCells.length -
            scene.remainingSourceStart +
            Number(scene.tile !== null) +
            scene.installed,
        ).toBe(mosaicSourceCells.length);
        previous = scene.installed;
      }
      expect(previous).toBe(8);
    }
  });
  it("keeps bodies and carried tiles continuous; extra workers enter and leave offstage", () => {
    for (const seed of seeds) {
      const visit = createMosaicVisit(seed);
      let previous = frame(0, visit);
      let biggestStep = 0,
        biggestTileStep = 0;
      const populations = new Set<number>();
      for (let t = 0.05; t < 500; t += 0.05) {
        const scene = frame(t, visit);
        populations.add(scene.workers.length);
        for (const worker of scene.workers) {
          const before = previous.workers.find((w) => w.id === worker.id);
          if (before)
            biggestStep = Math.max(
              biggestStep,
              Math.hypot(worker.pose.x - before.pose.x, worker.pose.y - before.pose.y),
            );
          else expect(worker.pose.x < -75 || worker.pose.x > 1675).toBe(true);
          expect(worker.pose.opacity).toBe(1);
        }
        for (const old of previous.workers) {
          if (!scene.workers.some((w) => w.id === old.id))
            expect(old.pose.x < -75 || old.pose.x > 1675).toBe(true);
        }
        if (scene.tile && previous.tile)
          biggestTileStep = Math.max(
            biggestTileStep,
            Math.hypot(
              scene.tile.point.x - previous.tile.point.x,
              scene.tile.point.y - previous.tile.point.y,
            ),
          );
        previous = scene;
      }
      expect(biggestStep).toBeLessThan(7);
      expect(biggestTileStep).toBeLessThan(7);
      expect([...populations].sort()).toEqual([2, 3, 4]);
    }
  });
  it("shows the complete foundation without helpers or carried tiles for reduced motion", () => {
    const still = frame(0, createMosaicVisit(9), true);
    expect(still.installed).toBe(mosaicBuildCells.length);
    expect(still.tile).toBeNull();
    expect(still.workers.length).toBe(2);
  });
});
