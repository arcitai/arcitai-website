import {
  mosaicPitch,
  mosaicPoint,
  mosaicRandom,
  mosaicSize,
  mosaicWorkLayout,
} from "./mosaic-motion";

type Palette = readonly [string, string, string, string];
export type MosaicVariant = {
  id: string;
  label: string;
  description: string;
  light: Palette;
  dark: Palette;
  keep: number;
  jitter: number;
  rotate: number;
  scaleMin: number;
  stacks?: boolean;
  accent?: boolean;
};

/** Local comparison directions. A palette is chosen explicitly; reload varies the work. */
export const mosaicVariants = [
  {
    id: "chalk",
    label: "Chalk",
    description: "White fragments, a few dark greys, blue order.",
    light: ["#fbfaf7", "#f1efea", "#e2ded6", "#8d9097"],
    dark: ["#3d3c39", "#484643", "#55534f", "#8d9097"],
    keep: 0.5,
    jitter: 16,
    rotate: 14,
    scaleMin: 0.7,
    stacks: true,
  },
  {
    id: "ash",
    label: "Ash",
    description: "Soft, warm greys gathered into blue.",
    light: ["#f3f1ed", "#e3dfd8", "#cbc6bd", "#a9a399"],
    dark: ["#2f2e2b", "#3b3936", "#4b4844", "#625e58"],
    keep: 0.5,
    jitter: 12,
    rotate: 10,
    scaleMin: 0.78,
  },
  {
    id: "slate",
    label: "Slate",
    description: "Cool greys and a quieter, more regular field.",
    light: ["#eef0f3", "#dce0e6", "#c1c7d0", "#9aa2ae"],
    dark: ["#25282d", "#30343a", "#3f444c", "#575e68"],
    keep: 0.55,
    jitter: 6,
    rotate: 5,
    scaleMin: 0.9,
  },
  {
    id: "graphite",
    label: "Graphite",
    description: "Darker fragments, stronger contrast with blue.",
    light: ["#c9ccd1", "#a4a8b0", "#7d828b", "#565b64"],
    dark: ["#1d1f23", "#26292e", "#30343a", "#3c4148"],
    keep: 0.45,
    jitter: 14,
    rotate: 12,
    scaleMin: 0.72,
  },
  {
    id: "ember",
    label: "Ember",
    description: "The family orange, collected into Arc’IT blue.",
    light: ["#f8d3b2", "#f5aa70", "#ee7f3c", "#d4621f"],
    dark: ["#4a3326", "#7a4524", "#b85c26", "#ee7f3c"],
    keep: 0.45,
    jitter: 14,
    rotate: 12,
    scaleMin: 0.72,
  },
  {
    id: "signal",
    label: "Signal",
    description: "Mostly grey, with a few orange details.",
    light: ["#f4f1ea", "#e4ded3", "#cfc7b9", "#b3a999"],
    dark: ["#2d2b27", "#3a3732", "#4d4943", "#6b665d"],
    keep: 0.5,
    jitter: 12,
    rotate: 10,
    scaleMin: 0.78,
    accent: true,
  },
] as const satisfies readonly MosaicVariant[];

export type MosaicVariantId = (typeof mosaicVariants)[number]["id"] | "wings";
export function mosaicVariantId(search: string): MosaicVariantId {
  const id = new URLSearchParams(search).get("mosaic");
  if (id === "wings-archive") return "wings";
  return id === "wings" || mosaicVariants.some((variant) => variant.id === id)
    ? (id as MosaicVariantId)
    : "chalk";
}
export function mosaicVariantHref(id: MosaicVariantId, search: string) {
  const query = new URLSearchParams(search);
  query.set("hero", "mosaic");
  query.set("mosaic", id);
  return `?${query.toString()}#top`;
}
// Shared with MosaicHero's viewport query and the CSS compact breakpoint.
export const mosaicCompactWidth = 1100;

export const mosaicFloorMarks = [
  { column: -11, row: 4, span: 2, name: "Slack", asset: "/assets/factory-tools/slack.png" },
  { column: -6, row: 6, span: 2, name: "Teams", asset: "/assets/factory-tools/teams.svg" },
  {
    column: 0,
    row: -2,
    span: 2,
    name: "Databricks",
    asset: "/assets/factory-tools/databricks.svg",
  },
  { column: 5, row: 7, span: 2, name: "Power BI", asset: "/assets/factory-tools/powerbi.svg" },
  { column: 7, row: 1, span: 2, name: "Azure", asset: "/assets/factory-tools/azure.svg" },
  { column: 9, row: 1, span: 3, name: "Arc’IT", asset: "/assets/arcitai-mark-final.svg" },
] as const;

export function mosaicMarkContains(column: number, row: number) {
  return mosaicFloorMarks.some(
    (mark) =>
      column >= mark.column &&
      column < mark.column + mark.span &&
      row >= mark.row &&
      row < mark.row + mark.span,
  );
}

/** A low, continuous field. Only the fragment end is displaced; the brand end is a grid. */
export function mosaicFloorCells(seed: number, variant: MosaicVariant) {
  const work = mosaicWorkLayout("floor");
  const cells = [];
  for (let row = -6; row <= 10; row++) {
    for (let column = -24; column <= 24; column++) {
      const point = mosaicPoint(column, row, "floor");
      const random = mosaicRandom(seed, (row + 6) * 52 + column + 24);
      const detail = mosaicRandom(seed, (row + 6) * 52 + column + 24 + 2000);
      const progress = Math.max(0, Math.min(1, (point.x - 220) / 980));
      const nearBrand = Math.hypot(column - 10, row - 2) < 4;
      const inspection = row === work.inspectionRow && work.inspectionColumns.includes(column);
      const helperWork = (column === -15 && row === 5) || (column === 16 && row === 1);
      if (
        mosaicMarkContains(column, row) ||
        [...work.build, ...work.source].some(([c, r]) => c === column && r === row)
      )
        continue;
      if (
        !inspection &&
        !helperWork &&
        (point.y < 64 + 22 * Math.sin(point.x / 260 + (seed % 16)) || point.y > 372)
      )
        continue;
      const keep =
        nearBrand || inspection || helperWork
          ? 1
          : progress < 0.35
            ? variant.keep * (progress < 0.15 ? 0.6 : 1)
            : progress < 0.7
              ? 0.75
              : 0.95;
      if (random > keep) continue;
      const disorder =
        inspection || helperWork ? 0 : Math.max(0, Math.min(1, (0.7 - progress) / 0.35));
      const dx = (detail * 2 - 1) * variant.jitter * disorder;
      const dy = (random * 2 - 1) * variant.jitter * 0.7 * disorder;
      const rotation = (detail * 2 - 1) * variant.rotate * disorder;
      const scale = 1 - disorder * (1 - variant.scaleMin) * random;
      const blue =
        nearBrand ||
        inspection ||
        progress > 0.7 ||
        (progress >= 0.35 && detail < (progress - 0.35) / 0.35);
      const tone = blue ? "blue" : variant.accent && detail < 0.12 ? "accent" : "fragment";
      const level = nearBrand
        ? Math.max(1, 4 - Math.floor(Math.hypot(column - 10, row - 2) / 1.5))
        : variant.id === "chalk" && !blue
          ? detail > 0.9
            ? 4
            : 1 + Math.floor(random * 3)
          : 1 + Math.floor(detail * 4);
      cells.push({
        column,
        row,
        x: point.x + dx,
        y: point.y + dy,
        rotation,
        scale,
        tone,
        level,
        stack: Boolean(variant.stacks && !blue && detail < 0.15),
      });
    }
  }
  return cells.sort((a, b) => a.y - b.y);
}
export function mosaicMarkSize(span: number) {
  return span * mosaicPitch - (mosaicPitch - mosaicSize);
}
