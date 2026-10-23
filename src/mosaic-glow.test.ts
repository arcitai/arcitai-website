import { describe, expect, it } from "vitest";
import { createMosaicStory, storyBasis, storyTileFrame } from "./mosaic-story";
import { endingMarkFrame, endingTimeline, transitionEndingFrame } from "./mosaic-ending";
import { storyGlow } from "./mosaic-glow";

const scene = createMosaicStory(94, storyBasis(), { variant: "blend" });
const all = endingTimeline(scene, "all");
const frames = (time: number, complete = false) => ({
  tiles: Object.fromEntries(
    scene.tiles.map((t) => [t.id, storyTileFrame(t, scene, time, complete)]),
  ),
  marks: Object.fromEntries(
    [...scene.sources, ...scene.platforms].map((m) => [
      m.id,
      endingMarkFrame(scene, m, all, time, complete),
    ]),
  ),
});
const light = (time: number, complete = false) => {
  const { tiles, marks } = frames(time, complete);
  return storyGlow(scene, tiles, marks, time, complete);
};

describe("light follows the visible assembly", () => {
  it("changes throughout assembly and gathering, without counting arriving brands as already gathered", () => {
    let previous = light(0);
    expect(previous.gathered).toBe(0);
    expect(previous.blue).toBeLessThan(1);
    const unique = new Set<number>();
    for (let time = 0; time <= all.ends + 1; time += 0.5) {
      const current = light(time);
      expect(current.blue).toBeGreaterThanOrEqual(previous.blue - 1e-10);
      expect(current.blue).toBeLessThanOrEqual(1);
      current.regions.forEach((region, i) => {
        expect(region.opacity).toBeGreaterThanOrEqual(previous.regions[i].opacity - 1e-10);
        expect(region.opacity).toBeLessThanOrEqual(1);
      });
      unique.add(current.blue);
      previous = current;
    }
    expect(unique.size).toBeGreaterThan(100);
    expect(light(40).blue).toBeGreaterThan(light(0).blue);
    expect(light(all.ends).blue).toBe(1);
    expect(light(all.ends).regions.every((region) => region.opacity === 1)).toBe(true);
    expect(light(0, true)).toEqual(light(all.ends));
  });

  it("uses actual tile and displayed mark states, not a separate ending timer", () => {
    const time = all.ends;
    const { tiles, marks } = frames(time);
    const fullyGathered = storyGlow(scene, tiles, marks, time);
    const oneMoving = { ...tiles, [scene.tiles[0].id]: { blue: 0.5 } };
    expect(storyGlow(scene, oneMoving, marks, time).blue).toBeLessThan(fullyGathered.blue);
    const visible = {
      ...marks,
      [scene.sources[0].id]: { ...marks[scene.sources[0].id], opacity: 0.5 },
    };
    expect(storyGlow(scene, tiles, visible, time).blue).toBeLessThan(fullyGathered.blue);
  });

  it("softens smoothly when switching to retained sources and completes immediately in reduced motion", () => {
    const now = all.ends + 30;
    const quiet = endingTimeline(scene, "quiet", all, now);
    const { tiles, marks } = frames(now);
    let previous = storyGlow(scene, tiles, marks, now).blue;
    for (let dt = 0; dt <= 1.21; dt += 0.1) {
      const displayed = Object.fromEntries(
        [...scene.sources, ...scene.platforms].map((mark) => [
          mark.id,
          transitionEndingFrame(marks[mark.id], endingMarkFrame(scene, mark, quiet, now + dt), dt),
        ]),
      );
      const current = storyGlow(scene, tiles, displayed, now + dt).blue;
      expect(current).toBeLessThanOrEqual(previous + 1e-10);
      expect(previous - current).toBeLessThan(0.03);
      previous = current;
    }
    const returned = Object.fromEntries(
      [...scene.sources, ...scene.platforms].map((mark) => [
        mark.id,
        endingMarkFrame(scene, mark, quiet, 0, true),
      ]),
    );
    expect(storyGlow(scene, tiles, returned, 0, true).blue).toBeCloseTo(0.85);
  });

  it("fades each rotated regional wash inside both artwork bounds with overlap between neighbours", () => {
    const regions = light(0).regions;
    for (const region of regions) {
      const angle = (region.angle * Math.PI) / 180;
      const dx = Math.hypot(region.rx * Math.cos(angle), region.ry * Math.sin(angle));
      const dy = Math.hypot(region.rx * Math.sin(angle), region.ry * Math.cos(angle));
      expect(region.x - dx).toBeGreaterThan(100);
      expect(region.x + dx).toBeLessThan(1540);
      expect(region.y - dy).toBeGreaterThan(400);
      expect(region.y + dy).toBeLessThan(870);
    }
    for (let i = 1; i < regions.length; i++)
      expect(regions[i].x - regions[i - 1].x).toBeLessThan(regions[i].rx);
  });
});
