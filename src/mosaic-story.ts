import { blendSourceSlots, blendSources, platformAccentCells } from "./mosaic-blend";
import type { AgentName, AgentPose } from "./factory-agent-motion";
import { mosaicPitch, mosaicRandom, mosaicU, mosaicV } from "./mosaic-motion";

export const compositions = [
  {
    id: "blend",
    label: "Blend",
    description: "Soft haze, a sparse frame and changing sources around and in front of the field.",
  },
  { id: "haze", label: "Haze", description: "A clearer wash of warm and cool light." },
  {
    id: "haze-sides",
    label: "Haze + sources",
    description: "Soft light with source islands beside the text.",
  },
  {
    id: "contour",
    label: "Contour",
    description: "Quiet contours around the organised foundation.",
  },
  {
    id: "contour-sides",
    label: "Contour + sources",
    description: "Contours and coloured source islands.",
  },
  {
    id: "frame",
    label: "Frame",
    description: "Previous, simplified: a sparse frame that settles into the field.",
  },
  {
    id: "frame-sides",
    label: "Frame + sources",
    description: "The calmer Previous with source icons and the full data story.",
  },
] as const;
const earlierCompositions = ["quiet", "reflection", "glass", "swell"] as const;
export type CompositionId =
  (typeof compositions)[number]["id"] | (typeof earlierCompositions)[number];
const legacy = new Set(["chalk", "ash", "slate", "graphite", "ember", "signal", "wings-archive"]);
export function usesLegacyMosaic(search: string) {
  return legacy.has(new URLSearchParams(search).get("mosaic") ?? "");
}
export function compositionId(search: string): CompositionId {
  const id = new URLSearchParams(search).get("mosaic");
  if (id === "wings") return "frame-sides";
  return (
    [...compositions.map((item) => item.id), ...earlierCompositions].find((item) => item === id) ??
    "blend"
  );
}
export function compositionHref(id: CompositionId | "wings", search: string) {
  const params = new URLSearchParams(search);
  params.set("mosaic", id);
  params.set("hero", "mosaic");
  params.set("angle", "8");
  params.delete("mosaicSeed");
  params.delete("replay");
  return `/?${params}#top`;
}
export function compositionFamily(id: CompositionId) {
  return id.replace("-sides", "");
}

export type StoryPoint = { x: number; y: number };
export const storySize = 28;
export const storyAngles = [5, 8, 11] as const;
export type StoryAngle = (typeof storyAngles)[number];
export function storyAngle(search: string): StoryAngle {
  const value = new URLSearchParams(search).get("angle");
  return storyAngles.find((angle) => String(angle) === value) ?? 8;
}
export function storyVisitSeed(search: string) {
  const params = new URLSearchParams(search);
  if (params.get("replay") !== "1") return undefined;
  const value = params.get("mosaicSeed");
  if (!value || !/^\d+$/.test(value)) return undefined;
  const seed = Number(value);
  return Number.isInteger(seed) && seed <= 4294967295 ? seed : undefined;
}
export function storyAngleHref(angle: StoryAngle, search: string, seed?: number) {
  const params = new URLSearchParams(search);
  params.set("angle", String(angle));
  params.set("hero", "mosaic");
  if (seed !== undefined) {
    params.set("mosaicSeed", String(seed));
    params.set("replay", "1");
  }
  return `/?${params}#top`;
}
/** Rotate Previous's whole floor, preserving its top-face proportions and viewing elevation. */
export function storyBasis(angle: StoryAngle = 8) {
  const radians = (angle * Math.PI) / 180;
  const c = Math.cos(radians);
  const s = Math.sin(radians);
  const ux = mosaicU.x * c - mosaicU.y * s;
  const uy = mosaicU.x * s + mosaicU.y * c;
  const vx = mosaicV.x * c - mosaicV.y * s;
  const vy = mosaicV.x * s + mosaicV.y * c;
  // All angle comparisons turn about the same centre of the approved field.
  return {
    ux,
    uy,
    vx,
    vy,
    ox: 782 - 4 * mosaicPitch * vx,
    oy: 609 - 4 * mosaicPitch * vy,
    axisDeg: (Math.atan2(uy, ux) * 180) / Math.PI,
  };
}
export type StoryBasis = ReturnType<typeof storyBasis>;
export const storyProjection = storyBasis();
export function storyPoint(column: number, row: number, basis = storyProjection): StoryPoint {
  return {
    x: basis.ox + mosaicPitch * (column * basis.ux + row * basis.vx),
    y: basis.oy + mosaicPitch * (column * basis.uy + row * basis.vy),
  };
}
/** Phones keep the approved row axis, tile size and field centre, and only steepen the
 * column axis. The 32-column field then reads as a taller down-right ramp instead of a
 * thin strip; the rows, letters and plates keep their Balanced viewing direction. */
export const storyPhoneAxis = 30;
export function storyPhoneBasis(axis = storyPhoneAxis): StoryBasis {
  const balanced = storyBasis(8);
  const length = Math.hypot(balanced.ux, balanced.uy);
  const radians = (axis * Math.PI) / 180;
  // The origin depends only on the row axis, so column 0, row 4 stays at (782, 609).
  return {
    ...balanced,
    ux: length * Math.cos(radians),
    uy: length * Math.sin(radians),
    axisDeg: axis,
  };
}
// Cells, relative to a compact source slot, that its plate, data fragments, context
// tiles and agent pickups can occupy, including the seeded slot jitter.
const compactGroupExtent = {
  front: { left: -1.3, right: 3.17, top: -2.05, bottom: 3.31 },
  under: { left: -2.15, right: 3.86, top: 0, bottom: 1.96 },
} as const;
/** The phone crop: the complete field and every compact source group, plus room for
 * scattered origins, flights, ambient lift and agents. Derived from the camera. */
export function storyPhoneFrame(basis: StoryBasis) {
  const cell = storySize / mosaicPitch;
  const points = [
    storyPoint(-14, 0, basis),
    storyPoint(17 + cell, 0, basis),
    storyPoint(17 + cell, 6 + cell, basis),
    storyPoint(-14, 6 + cell, basis),
  ];
  for (const slot of blendSourceSlots) {
    if (slot.zone !== "front" && slot.zone !== "under") continue;
    const extent = compactGroupExtent[slot.zone];
    for (const column of [slot.column + extent.left, slot.column + extent.right])
      for (const row of [slot.row + extent.top, slot.row + extent.bottom])
        points.push(storyPoint(column, row, basis));
  }
  const x = Math.floor(Math.min(...points.map((p) => p.x)) - 16);
  const y = Math.floor(Math.min(...points.map((p) => p.y)) - 34);
  const width = Math.ceil(Math.max(...points.map((p) => p.x)) + 16 - x);
  const height = Math.ceil(Math.max(...points.map((p) => p.y)) + 24 - y);
  return { x, y, width, height };
}
export const sourceBrands = [
  {
    id: "slack",
    label: "Slack",
    file: "slack-vector.svg",
    color: "#36c5f0",
    column: -14,
    row: 8.6,
  },
  {
    id: "hubspot",
    label: "HubSpot",
    file: "hubspot.svg",
    color: "#ff7a59",
    column: -10.4,
    row: 8.76,
  },
  {
    id: "teams",
    label: "Microsoft Teams",
    file: "teams.svg",
    color: "#5b5fc7",
    column: -6.8,
    row: 8.92,
  },
  {
    id: "salesforce",
    label: "Salesforce",
    file: "salesforce.svg",
    color: "#00a1e0",
    column: -3.2,
    row: 9.08,
  },
  { id: "notion", label: "Notion", file: "notion.svg", color: "#545454", column: 0.4, row: 9.24 },
  { id: "github", label: "GitHub", file: "github.svg", color: "#6e7681", column: 4, row: 9.4 },
] as const;
export type StoryMark = {
  id: string;
  label: string;
  file: string;
  column: number;
  row: number;
  span: number;
  color?: string;
  palette?: readonly string[];
  zone?: "left" | "right" | "under" | "front";
  slot?: number;
  category?: string;
  appears?: number;
  fragments?: number;
};
const sourcePalettes = [
  ["#1ab9ff", "#41b658", "#fcc003", "#e3066a"],
  ["#ff7a59", "#ff7a59", "#ff7a59", "#ff7a59"],
  ["#5059c9", "#7b83eb", "#5059c9", "#7b83eb"],
  ["#00b3ff", "#00b3ff", "#00b3ff", "#00b3ff"],
  ["var(--story-dark-brand)", "#e9e9e7", "var(--story-dark-brand)", "#e9e9e7"],
  ["var(--story-dark-brand)", "#8c959f", "var(--story-dark-brand)", "#8c959f"],
];
const sideSources = [
  [-16.74, 6],
  [-17.68, 0.18],
  [-18.56, -5.8],
  [3.74, -15.13],
  [8.01, -11.43],
  [12.05, -7.63],
];
export const platformSlots = [
  [6, 1],
  [8, 3],
  [9, 0],
  [11, 1],
  [16, 1],
  [16, 3],
  [10, 4],
  [16, 5],
] as const;
export function storyPlatforms(seed: number, withAccents = false): StoryMark[] {
  const slots = platformSlots
    .map((slot, index) => ({ slot, order: mosaicRandom(seed, 4000 + index) }))
    // Keep the centred DATA strokes clear in Blend, including the endings that retain platforms.
    .filter(({ slot }) => !withAccents || slot[0] > 8)
    .sort((a, b) => a.order - b.order)
    .map(({ slot }) => slot);
  const names = [
    { id: "databricks", label: "Databricks", file: "databricks.svg" },
    { id: "azure", label: "Microsoft Azure", file: "azure.svg" },
    { id: "fabric", label: "Microsoft Fabric", file: "fabric.svg" },
    { id: "delta", label: "Delta Lake", file: "delta-lake.svg" },
  ];
  const marks = (selected: readonly (readonly [number, number])[]): StoryMark[] => [
    {
      id: "arcitai",
      label: "Arc’IT AI",
      file: "../arcitai-mark-final.svg",
      column: 13,
      row: 4,
      span: 3,
    },
    ...names.map((mark, index) => ({
      ...mark,
      column: selected[index][0],
      row: selected[index][1],
      span: 2,
    })),
  ];
  for (let a = 0; a < slots.length - 3; a++)
    for (let b = a + 1; b < slots.length - 2; b++)
      for (let c = b + 1; c < slots.length - 1; c++)
        for (let d = c + 1; d < slots.length; d++) {
          const selected = [slots[a], slots[b], slots[c], slots[d]];
          if (selected.filter(([column]) => column === 16).length > 2) continue;
          const result = marks(selected);
          if (!withAccents || platformAccentCells(result, seed)) return result;
        }
  throw new Error("No platform layout with clear accent cells");
}
export const storyReadableEllipse = { x: 800, y: 280, rx: 380, ry: 175 };
export function insideStoryCopy(p: StoryPoint, margin = 0) {
  const q = storyReadableEllipse;
  return ((p.x - q.x) / (q.rx + margin)) ** 2 + ((p.y - q.y) / (q.ry + margin)) ** 2 < 1;
}
/** The travelling crest/ripple used by Gustav Online, at the calmer scale of these plates. */
export function storyAmbient(column: number, row: number, seconds: number, energy = 0, seed = 0) {
  const crest = Math.max(0, Math.sin(seconds * 1.2 - column * 0.33 - row * 0.21)) ** 3;
  const ripple = Math.sin(seconds * 0.9 - column * 0.19 + row * 0.42);
  const bob = 0.55 * Math.sin(seconds * 2.1 + seed * 40) + 0.45 * ripple;
  return {
    lift: -(crest * 1.3 + energy * 0.9) + bob * 0.3,
    shine: crest * 0.12 + energy * 0.14,
    scale: 1 + crest * 0.02 + energy * 0.015,
  };
}
export function storyPointerEnergy(
  previous: number,
  distance: number,
  speed: number,
  moved: boolean,
  seconds: number,
) {
  const decay = Math.pow(0.877, Math.max(0, seconds) * 24);
  const impulse = moved ? Math.max(0, 1 - distance / 140) ** 2 * Math.min(1, speed / 14) : 0;
  return Math.min(1, Math.max(0, previous) * decay + impulse);
}

export type StoryTile = {
  id: string;
  column: number;
  row: number;
  origin: StoryPoint;
  destination: StoryPoint;
  control?: StoryPoint;
  rotation: number;
  color: string;
  level: number;
  starts: number;
  duration: number;
  kind: "ordered" | "wave" | "carrier";
  job?: number;
  source?: string;
  appears?: number;
  framing?: "left" | "right";
  finish?: string;
  accent?: string;
};
export type StoryJob = {
  tileId: string;
  agent: AgentName;
  from: StoryPoint;
  source: StoryPoint;
  target: StoryPoint;
  starts: number;
  duration: number;
};
export type StoryContext = {
  id: string;
  column: number;
  row: number;
  color: string;
  markId: string;
};
export type MosaicStory = {
  tiles: StoryTile[];
  jobs: StoryJob[];
  ends: number;
  seed: number;
  basis: StoryBasis;
  sources: StoryMark[];
  platforms: StoryMark[];
  ghosts: StoryPoint[];
  sideIslands: boolean;
  context: StoryContext[];
  compact: boolean;
};
const mix = (a: StoryPoint, b: StoryPoint, t: number): StoryPoint => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const ease = (v: number) => {
  const t = clamp(v);
  return t * t * (3 - 2 * t);
};
const foot = (p: StoryPoint, basis: StoryBasis): StoryPoint => ({
  x: p.x + (storySize * (basis.ux + basis.vx)) / 2,
  y: p.y + (storySize * (basis.uy + basis.vy)) / 2 + 3,
});
const parcel = (p: StoryPoint): StoryPoint => ({ x: p.x + 20, y: p.y - 30 });

export function createMosaicStory(
  seed: number,
  basis = storyProjection,
  options: { variant?: CompositionId; compact?: boolean } = {},
): MosaicStory {
  const variant = options.variant ?? "haze";
  const blend = variant === "blend";
  const sideIslands = (blend || variant.endsWith("-sides")) && !options.compact;
  const framed = (blend || compositionFamily(variant) === "frame") && !options.compact;
  const point = (column: number, row: number) => storyPoint(column, row, basis);
  const existingSources: StoryMark[] = sourceBrands.map((brand, index) => ({
    palette: sourcePalettes[index],
    category: ["communication", "crm", "communication", "crm", "documents", "development"][index],
    ...brand,
    column: sideIslands ? sideSources[index][0] : brand.column,
    row: sideIslands ? sideSources[index][1] : brand.row,
    span: sideIslands ? 1.6 : 1.8,
  }));
  const sources = blend ? blendSources(seed, !!options.compact, existingSources) : existingSources;
  const platforms = storyPlatforms(seed, blend);
  const accents = blend ? platformAccentCells(platforms, seed)! : [];
  const context: StoryContext[] = [];
  const tiles: StoryTile[] = [];
  const jobs: StoryJob[] = [];
  let index = 0;
  const carrierCells = Array.from({ length: 8 }, (_, i) => ({
    column: 5 - Math.floor(i / 2),
    row: 5 + (i % 2),
  }));
  for (let row = 0; row < 7; row++) {
    for (let column = -14; column <= 17; column++) {
      if (
        platforms.some(
          (mark) =>
            column >= mark.column &&
            column < mark.column + mark.span &&
            row >= mark.row &&
            row < mark.row + mark.span,
        )
      )
        continue;
      const n = index++;
      const destination = point(column, row);
      const job = carrierCells.findIndex((cell) => cell.column === column && cell.row === row);
      const ordered = column >= 2 && job < 0;
      const accent = accents.find((cell) => cell.column === column && cell.row === row);
      tiles.push({
        id: `cell-${column}-${row}`,
        column,
        row,
        destination,
        origin: ordered
          ? destination
          : {
              x: destination.x + (mosaicRandom(seed, n) - 0.5) * 18,
              y: destination.y + (mosaicRandom(seed, n + 400) - 0.5) * 12,
            },
        rotation: ordered ? 0 : (mosaicRandom(seed, n + 1200) - 0.5) * 8,
        color: `var(--mosaic-${blend ? "unsorted" : "orange"}-${1 + Math.floor(mosaicRandom(seed, n + 1600) * 4)})`,
        level: 2 + Math.floor(mosaicRandom(seed, n + 800) * 3),
        ...(accent ? { finish: accent.color, accent: accent.brand } : {}),
        kind: job >= 0 ? "carrier" : ordered ? "ordered" : "wave",
        starts: blend
          ? 20 + (1 - column) * 7 + row * 0.5 + mosaicRandom(seed, n + 2000) * 4
          : 6 + (1 - column) * 2.1 + row * 0.18 + mosaicRandom(seed, n + 2000) * 1.8,
        duration: blend ? 8 + mosaicRandom(seed, n + 2400) * 4 : 2.2 + mosaicRandom(seed, n + 2400),
        ...(job >= 0 ? { job } : {}),
      });
    }
  }
  // Origin reassignment conserves every identity and reserves its destination immediately.
  const available = new Set(tiles.filter((tile) => tile.kind !== "carrier" && !tile.accent));
  const take = (origin: StoryPoint, side?: "left" | "right" | "under") => {
    // "Under" is a field position under the approved camera, so the phone camera keeps its pool.
    const eligible = [...available].filter((tile) =>
      side === "left"
        ? tile.destination.x <= 470
        : side === "right"
          ? tile.destination.x >= 1080
          : side === "under"
            ? storyPoint(tile.column, tile.row).x >= 880
            : tile.kind === "wave",
    );
    const tile = eligible.sort(
      (a, b) =>
        Math.hypot(a.destination.x - origin.x, a.destination.y - origin.y) -
        Math.hypot(b.destination.x - origin.x, b.destination.y - origin.y),
    )[0];
    if (!tile) return undefined;
    available.delete(tile);
    tile.origin = origin;
    tile.kind = "wave";
    // Side fragments descend beside the copy before curving into the field.
    if (side === "left" || side === "right") tile.control = { x: origin.x, y: tile.destination.y };
    tile.rotation = 0;
    return tile;
  };
  const offsets = [
    [-0.95, 0.2],
    [-0.95, 1.15],
    [1.8, 1.2],
    [0.4, 2.05],
    [1.45, 2.15],
  ];
  sources.forEach((brand, brandIndex) => {
    const group =
      blend && brand.zone === "under"
        ? [
            [-0.95, 0.1],
            [-1.9, 0.35],
            [1.75, 0.15],
            [2.7, 0.2],
            [-0.95, 1.05],
          ]
        : offsets;
    const palette = brand.palette!;
    group.forEach(([dc, dr], i) => {
      if (blend && i >= 3) {
        context.push({
          id: `context-${brand.id}-${i}`,
          column: brand.column + dc,
          row: brand.row + dr,
          color: palette[i - 1],
          markId: brand.id,
        });
        return;
      }
      if (blend && i >= brand.fragments!) return;
      const origin = point(brand.column + dc, brand.row + dr);
      const side = blend
        ? brand.zone === "front"
          ? undefined
          : brand.zone
        : sideIslands
          ? brandIndex < 3
            ? "left"
            : "right"
          : undefined;
      const tile = take(origin, side);
      if (!tile) throw new Error("No destination available for a source fragment");
      tile.source = brand.id;
      if (blend) tile.appears = brand.appears;
      tile.color =
        i < (blend ? brand.fragments! - 1 : 4)
          ? palette[i]
          : blend
            ? "var(--mosaic-unsorted-2)"
            : "var(--mosaic-neutral)";
      tile.starts = blend
        ? 45 + brandIndex * 7 + i * 5 + (brand.appears ?? 0)
        : 26 + brandIndex * 2.8 + i * 1.5;
      tile.duration =
        (blend ? 12 : 5) + mosaicRandom(seed, brandIndex * 5 + i + 2800) * (blend ? 5 : 2);
    });
  });
  const first: AgentName = mosaicRandom(seed, 3100) > 0.5 ? "codex" : "claude";
  const names: AgentName[] = [first, first === "codex" ? "claude" : "codex"];
  for (let i = 0; i < 8; i++) {
    const tile = tiles.find((candidate) => candidate.job === i)!;
    const brand = blend
      ? sources.filter((mark) => mark.zone === "front")[i % 4]
      : sources[sideIslands ? (i % 2 ? 5 : 0) : i % sources.length];
    if (blend) {
      tile.origin = point(brand.column + 2.05, brand.row - (i < 4 ? 0.85 : 1.8));
      tile.source = brand.id;
      tile.appears = brand.appears;
    } else if (sideIslands) {
      const pad = Math.floor(i / 2);
      tile.origin =
        i % 2
          ? point(brand.column - (pad < 2 ? 2.6 : 3.5), brand.row + (pad % 2) * 0.95)
          : point(brand.column + [0.4, 1.35][pad % 2], brand.row - [1.05, 2][Math.floor(pad / 2)]);
    } else
      tile.origin =
        i < 6
          ? point(brand.column + 2.05, brand.row - 0.85)
          : point(brand.column + 1.55, brand.row + 3.5);
    tile.color = brand.palette?.[0] ?? brand.color ?? "var(--mosaic-neutral)";
    const previous = jobs[i - 2];
    const duration = 19 + mosaicRandom(seed, 3200 + i) * 3;
    const starts = previous
      ? previous.starts + previous.duration + (blend ? 22 + mosaicRandom(seed, 3400 + i) * 10 : 0)
      : blend
        ? 5 + i * 13
        : 2 + i * 7;
    jobs.push({
      tileId: tile.id,
      agent: names[i % 2],
      from: previous
        ? foot(previous.target, basis)
        : blend
          ? foot(tile.origin, basis)
          : point(i ? 14 : -13, i ? -0.6 : 9),
      source: tile.origin,
      target: tile.destination,
      starts,
      duration,
    });
  }
  const ghosts: StoryPoint[] = [];
  if (framed) {
    const occupied = [
      ...sources.map((mark) => point(mark.column, mark.row)),
      ...context.map((tile) => point(tile.column, tile.row)),
      ...tiles.filter((tile) => tile.source || tile.kind === "carrier").map((tile) => tile.origin),
    ];
    for (const side of ["left", "right"] as const) {
      const candidates: { p: StoryPoint; order: number }[] = [];
      for (let row = -24; row < 2; row++)
        for (let column = -24; column <= 20; column++) {
          const p = point(column, row);
          const corners = [
            [0, 0],
            [basis.ux, basis.uy],
            [basis.ux + basis.vx, basis.uy + basis.vy],
            [basis.vx, basis.vy],
          ].map(([x, y]) => ({ x: p.x + storySize * x, y: p.y + storySize * y + 3 }));
          const fits = corners.every((q) =>
            side === "left"
              ? q.x > 80 && q.x < 390 && q.y > 220 && q.y < 470
              : q.x > 1210 && q.x < 1520 && q.y > 230 && q.y < 600,
          );
          const belowField =
            p.y + storySize * (basis.uy + basis.vy) >=
            basis.oy + ((p.x - basis.ox) * basis.uy) / basis.ux - 12;
          if (!fits || belowField || occupied.some((q) => Math.hypot(q.x - p.x, q.y - p.y) < 65))
            continue;
          candidates.push({ p, order: mosaicRandom(seed, (row + 24) * 50 + column + 6000) });
        }
      candidates.sort((a, b) => a.order - b.order);
      for (const { p } of candidates.slice(
        0,
        side === "left" ? (blend ? 10 : 18) : blend ? 6 : 8,
      )) {
        const tile = take(p, side);
        if (!tile) break;
        tile.framing = side;
        tile.color = blend ? "var(--mosaic-unsorted-2)" : "var(--mosaic-neutral)";
        tile.starts =
          (blend ? 30 : 18) +
          Math.hypot(tile.destination.x - p.x, tile.destination.y - p.y) / (blend ? 9 : 25);
        tile.duration =
          (blend ? 12 : 6) + mosaicRandom(seed, ghosts.length + 8000) * (blend ? 4 : 2);
        ghosts.push(p);
      }
    }
  }
  return {
    tiles,
    jobs,
    sources,
    platforms,
    ghosts,
    sideIslands,
    context,
    compact: !!options.compact,
    seed,
    basis,
    ends: Math.max(
      ...jobs.map((job) => job.starts + job.duration),
      ...tiles.map((tile) => tile.starts + tile.duration),
    ),
  };
}

function jobPose(job: StoryJob, seconds: number, basis: StoryBasis): AgentPose {
  if (seconds < job.starts)
    return {
      ...job.from,
      floor: 0,
      facing: job.source.x >= job.from.x ? 1 : -1,
      action: "idle",
      phase: 0,
      opacity: 1,
    };
  const p = clamp((seconds - job.starts) / job.duration);
  const source = foot(job.source, basis);
  const target = foot(job.target, basis);
  let position: StoryPoint;
  let facing: 1 | -1;
  let action: AgentPose["action"];
  if (p < 0.25) {
    position = mix(job.from, source, ease(p / 0.25));
    facing = source.x >= job.from.x ? 1 : -1;
    action = "walk";
  } else if (p < 0.33) {
    position = source;
    facing = target.x >= source.x ? 1 : -1;
    action = "work";
  } else if (p < 0.73) {
    const t = ease((p - 0.33) / 0.4);
    position = mix(source, target, t);
    // A shallow path stays in front of the plates while travelling.
    position.y += Math.sin(t * Math.PI) * 18;
    facing = target.x >= source.x ? 1 : -1;
    action = "walk";
  } else {
    position = target;
    facing = 1;
    action = p < 0.85 ? "work" : "idle";
  }
  return { ...position, floor: 0, facing, action, phase: seconds * 0.7, opacity: 1 };
}

export function storyTileFrame(
  tile: StoryTile,
  story: MosaicStory,
  seconds: number,
  complete = false,
) {
  if (complete || tile.kind === "ordered")
    return { ...tile.destination, rotation: 0, blue: 1, installed: true };
  if (tile.kind === "carrier") {
    const job = story.jobs[tile.job!];
    const p = (seconds - job.starts) / job.duration;
    if (p < 0.25) return { ...tile.origin, rotation: tile.rotation, blue: 0, installed: false };
    if (p >= 0.85) return { ...tile.destination, rotation: 0, blue: 1, installed: true };
    const pose = jobPose(job, seconds, story.basis);
    const carried = parcel(pose);
    const position =
      p < 0.33
        ? mix(tile.origin, carried, ease((p - 0.25) / 0.08))
        : p < 0.73
          ? carried
          : mix(carried, tile.destination, ease((p - 0.73) / 0.12));
    return {
      ...position,
      rotation: tile.rotation * (1 - ease((p - 0.25) / 0.08)),
      blue: ease((p - 0.73) / 0.12),
      installed: false,
    };
  }
  const progress = ease((seconds - tile.starts) / tile.duration);
  if (progress === 1) return { ...tile.destination, rotation: 0, blue: 1, installed: true };
  const position = tile.control
    ? mix(
        mix(tile.origin, tile.control, progress),
        mix(tile.control, tile.destination, progress),
        progress,
      )
    : mix(tile.origin, tile.destination, progress);
  position.y -= Math.sin(progress * Math.PI) * 7;
  return {
    ...position,
    rotation: tile.rotation * (1 - progress),
    blue: progress,
    installed: progress === 1,
  };
}

export function storyWorkerFrames(story: MosaicStory, seconds: number, complete = false) {
  return (["codex", "claude"] as const).map((name) => {
    const jobs = story.jobs.filter((job) => job.agent === name);
    const current = jobs.find((job) => seconds < job.starts + job.duration);
    if (current && !complete) return { name, pose: jobPose(current, seconds, story.basis) };
    const last = jobs[jobs.length - 1];
    const home = foot(last.target, story.basis);
    return {
      name,
      pose: {
        ...home,
        floor: 0,
        action: "idle" as const,
        facing: 1 as const,
        phase: seconds * 0.7,
        opacity: 1,
      },
    };
  });
}
