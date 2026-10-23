import { describe, expect, it, vi } from "vitest";
import {
  createMosaicStory,
  insideStoryCopy,
  storyBasis,
  storyPoint,
  storyTileFrame,
  storySize,
} from "./mosaic-story";
import {
  dataCells,
  endingAccent,
  endingCalm,
  endingContextFrame,
  endingFoundation,
  endingId,
  endingInk,
  endingMarkFrame,
  endings,
  endingTimeline,
  endingWorkers,
  sourceSettles,
  storyAppearance,
  transitionEndingFrame,
  transitionEndingValue,
} from "./mosaic-ending";

const story = createMosaicStory(94, storyBasis(), { variant: "blend" });
describe("three endings of the same approved Blend", () => {
  it("defaults to All and uses 37 existing cells to write DATA without moving or duplicating any data", () => {
    expect(endingId("")).toBe("all");
    expect(endingId("?ending=sources")).toBe("sources");
    expect(endingId("?ending=all")).toBe("all");
    expect(endingId("?ending=bogus")).toBe("all");
    expect(endingId("?ending=quiet")).toBe("quiet");
    expect(dataCells).toHaveLength(37);
    // Whole-cell lettering is within half a cell of the full field's centre.
    const columns = dataCells.map((cell) => cell.column);
    const rows = dataCells.map((cell) => cell.row);
    expect(Math.abs((Math.min(...columns) + Math.max(...columns)) / 2 - 1.5)).toBeLessThanOrEqual(
      0.5,
    );
    expect((Math.min(...rows) + Math.max(...rows)) / 2).toBe(3);
    expect(new Set(dataCells.map((c) => `${c.column}:${c.row}`)).size).toBe(37);
    for (let seed = 0; seed < 100; seed++) {
      const scene = createMosaicStory(seed, storyBasis(), { variant: "blend" });
      const original = JSON.stringify(scene);
      for (const cell of dataCells) {
        const tile = scene.tiles.find(
          (tile) => tile.column === cell.column && tile.row === cell.row,
        )!;
        expect(tile).toBeDefined();
        expect(tile.accent).toBeUndefined();
      }
      for (const { id } of endings) {
        const timeline = endingTimeline(scene, id);
        expect(
          scene.tiles.filter((tile) => endingInk(tile, timeline, timeline.ends) > 0),
        ).toHaveLength(37);
        for (const tile of scene.tiles)
          expect(storyTileFrame(tile, scene, timeline.ends)).toMatchObject({
            ...tile.destination,
            installed: true,
          });
      }
      expect(JSON.stringify(scene)).toBe(original);
      expect(scene.tiles).toHaveLength(199);
    }
  });

  it("keeps Quiet source islands and platform colours, with only faint DATA emerging after assembly", () => {
    const quiet = endingTimeline(story, "quiet");
    expect(quiet.dataStarts).toBe(story.ends + 4);
    for (const mark of [...story.sources, ...story.platforms]) {
      expect(endingMarkFrame(story, mark, quiet, quiet.ends)).toEqual({
        ...storyPoint(mark.column, mark.row, story.basis),
        opacity: 1,
        scale: 1,
        flying: false,
      });
    }
    for (const tile of story.context)
      expect(endingContextFrame(story, tile, quiet, quiet.ends).opacity).toBe(1);
    for (const tile of story.tiles) {
      expect(endingInk(tile, quiet, story.ends)).toBe(0);
      expect(endingInk(tile, quiet, quiet.ends)).toBeLessThanOrEqual(0.22);
      expect(endingAccent(tile, quiet, quiet.ends)).toBe(1);
    }
    expect(endingFoundation(story, quiet, quiet.ends).every((tile) => tile.opacity === 0)).toBe(
      true,
    );
    expect(endingWorkers(quiet, quiet.ends)).toBe(0);
  });

  it("waits for each source's own fragments and agent deliveries, then gathers context before its logo", () => {
    for (let seed = 0; seed < 50; seed++) {
      const scene = createMosaicStory(seed, storyBasis(), { variant: "blend" });
      const plan = endingTimeline(scene, "sources");
      for (const mark of scene.sources) {
        const start = plan.contexts[mark.id];
        expect(start).toBeGreaterThanOrEqual(sourceSettles(scene, mark.id) + 2);
        const tiles = scene.tiles.filter((tile) => tile.source === mark.id);
        for (const tile of tiles) expect(storyTileFrame(tile, scene, start).installed).toBe(true);
        for (const tile of scene.context.filter((tile) => tile.markId === mark.id)) {
          expect(endingContextFrame(scene, tile, plan, start).opacity).toBe(1);
          expect(endingContextFrame(scene, tile, plan, plan.departures[mark.id]).opacity).toBe(0);
        }
        expect(endingMarkFrame(scene, mark, plan, plan.departures[mark.id]).opacity).toBe(1);
        expect(endingMarkFrame(scene, mark, plan, plan.departures[mark.id] + 6).opacity).toBe(0);
      }
      for (const mark of scene.platforms)
        expect(endingMarkFrame(scene, mark, plan, plan.ends).opacity).toBe(1);
    }
  });

  it("gathers all platforms last and fills their reserved footprints, leaving one continuous blue field", () => {
    const plan = endingTimeline(story, "all");
    const lastSource = Math.max(...story.sources.map((mark) => plan.departures[mark.id] + 6));
    const platformStarts = story.platforms.slice(1).map((mark) => plan.departures[mark.id]);
    expect(Math.min(...platformStarts)).toBeGreaterThan(lastSource);
    expect(plan.departures.arcitai).toBeGreaterThan(Math.max(...platformStarts) + 6);
    for (const mark of [...story.sources, ...story.platforms])
      expect(endingMarkFrame(story, mark, plan, plan.ends).opacity).toBe(0);
    for (const tile of story.tiles.filter((tile) => tile.accent))
      expect(endingAccent(tile, plan, plan.ends)).toBe(0);
    const fill = endingFoundation(story, plan, plan.ends);
    expect(fill).toHaveLength(25);
    expect(fill.every((tile) => tile.opacity === 1)).toBe(true);
    const cells = [...story.tiles, ...fill].map((cell) => `${cell.column}:${cell.row}`);
    expect(new Set(cells).size).toBe(224);
  });

  it("varies source count, category, fragment count and arrival without changing the carrier timing", () => {
    const counts = new Set<number>(),
      fragments = new Set<number>(),
      arrivals = new Set<number>();
    for (let seed = 0; seed < 200; seed++) {
      const scene = createMosaicStory(seed, storyBasis(), { variant: "blend" });
      const compact = createMosaicStory(seed, storyBasis(), { variant: "blend", compact: true });
      counts.add(scene.sources.length);
      expect([6, 7]).toContain(compact.sources.length);
      const categories = new Map<string, number>();
      for (const mark of scene.sources) {
        categories.set(mark.category!, (categories.get(mark.category!) ?? 0) + 1);
        fragments.add(mark.fragments!);
        arrivals.add(mark.appears!);
        expect(mark.appears).toBeGreaterThanOrEqual(0);
        expect(mark.appears).toBeLessThanOrEqual(mark.zone === "front" ? 8 : 20);
        for (const tile of scene.tiles.filter((tile) => tile.source === mark.id))
          expect(tile.appears).toBe(mark.appears);
      }
      expect(Math.max(...categories.values())).toBeLessThanOrEqual(2);
      for (const job of scene.jobs) {
        const tile = scene.tiles.find((tile) => tile.id === job.tileId)!;
        expect(job.starts + job.duration * 0.25).toBeGreaterThan(tile.appears! + 0.9);
      }
      expect(compact.jobs.map((job) => [job.tileId, job.starts, job.duration])).toEqual(
        scene.jobs.map((job) => [job.tileId, job.starts, job.duration]),
      );
    }
    expect([...counts].sort((a, b) => a - b)).toEqual([8, 9, 10, 11]);
    expect([...fragments].sort()).toEqual([2, 3]);
    expect(arrivals.size).toBeGreaterThan(1000);
  });

  it("shows the selected complete ending immediately for reduced motion and save-data", () => {
    for (const { id } of endings) {
      const plan = endingTimeline(story, id);
      for (const mark of [...story.sources, ...story.platforms])
        expect(endingMarkFrame(story, mark, plan, 0, true)).toEqual(
          endingMarkFrame(story, mark, plan, plan.ends),
        );
      for (const tile of story.context)
        expect(endingContextFrame(story, tile, plan, 0, true)).toEqual(
          endingContextFrame(story, tile, plan, plan.ends),
        );
      for (const tile of story.tiles) {
        expect(endingInk(tile, plan, 0, true)).toBe(endingInk(tile, plan, plan.ends));
        expect(endingAccent(tile, plan, 0, true)).toBe(endingAccent(tile, plan, plan.ends));
      }
      expect(storyAppearance(20, 0, true)).toEqual({ opacity: 1, rise: 0 });
      expect(endingWorkers(plan, 0, true)).toBe(0);
    }
  });

  it("keeps DATA present and workers hidden across late switches, including the complete state after rescheduled flights", () => {
    for (const before of endings)
      for (const after of endings) {
        const previous = endingTimeline(story, before.id);
        const now = previous.ends + 30;
        const next = endingTimeline(story, after.id, previous, now);
        expect(next.dataStarts).toBe(previous.dataStarts);
        expect(endingWorkers(previous, now)).toBe(0);
        for (let dt = 0; dt <= 1.2; dt += 0.1) {
          expect(
            transitionEndingValue(endingWorkers(previous, now), endingWorkers(next, now + dt), dt),
          ).toBe(0);
          for (const tile of story.tiles.filter((tile) => endingInk(tile, previous, now) > 0)) {
            const from = endingInk(tile, previous, now),
              target = endingInk(tile, next, now + dt);
            expect(transitionEndingValue(from, target, dt)).toBeGreaterThanOrEqual(
              Math.min(from, target) - 0.0001,
            );
          }
        }
        if (after.id !== "quiet")
          for (const mark of story.sources)
            expect(endingMarkFrame(story, mark, next, 0, true).opacity).toBe(0);
        if (after.id === "all")
          for (const mark of story.platforms)
            expect(endingMarkFrame(story, mark, next, 0, true).opacity).toBe(0);
      }
  });

  it("gives All a clear DATA pattern in both themes, while preserving brand accents and the outside field", async () => {
    const { readFile } = await vi.importActual<{
      readFile: (path: URL, encoding: "utf8") => Promise<string>;
    }>("node:fs/promises");
    const [mosaicCSS, storyCSS] = await Promise.all([
      readFile(new URL("./components/mosaic-hero.css", import.meta.url), "utf8"),
      readFile(new URL("./components/mosaic-composition.css", import.meta.url), "utf8"),
    ]);
    const all = endingTimeline(story, "all");
    const mix = (a: number[], b: number[], t: number) => a.map((n, i) => n * (1 - t) + b[i] * t);
    const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
    const blues = [...mosaicCSS.matchAll(/--mosaic-blue-[234]: (#[0-9a-f]+);/g)].map((match) =>
      rgb(match[1]),
    );
    const inks = [...storyCSS.matchAll(/--story-ink: (#[0-9a-f]+);/g)].map((match) =>
      rgb(match[1]),
    );
    const luminance = (colour: number[]) =>
      colour
        .map((n) => n / 255)
        .map((n) => (n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4))
        .reduce((sum, n, i) => sum + n * [0.2126, 0.7152, 0.0722][i], 0);
    const ratio = (a: number[], b: number[]) =>
      (Math.max(luminance(a), luminance(b)) + 0.05) / (Math.min(luminance(a), luminance(b)) + 0.05);
    const strokes = story.tiles.filter((tile) => endingInk(tile, all, all.ends) > 0);
    const background = story.tiles.filter((tile) => endingCalm(tile, all, all.ends) === 0.7);
    for (let theme = 0; theme < 2; theme++) {
      const palette = blues.slice(theme * 3, theme * 3 + 3);
      const colour = (tile: (typeof story.tiles)[number], shine = 0) => {
        const calm = endingCalm(tile, all, all.ends);
        return mix(
          mix(
            mix(palette[tile.level - 2], palette[1], calm),
            inks[theme],
            endingInk(tile, all, all.ends),
          ),
          [255, 255, 255],
          shine * (1 - calm * 0.8),
        );
      };
      for (const stroke of strokes)
        for (const base of background)
          for (const shine of [0, 0.26]) {
            const ink = colour(stroke, shine),
              bg = colour(base, shine);
            expect(ratio(ink, bg)).toBeGreaterThanOrEqual(3);
            expect(
              theme === 0 ? luminance(ink) < luminance(bg) : luminance(ink) > luminance(bg),
            ).toBe(true);
          }
    }
    for (const tile of story.tiles.filter(
      (tile) => tile.accent || tile.column < -7 || tile.column > 9,
    ))
      expect(endingCalm(tile, all, all.ends)).toBe(0);
    for (const tile of story.tiles) expect(endingCalm(tile, all, story.ends)).toBe(0);
  });

  it("can switch endings late without teleporting brands, resetting the field or restarting previous departures", () => {
    const quiet = endingTimeline(story, "quiet");
    const sources = endingTimeline(story, "sources", quiet, 300);
    expect(Math.min(...Object.values(sources.contexts))).toBeGreaterThan(300);
    const all = endingTimeline(story, "all", sources, 350);
    for (const mark of story.sources)
      expect(all.departures[mark.id]).toBe(sources.departures[mark.id]);
    for (const mark of story.platforms) expect(all.departures[mark.id]).toBeGreaterThan(350);
    const returning = endingTimeline(story, "quiet", all, 355);
    const mark = story.platforms[1];
    const before = endingMarkFrame(story, mark, all, 355);
    const target = endingMarkFrame(story, mark, returning, 355);
    expect(transitionEndingFrame(before, target, 0)).toEqual(before);
    expect(transitionEndingFrame(before, target, 1.2)).toEqual(target);
    const fade = transitionEndingFrame(before, target, 0.6);
    expect(fade.opacity).toBe(0);
    expect(transitionEndingValue(0.22, 0.32, 0)).toBe(0.22);
    expect(transitionEndingValue(0.22, 0.32, 1.2)).toBe(0.32);
    // A second click during the return uses the displayed frame, not the pre-transition pose.
    const midway = transitionEndingFrame(before, target, 0.3);
    expect(transitionEndingFrame(midway, before, 0)).toEqual(midway);
  });
});

describe("brand arrival and gathering geometry", () => {
  it("keeps complete plates and phone logos within margins and away from headline copy throughout the flights", () => {
    const basis = storyBasis();
    for (const compact of [false, true])
      for (let seed = 0; seed < 50; seed++) {
        const scene = createMosaicStory(seed, basis, { variant: "blend", compact });
        const plan = endingTimeline(scene, "all");
        const inside = (x: number, y: number, label: string) => {
          const bounds = compact ? [124, 1516, 424, 846] : [64, 1536, 64, 850];
          if (
            x < bounds[0] ||
            x > bounds[1] ||
            y < bounds[2] ||
            y > bounds[3] ||
            (!compact && insideStoryCopy({ x, y }, 4))
          )
            throw new Error(`${compact}/${seed}/${label}: ${x},${y}`);
        };
        for (const mark of [...scene.sources, ...scene.platforms]) {
          const start = plan.departures[mark.id];
          const times = [
            mark.appears ?? 0,
            (mark.appears ?? 0) + 0.3,
            ...Array.from({ length: 61 }, (_, i) => start + i / 10),
          ];
          for (const time of times) {
            const frame = endingMarkFrame(scene, mark, plan, time);
            if (frame.opacity < 0.001) continue;
            const size = (mark.span * 36.4 - 8.4) * frame.scale;
            for (const [u, v] of [
              [0, 0],
              [1, 0],
              [1, 1],
              [0, 1],
            ]) {
              const x = frame.x + size * (u * basis.ux + v * basis.vx),
                y = frame.y + size * (u * basis.uy + v * basis.vy);
              inside(x - 5, y - 5, mark.id);
              inside(x + 5, y + 11, mark.id);
            }
            const half =
              (compact ? (mark.id === "arcitai" ? 34 : 28) : mark.id === "arcitai" ? 21 : 14.5) *
              frame.scale;
            const cx = frame.x + (size * (basis.ux + basis.vx)) / 2,
              cy = frame.y + (size * (basis.uy + basis.vy)) / 2;
            for (const x of [-half - 5, half + 5])
              for (const y of [-half - 5, half + 5]) inside(cx + x, cy + y, `${mark.id} logo`);
          }
        }
        for (const tile of scene.tiles.filter((tile) => tile.source)) {
          const time = tile.appears! + 0.3;
          const frame = storyTileFrame(tile, scene, time);
          const arrival = storyAppearance(tile.appears, time);
          const angle = (frame.rotation * Math.PI) / 180;
          for (const [u, v] of [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1],
          ]) {
            const dx = storySize * (u * basis.ux + v * basis.vx),
              dy = storySize * (u * basis.uy + v * basis.vy);
            const x = frame.x + dx * Math.cos(angle) - dy * Math.sin(angle);
            const y = frame.y + dx * Math.sin(angle) + dy * Math.cos(angle) + arrival.rise;
            inside(x - 9, y - 9, tile.id + " arrival");
            inside(x + 9, y + 12, tile.id + " arrival");
          }
        }
        for (const tile of scene.context)
          for (const time of [
            scene.sources.find((mark) => mark.id === tile.markId)!.appears! + 0.3,
            ...Array.from({ length: 61 }, (_, i) => plan.contexts[tile.markId] + i * 0.05),
          ]) {
            const frame = endingContextFrame(scene, tile, plan, time);
            if (frame.opacity < 0.001) continue;
            for (const [u, v] of [
              [0, 0],
              [1, 0],
              [1, 1],
              [0, 1],
            ]) {
              const x = frame.x + storySize * 0.82 * frame.scale * (u * basis.ux + v * basis.vx),
                y = frame.y + storySize * 0.82 * frame.scale * (u * basis.uy + v * basis.vy);
              inside(x - 5, y - 5, tile.id);
              inside(x + 5, y + 8, tile.id);
            }
          }
      }
  });
});
