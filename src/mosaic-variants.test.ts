import { describe, expect, it } from "vitest";
import { mosaicPoint, mosaicWorkLayout } from "./mosaic-motion";
import {
  mosaicFloorCells,
  mosaicFloorMarks,
  mosaicMarkContains,
  mosaicVariantHref,
  mosaicVariantId,
  mosaicVariants,
} from "./mosaic-variants";

describe("mosaic comparisons", () => {
  it("defaults to the neutral direction and preserves other review choices in links", () => {
    expect(mosaicVariantId("")).toBe("chalk");
    expect(mosaicVariantId("?mosaic=unknown")).toBe("chalk");
    for (const id of [...mosaicVariants.map((variant) => variant.id), "wings"] as const) {
      const href = mosaicVariantHref(id, "?factoryView=2&hero=plain&copy=2");
      expect(mosaicVariantId(href.split("#")[0])).toBe(id);
      expect(href).toContain("factoryView=2");
      expect(href).toContain("hero=mosaic");
    }
  });

  it("keeps work targets and multi-cell brand tiles separate", () => {
    const work = mosaicWorkLayout("floor");
    for (const [column, row] of [...work.build, ...work.source]) {
      expect(mosaicMarkContains(column, row)).toBe(false);
    }
    const occupied = new Set<string>();
    for (const mark of mosaicFloorMarks) {
      for (let row = mark.row; row < mark.row + mark.span; row++) {
        for (let column = mark.column; column < mark.column + mark.span; column++) {
          const key = `${column}:${row}`;
          expect(occupied.has(key)).toBe(false);
          occupied.add(key);
        }
      }
    }
  });

  it("always provides inspection tiles, keeps the ordered end aligned and never adds orange to neutral variants", () => {
    const work = mosaicWorkLayout("floor");
    for (const variant of mosaicVariants) {
      for (const seed of [0, 17, 4294967295]) {
        const cells = mosaicFloorCells(seed, variant);
        expect(cells.length).toBeLessThan(650);
        for (const column of work.inspectionColumns) {
          expect(
            cells.some((cell) => cell.column === column && cell.row === work.inspectionRow),
          ).toBe(true);
        }
        for (const cell of cells) {
          expect(mosaicMarkContains(cell.column, cell.row)).toBe(false);
          const point = mosaicPoint(cell.column, cell.row, "floor");
          if (point.x > 1200) {
            expect(cell.rotation).toBeCloseTo(0);
            expect(cell.scale).toBe(1);
            expect(cell.tone).toBe("blue");
          }
          if (variant.id !== "signal" && variant.id !== "ember") {
            expect(cell.tone).not.toBe("accent");
            expect(cell.tone).not.toBe("orange");
          }
        }
      }
    }
  });
});
