import { describe, expect, it } from "vitest";
import { roundedPrism } from "./rounded-prism";

describe("shared tile and Factory geometry", () => {
  it("scales every face and seam with the same proportions", () => {
    const tile = roundedPrism([0, 0], [28, -4.48], [15.68, 8.96], [-12.32, 13.44], 3);
    const large = roundedPrism([0, 0], [280, -44.8], [156.8, 89.6], [-123.2, 134.4], 30);
    const numbers = (path: string) => (path.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
    for (const key of Object.keys(tile) as (keyof typeof tile)[]) {
      const a = numbers(tile[key]),
        b = numbers(large[key]);
      expect(a.length).toBe(b.length);
      a.forEach((n, i) => expect(Math.abs(n * 10 - b[i])).toBeLessThan(0.006));
    }
  });
  it("keeps the enlarged slabs inside the existing stage and doorway footprint", () => {
    const slab = roundedPrism([200, 10], [360, 90], [200, 170], [40, 90], 28);
    for (const path of Object.values(slab)) {
      const coords = (path.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
      coords.forEach((n, i) => expect(n).toBeGreaterThanOrEqual(i % 2 ? 10 : 40));
      coords.forEach((n, i) => expect(n).toBeLessThanOrEqual(i % 2 ? 198 : 360));
    }
    expect((slab.top.match(/Q/g) ?? []).length).toBe(4);
  });
});
