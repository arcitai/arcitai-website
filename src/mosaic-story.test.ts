import { dataCells, isDataCell } from "./mosaic-data";
import { describe, expect, it } from "vitest";
import { mosaicU, mosaicV } from "./mosaic-motion";
import { advancePointerTrails, storyEntityMotion } from "./mosaic-pointer";
import {
  compositionHref,
  compositionId,
  compositions,
  createMosaicStory,
  insideStoryCopy,
  storyAmbient,
  storyPointerEnergy,
  storyBasis,
  storyPoint,
  storySize,
  storyTileFrame,
  storyVisitSeed,
  storyWorkerFrames,
  usesLegacyMosaic,
  type StoryBasis,
  type StoryPoint,
} from "./mosaic-story";

const corners = (p: StoryPoint, size: number, basis: StoryBasis, rotation = 0, depth = 3) => {
  const angle = (rotation * Math.PI) / 180;
  return [
    [0, 0],
    [basis.ux, basis.uy],
    [basis.ux + basis.vx, basis.uy + basis.vy],
    [basis.vx, basis.vy],
  ].flatMap(([x, y]) =>
    [0, depth].map((z) => ({
      x: p.x + size * (x * Math.cos(angle) - y * Math.sin(angle)),
      y: p.y + size * (x * Math.sin(angle) + y * Math.cos(angle)) + z,
    })),
  );
};

describe("one conserved field across the compositions", () => {
  it("reserves four random platform slots, eight pickups and the lower-right Arc’IT mark across 1,000 visits", () => {
    const layouts = new Set<string>();
    for (let seed = 0; seed < 1000; seed++) {
      const story = createMosaicStory(seed, storyBasis(), { variant: "blend" });
      expect(story.tiles).toHaveLength(199);
      expect(new Set(story.tiles.map((t) => t.id)).size).toBe(199);
      const occupied = new Set(story.tiles.map((t) => `${t.column}:${t.row}`));
      expect(dataCells.every((cell) => occupied.has(`${cell.column}:${cell.row}`))).toBe(true);
      expect(
        story.tiles
          .filter((tile) => tile.accent)
          .every((tile) => !isDataCell(tile.column, tile.row)),
      ).toBe(true);
      for (const mark of story.platforms) {
        for (let c = mark.column; c < mark.column + mark.span; c++)
          for (let r = mark.row; r < mark.row + mark.span; r++) {
            const key = `${c}:${r}`;
            if (occupied.has(key)) throw new Error(`Overlapping tile or mark ${key}, seed ${seed}`);
            occupied.add(key);
          }
      }
      expect(occupied.size).toBe(224);
      expect(story.jobs).toHaveLength(8);
      expect(story.platforms.filter((mark) => mark.column === 16).length).toBeLessThanOrEqual(2);
      expect(story.platforms[0]).toMatchObject({ id: "arcitai", column: 13, row: 4, span: 3 });
      layouts.add(JSON.stringify(story.platforms.slice(1)));
    }
    // Six eligible platform spots keep the word clear while retaining many seeded arrangements.
    expect(layouts.size).toBeGreaterThan(100);
    expect(createMosaicStory(94)).toEqual(createMosaicStory(94));
  });

  it("keeps two context tiles beside each source after its two or three Blend fragments assemble, without duplicating data identities", () => {
    for (const { id } of compositions) {
      const story = createMosaicStory(94, storyBasis(), { variant: id });
      expect(story.tiles).toHaveLength(199);
      for (const brand of story.sources) {
        const tiles = story.tiles.filter(
          (tile) => tile.source === brand.id && tile.kind !== "carrier",
        );
        expect(tiles).toHaveLength(id === "blend" ? brand.fragments! : 5);
        expect(tiles.filter((tile) => brand.palette!.includes(tile.color))).toHaveLength(
          id === "blend" ? brand.fragments! - 1 : 4,
        );
        if (id === "blend")
          expect(story.context.filter((tile) => tile.markId === brand.id)).toHaveLength(2);
        expect(tiles.filter((tile) => !brand.palette!.includes(tile.color))).toHaveLength(1);
      }
      const moving = story.tiles.filter((tile) => tile.kind !== "ordered");
      expect(new Set(moving.map((t) => `${t.origin.x}:${t.origin.y}`)).size).toBe(moving.length);
      const framing = story.tiles.filter((tile) => tile.framing);
      expect(story.ghosts).toHaveLength(framing.length);
      if (id === "blend") {
        expect(framing.length).toBeGreaterThanOrEqual(12);
        expect(framing.length).toBeLessThanOrEqual(16);
      } else if (id.startsWith("frame")) {
        expect(framing.length).toBeGreaterThanOrEqual(20);
        expect(framing.length).toBeLessThanOrEqual(26);
      } else expect(framing).toHaveLength(0);
      if (id.endsWith("-sides")) {
        expect(story.sources.filter((mark) => mark.row < 0)).toHaveLength(4);
      }
    }
  });

  // Exhaustive scene sampling needs more time on shared CI runners.
  it("keeps source groups and carrier pads clear of plates and all other initial tile footprints", () => {
    // Separating-axis test on projected top faces, including the actual jitter and rotation.
    const intersects = (a: StoryPoint[], b: StoryPoint[]) => {
      for (const shape of [a, b])
        for (let i = 0; i < shape.length; i++) {
          const next = shape[(i + 1) % shape.length],
            here = shape[i];
          const nx = here.y - next.y,
            ny = next.x - here.x;
          const pa = a.map((p) => p.x * nx + p.y * ny),
            pb = b.map((p) => p.x * nx + p.y * ny);
          if (Math.max(...pa) <= Math.min(...pb) || Math.max(...pb) <= Math.min(...pa))
            return false;
        }
      return true;
    };
    const basis = storyBasis();
    for (const { id } of compositions)
      for (const compact of [false, true])
        for (let seed = 0; seed < 50; seed++) {
          const story = createMosaicStory(seed, basis, { variant: id, compact });
          const tileShapes = story.tiles.map((tile) => ({
            tile,
            shape: corners(
              storyTileFrame(tile, story, 0),
              storySize,
              basis,
              tile.rotation,
              0,
            ).filter((_, i) => i % 2 === 0),
          }));
          const markShapes = [...story.sources, ...story.platforms].map((mark) => ({
            id: mark.id,
            shape: corners(
              storyPoint(mark.column, mark.row, basis),
              mark.span * 36.4 - 8.4,
              basis,
              0,
              0,
            ).filter((_, i) => i % 2 === 0),
          }));
          const contextShapes = story.context.map((tile) => {
            const p = storyPoint(tile.column, tile.row, basis);
            p.x += storySize * 0.09 * (basis.ux + basis.vx);
            p.y += storySize * 0.09 * (basis.uy + basis.vy);
            return {
              id: tile.id,
              shape: corners(p, storySize * 0.82, basis, 0, 0).filter((_, i) => i % 2 === 0),
            };
          });
          const stationary = [...markShapes, ...contextShapes];
          for (let i = 0; i < stationary.length; i++) {
            for (let j = i + 1; j < stationary.length; j++) {
              if (intersects(stationary[i].shape, stationary[j].shape))
                throw new Error(
                  `${id}/${compact}/${seed}: ${stationary[i].id} overlaps ${stationary[j].id}`,
                );
            }
            for (const tile of tileShapes)
              if (intersects(stationary[i].shape, tile.shape))
                throw new Error(
                  `${id}/${compact}/${seed}: ${stationary[i].id} overlaps ${tile.tile.id}`,
                );
          }
          for (const { tile, shape } of tileShapes.filter(
            ({ tile }) => tile.source || tile.kind === "carrier",
          )) {
            for (const other of tileShapes)
              if (other.tile.id !== tile.id && intersects(shape, other.shape))
                throw new Error(
                  `${id}/${seed}: ${tile.source ?? "carrier"} ${tile.id} overlaps ${other.tile.source ?? other.tile.kind} ${other.tile.id}`,
                );
            for (const mark of markShapes)
              if (intersects(shape, mark.shape))
                throw new Error(`${id}/${seed}: ${tile.id} overlaps ${mark.id}`);
          }
        }
  }, 30000);

  it("installs every fragment as blue once, including Previous framing, with a complete static reduced-motion state", () => {
    for (const { id } of compositions) {
      const story = createMosaicStory(42, storyBasis(), { variant: id });
      for (const tile of story.tiles) {
        let previous = 0;
        for (let time = 0; time <= story.ends + 8; time += 0.4) {
          const frame = storyTileFrame(tile, story, time);
          if (frame.blue < previous) throw new Error(`Colour reset: ${id}/${tile.id}`);
          previous = frame.blue;
        }
        const final = storyTileFrame(tile, story, story.ends + 10);
        expect(final).toMatchObject({ ...tile.destination, blue: 1, rotation: 0, installed: true });
        expect(storyTileFrame(tile, story, 10000)).toEqual(final);
        expect(storyTileFrame(tile, story, 0, true)).toEqual(final);
      }
    }
  });

  it("moves the exact picked-up tile continuously through every handoff and keeps agents on continuous routes", () => {
    for (const variant of ["blend", "haze", "frame-sides"] as const) {
      const story = createMosaicStory(8, storyBasis(), { variant });
      expect(story.jobs.filter((j) => j.agent === "codex")).toHaveLength(4);
      expect(story.jobs.filter((j) => j.agent === "claude")).toHaveLength(4);
      for (const job of story.jobs) {
        const tile = story.tiles.find((t) => t.id === job.tileId)!;
        for (const beat of [0.25, 0.33, 0.73, 0.85, 1]) {
          const t = job.starts + job.duration * beat;
          const a = storyTileFrame(tile, story, t - 0.0001),
            b = storyTileFrame(tile, story, t + 0.0001);
          expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeLessThan(0.1);
        }
        const moving = storyTileFrame(tile, story, job.starts + job.duration * 0.5);
        expect(Math.hypot(moving.x - tile.origin.x, moving.y - tile.origin.y)).toBeGreaterThan(10);
      }
      for (let t = 0; t <= story.ends + 1; t += 0.2) {
        const a = storyWorkerFrames(story, t),
          b = storyWorkerFrames(story, t + 0.001);
        for (let i = 0; i < 2; i++)
          expect(Math.hypot(a[i].pose.x - b[i].pose.x, a[i].pose.y - b[i].pose.y)).toBeLessThan(1);
      }
    }
  });
});

describe("a complete silhouette inside the side margins", () => {
  it("fits whole tiles, brand plates, phone logos and agents throughout motion, with no solid shape crossing the copy", () => {
    const basis = storyBasis();
    for (const compact of [false, true])
      for (const { id } of compositions)
        for (const seed of [1, 94, 7654, 0, 27, 56, 127, 219, 372, 528]) {
          const story = createMosaicStory(seed, basis, { variant: id, compact });
          const bounds = compact
            ? { left: 124, right: 1516, top: 424, bottom: 846 }
            : { left: 64, right: 1536, top: 64, bottom: 850 };
          const inside = (p: StoryPoint, label: string) => {
            if (p.x < bounds.left || p.x > bounds.right || p.y < bounds.top || p.y > bounds.bottom)
              throw new Error(
                `${id}/${compact ? "compact" : "desktop"}/${seed} ${label} outside margin: ${JSON.stringify(p)}`,
              );
            if (!compact && insideStoryCopy(p, 4))
              throw new Error(`${id}/${seed} ${label} entered the copy: ${JSON.stringify(p)}`);
          };
          // Half-second samples cover the full paths. Include the maximum ambient/pointer lift,
          // rotation and side depth, rather than checking only the plate's centre.
          for (let time = 0; time < story.ends + 8; time += 0.5) {
            for (const tile of story.tiles) {
              const frame = storyTileFrame(tile, story, time);
              for (const p of corners(frame, storySize, basis, frame.rotation)) {
                inside({ x: p.x - 9, y: p.y - 9 }, `${tile.id}@${time}`);
                inside({ x: p.x + 9, y: p.y + 9 }, `${tile.id}@${time}`);
              }
            }
            for (const { pose } of storyWorkerFrames(story, time)) {
              // Includes Claude's extended tool and both sprites at the larger compact scale.
              for (const x of [-52, 52])
                for (const y of [-70, 5])
                  inside({ x: pose.x + x, y: pose.y + y }, `worker@${time}`);
            }
          }
          for (const mark of [...story.sources, ...story.platforms]) {
            const p = storyPoint(mark.column, mark.row, basis),
              size = mark.span * 36.4 - 8.4;
            for (const q of corners(p, size, basis, 0, 6)) {
              inside({ x: q.x - 5, y: q.y - 5 }, mark.id);
              inside({ x: q.x + 5, y: q.y + 5 }, mark.id);
            }
            const half = compact
              ? mark.id === "arcitai"
                ? 34
                : 28
              : mark.id === "arcitai"
                ? 21
                : 14.5;
            const cx = p.x + (size * (basis.ux + basis.vx)) / 2,
              cy = p.y + (size * (basis.uy + basis.vy)) / 2;
            for (const x of [-half, half])
              for (const y of [-half - 5, half + 5])
                inside({ x: cx + x + Math.sign(x) * 5, y: cy + y }, `${mark.id} logo`);
          }
          for (const tile of story.context) {
            const p = storyPoint(tile.column, tile.row, basis);
            p.x += storySize * 0.09 * (basis.ux + basis.vx);
            p.y += storySize * 0.09 * (basis.uy + basis.vy);
            for (const q of corners(p, storySize * 0.82, basis, 0, 2.5)) {
              inside({ x: q.x - 5, y: q.y - 5 }, tile.id);
              inside({ x: q.x + 5, y: q.y + 5 }, tile.id);
            }
          }
        }
  }, 15000);

  it("keeps the approved Balanced top-face proportions and turns the whole plane down-right", () => {
    const basis = storyBasis(8);
    expect(basis.axisDeg).toBeCloseTo(11.43, 1);
    expect(basis.ux).toBeGreaterThan(0);
    expect(basis.vx).toBeLessThan(0);
    expect(basis.vy).toBeGreaterThan(0);
    expect(basis.ux * basis.vy - basis.uy * basis.vx).toBeCloseTo(
      mosaicU.x * mosaicV.y - mosaicU.y * mosaicV.x,
      12,
    );
    expect(Math.hypot(basis.ux, basis.uy)).toBeCloseTo(Math.hypot(mosaicU.x, mosaicU.y), 12);
    expect(Math.hypot(basis.vx, basis.vy)).toBeCloseTo(Math.hypot(mosaicV.x, mosaicV.y), 12);
    expect(storyPoint(0, 4, basis)).toEqual({ x: 782, y: 609 });
  });

  it("collapses side sources into a visible front row on compact screens without changing tile or job identities", () => {
    for (const { id } of compositions) {
      const wide = createMosaicStory(94, storyBasis(), { variant: id });
      const compact = createMosaicStory(94, storyBasis(), { variant: id, compact: true });
      expect(compact.tiles.map((t) => t.id)).toEqual(wide.tiles.map((t) => t.id));
      expect(compact.jobs.map((j) => [j.tileId, j.agent, j.starts, j.duration])).toEqual(
        wide.jobs.map((j) => [j.tileId, j.agent, j.starts, j.duration]),
      );
      expect(
        compact.sources.every((mark) =>
          id === "blend" ? mark.zone === "front" || mark.zone === "under" : mark.row >= 8.6,
        ),
      ).toBe(true);
      if (id === "blend") expect([6, 7]).toContain(compact.sources.length);
      expect(compact.ghosts).toHaveLength(0);
    }
  });
});

describe("one motion and comparison system", () => {
  it("has a bounded travelling wave and local pointer lift on the same visible-time clock", () => {
    const lifts = new Set<string>();
    for (let time = 0; time < 90; time += 0.5)
      for (let c = -14; c <= 17; c++) {
        const ambient = storyAmbient(c, 4, time),
          pointer = storyAmbient(c, 4, time, 1);
        expect(ambient.lift).toBeGreaterThan(-1.61);
        expect(ambient.lift).toBeLessThan(0.31);
        expect(pointer.lift).toBeCloseTo(ambient.lift - 0.9, 10);
        expect(pointer.shine).toBeLessThanOrEqual(0.261);
        expect(storyAmbient(c, 4, time)).toEqual(ambient);
        lifts.add(ambient.lift.toFixed(1));
      }
    expect(lifts.size).toBeGreaterThan(15);
  });

  it("routes Previous to full current motion, keeps explicit archive access, and fixes the current camera", () => {
    expect(compositionId("")).toBe("blend");
    expect(compositionId("?mosaic=wings")).toBe("frame-sides");
    expect(usesLegacyMosaic("?mosaic=wings")).toBe(false);
    expect(usesLegacyMosaic("?mosaic=wings-archive")).toBe(true);
    expect(usesLegacyMosaic("?mosaic=chalk")).toBe(true);
    expect(compositionHref("contour", "?factory=example&mosaic=wings&angle=11&mosaicSeed=94")).toBe(
      "/?factory=example&mosaic=contour&angle=8&hero=mosaic#top",
    );
  });

  it("randomises normal reloads even from old pinned URLs, while explicit replay is deterministic", () => {
    expect(storyVisitSeed("?mosaicSeed=94")).toBeUndefined();
    expect(storyVisitSeed("?mosaicSeed=94&replay=1")).toBe(94);
    expect(storyVisitSeed("?mosaicSeed=0&replay=1")).toBe(0);
    expect(storyVisitSeed("?mosaicSeed=-4&replay=1")).toBeUndefined();
    expect(storyVisitSeed("?mosaicSeed=4294967296&replay=1")).toBeUndefined();
  });
});

describe("Blend source distribution and restrained movement", () => {
  it("varies thirty-nine source brands around and in front of the field, and keeps platform colours after assembly", () => {
    const seen = new Set<string>();
    const layouts = new Set<string>();
    for (let seed = 0; seed < 200; seed++) {
      const story = createMosaicStory(seed, storyBasis(), { variant: "blend" });
      expect([8, 9, 10, 11]).toContain(story.sources.length);
      expect(new Set(story.sources.map((m) => m.id)).size).toBe(story.sources.length);
      expect(story.sources.filter((m) => m.zone === "front")).toHaveLength(4);
      expect([1, 2]).toContain(story.sources.filter((m) => m.zone === "under").length);
      expect([1, 2, 3]).toContain(story.sources.filter((m) => m.zone === "left").length);
      expect([1, 2, 3]).toContain(story.sources.filter((m) => m.zone === "right").length);
      for (const id of ["shopify", "klaviyo"]) {
        const mark = story.sources.find((mark) => mark.id === id)!;
        expect(["front", "under"]).toContain(mark.zone);
      }
      story.sources.forEach((m) => seen.add(m.id));
      layouts.add(JSON.stringify(story.sources));
      const accents = story.tiles.filter((tile) => tile.accent);
      expect(accents).toHaveLength(14);
      for (const mark of story.platforms) {
        const colours = accents.filter((tile) => tile.accent === mark.id);
        expect(colours).toHaveLength(mark.id === "arcitai" ? 2 : 3);
        for (const tile of colours) {
          expect(tile.kind).toBe("ordered");
          expect(tile.finish).toBeTruthy();
          expect(tile.source).toBeUndefined();
          expect(
            Math.max(
              mark.column - tile.column,
              tile.column - (mark.column + mark.span - 1),
              mark.row - tile.row,
              tile.row - (mark.row + mark.span - 1),
              0,
            ),
          ).toBeLessThanOrEqual(2);
        }
      }
      expect(story.context).toHaveLength(story.sources.length * 2);
      expect(story.ends).toBeGreaterThan(165);
      expect(story.ends).toBeLessThan(210);
      for (const agent of ["codex", "claude"] as const) {
        const jobs = story.jobs.filter((j) => j.agent === agent);
        for (let i = 1; i < jobs.length; i++) {
          const gap = jobs[i].starts - jobs[i - 1].starts - jobs[i - 1].duration;
          expect(gap).toBeGreaterThanOrEqual(22);
          expect(gap).toBeLessThanOrEqual(32);
          const idle = storyWorkerFrames(story, jobs[i].starts - 0.1).find(
            (w) => w.name === agent,
          )!;
          expect(idle.pose.action).toBe("idle");
          expect(idle.pose.x).toBeCloseTo(jobs[i].from.x);
        }
      }
    }
    expect(seen.size).toBe(39);
    expect(layouts.size).toBe(200);
  });

  it("leaves a short mouse trail which settles even under a stationary pointer", () => {
    expect(storyPointerEnergy(0, 20, 14, false, 1 / 24)).toBe(0);
    expect(storyPointerEnergy(0, 141, 14, true, 1 / 24)).toBe(0);
    const centres = [{ id: "brand", point: { x: 60, y: 40 } }];
    let trails = advancePointerTrails({}, centres, { x: 40, y: 40 }, 14, true, 1 / 24);
    expect(trails.brand.energy).toBeGreaterThan(0.7);
    expect(trails.brand.dx).toBe(1);
    const tile = storyEntityMotion(2, 4, 1, trails.brand);
    const mark = storyEntityMotion(2, 4, 1, trails.brand, 0.6);
    expect(mark.x).toBeCloseTo(tile.x * 0.6);
    expect(mark.y).toBeCloseTo(tile.y * 0.6);
    expect(Math.abs(tile.x)).toBeLessThanOrEqual(4);
    expect(Math.abs(tile.y)).toBeLessThanOrEqual(6.5);
    expect(tile.scale).toBeLessThanOrEqual(1.035);
    for (let i = 0; i < 24; i++)
      trails = advancePointerTrails(trails, centres, { x: 40, y: 40 }, 0, false, 1 / 24);
    expect(trails.brand.energy).toBeLessThan(0.04);
    expect(trails.brand.dx).toBe(1);
    for (let i = 0; i < 80; i++)
      trails = advancePointerTrails(trails, centres, null, 0, false, 1 / 24);
    expect(trails.brand.energy).toBe(0);
  });
});
