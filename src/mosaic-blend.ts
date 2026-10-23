import { mosaicRandom } from "./mosaic-motion";
import type { StoryMark } from "./mosaic-story";
import { businessSourceBrands } from "./mosaic-brands";
import { isDataCell } from "./mosaic-data";

export type BrandDefinition = Pick<
  StoryMark,
  "id" | "label" | "file" | "palette" | "color" | "category"
>;
const mono = (color: string) => [
  color,
  `color-mix(in srgb, ${color} 65%, white)`,
  color,
  `color-mix(in srgb, ${color} 65%, white)`,
];
export const extraSourceBrands: BrandDefinition[] = [
  {
    id: "shopify",
    category: "commerce",
    label: "Shopify",
    file: "/assets/hero-sources/shopify.svg",
    color: "#95BF47",
    palette: ["#95BF47", "#5E8E3E", "#95BF47", "#5E8E3E"],
  },
  {
    id: "klaviyo",
    category: "marketing",
    label: "Klaviyo",
    file: "/assets/hero-sources/klaviyo.png",
    color: "#232426",
    palette: ["var(--story-dark-brand)", "#a6a7a8", "var(--story-dark-brand)", "#a6a7a8"],
  },
  {
    id: "google-drive",
    category: "documents",
    label: "Google Drive",
    file: "/assets/hero-sources/google-drive.svg",
    color: "#3186ff",
    palette: ["#0ebc5f", "#3186ff", "#fec700", "#3186ff"],
  },
  {
    id: "airtable",
    category: "data",
    label: "Airtable",
    file: "/assets/hero-sources/airtable.svg",
    color: "#18BFFF",
    palette: mono("#18BFFF"),
  },
  {
    id: "dropbox",
    category: "documents",
    label: "Dropbox",
    file: "/assets/hero-sources/dropbox.svg",
    color: "#0061FF",
    palette: mono("#0061FF"),
  },
  {
    id: "snowflake",
    category: "data",
    label: "Snowflake",
    file: "/assets/hero-sources/snowflake.svg",
    color: "#29B5E8",
    palette: mono("#29B5E8"),
  },
];
export const blendSourceSlots = [
  { zone: "left", column: -16.3, row: 6 },
  { zone: "left", column: -17.68, row: 0.18 },
  { zone: "left", column: -18.56, row: -5.8 },
  { zone: "right", column: 4.34, row: -15.13 },
  { zone: "right", column: 8.01, row: -11.43 },
  { zone: "right", column: 12.05, row: -7.63 },
  { zone: "under", column: 1, row: -3.8 },
  { zone: "under", column: 6.07, row: -3.07 },
  { zone: "front", column: -11, row: 9.4 },
  { zone: "front", column: -6.5, row: 11.4 },
  { zone: "front", column: -1.5, row: 10.2 },
  { zone: "front", column: 3.5, row: 11 },
  { zone: "front", column: 8.5, row: 9 },
] as const;
const shuffled = <T>(items: readonly T[], seed: number, salt: number) =>
  items
    .map((value, index) => ({ value, order: mosaicRandom(seed, salt + index) }))
    .sort((a, b) => a.order - b.order)
    .map(({ value }) => value);
export function blendSources(
  seed: number,
  compact: boolean,
  existing: BrandDefinition[],
): StoryMark[] {
  const count = compact
    ? 6 + Math.floor(mosaicRandom(seed, 10400) * 2)
    : 8 + Math.floor(mosaicRandom(seed, 10400) * 4);
  const required = shuffled(extraSourceBrands.slice(0, 2), seed, 10000);
  const categoryCounts = new Map<string, number>(required.map((brand) => [brand.category!, 1]));
  const brands = [...required];
  for (const brand of shuffled(
    [...existing, ...extraSourceBrands.slice(2), ...businessSourceBrands],
    seed,
    10010,
  )) {
    const category = brand.category!;
    if ((categoryCounts.get(category) ?? 0) >= 2) continue;
    brands.push(brand);
    categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
    if (brands.length === count) break;
  }
  const zone = (name: StoryMark["zone"], count: number, salt: number) =>
    shuffled(
      blendSourceSlots
        .map((slot, index) => ({ ...slot, slot: index }))
        .filter((slot) => slot.zone === name),
      seed,
      salt,
    ).slice(0, count);
  const frontCount = compact
    ? Math.max(count - 2, 4 + Math.floor(mosaicRandom(seed, 10401) * 2))
    : 4;
  const underCount = compact ? count - frontCount : 1 + Math.floor(mosaicRandom(seed, 10402) * 2);
  const remaining = count - frontCount - underCount;
  const leftCount = compact
    ? 0
    : Math.max(
        1,
        remaining - 3,
        Math.min(3, remaining - 1, 1 + Math.floor(mosaicRandom(seed, 10403) * 3)),
      );
  // Keep the first four front pads stable; the workers always collect from these pads.
  const slots = [
    ...zone("front", frontCount, 10100),
    ...zone("under", Math.min(2, underCount), 10110),
    ...zone("left", leftCount, 10140),
    ...zone("right", remaining - leftCount, 10150),
  ];
  return slots.map((slot, index) => {
    const jitterC = slot.zone === "front" ? 0.35 : slot.zone === "under" ? 0.25 : 0.3;
    const jitterR = slot.zone === "under" ? 0 : slot.zone === "front" ? 0.25 : 0.3;
    return {
      ...brands[index],
      ...slot,
      column: slot.column + (mosaicRandom(seed, 10200 + slot.slot) - 0.5) * jitterC * 2,
      row: slot.row + (mosaicRandom(seed, 10300 + slot.slot) - 0.5) * jitterR * 2,
      span: slot.zone === "front" ? 1.8 : 1.6,
      appears: mosaicRandom(seed, 10500 + index) * (slot.zone === "front" ? 8 : 20),
      fragments: 2 + Math.floor(mosaicRandom(seed, 10600 + index) * 2),
    };
  });
}

export const platformColours: Record<string, readonly string[]> = {
  databricks: ["#FF3621", "#ff7e70", "#FF3621"],
  azure: ["#0078D4", "#3CCBF4", "#2892DF"],
  fabric: ["#239C87", "#55DDB9", "#ABE88E"],
  delta: ["#00ADD4", "#279dbc", "#00ADD4"],
  arcitai: ["var(--mosaic-tile-paper)", "var(--mosaic-tile-paper)"],
};
export type PlatformAccent = { column: number; row: number; brand: string; color: string };
export function platformAccentCells(
  marks: StoryMark[],
  seed: number,
): PlatformAccent[] | undefined {
  const cells: { column: number; row: number }[] = [];
  for (let row = 0; row < 7; row++)
    for (let column = 2; column <= 17; column++) {
      if (isDataCell(column, row)) continue;
      if (column <= 5 && row >= 5) continue;
      if (
        marks.some(
          (m) =>
            column >= m.column &&
            column < m.column + m.span &&
            row >= m.row &&
            row < m.row + m.span,
        )
      )
        continue;
      cells.push({ column, row });
    }
  const candidates = marks.map((mark) => ({
    mark,
    cells: cells
      .map((cell) => {
        const distance = Math.max(
          mark.column - cell.column,
          cell.column - (mark.column + mark.span - 1),
          mark.row - cell.row,
          cell.row - (mark.row + mark.span - 1),
          0,
        );
        return {
          ...cell,
          distance,
          order: mosaicRandom(seed, 11000 + cell.row * 32 + cell.column),
        };
      })
      .filter((cell) => cell.distance <= 2)
      .sort(
        (a, b) =>
          a.distance - b.distance || b.column + b.row - (a.column + a.row) || a.order - b.order,
      ),
  }));
  candidates.sort((a, b) => a.cells.length - b.cells.length);
  const used = new Set<string>();
  const result: PlatformAccent[] = [];
  for (const { mark, cells: options } of candidates) {
    const count = mark.id === "arcitai" ? 2 : 3;
    const selected = options
      .filter((cell) => !used.has(`${cell.column}:${cell.row}`))
      .slice(0, count);
    if (selected.length < count) return undefined;
    selected.forEach((cell, index) => {
      used.add(`${cell.column}:${cell.row}`);
      result.push({
        column: cell.column,
        row: cell.row,
        brand: mark.id,
        color: platformColours[mark.id][index],
      });
    });
  }
  return result;
}
