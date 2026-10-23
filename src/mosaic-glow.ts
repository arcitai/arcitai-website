import { storyPoint, type MosaicStory } from "./mosaic-story";
import { storyAppearance } from "./mosaic-ending";

/** Light follows the displayed data and brand frames, including ending crossfades. */
export function storyGlow(
  story: MosaicStory,
  tiles: Record<string, { blue: number }>,
  marks: Record<string, { opacity: number }>,
  seconds: number,
  complete = false,
) {
  const mean = (values: number[]) => values.reduce((sum, n) => sum + n, 0) / values.length;
  const assembly = mean(story.tiles.map((tile) => tiles[tile.id].blue));
  const gathered = mean(
    [...story.sources, ...story.platforms].map((mark) => {
      const arrival = storyAppearance(mark.appears, seconds, complete).opacity;
      // A brand that has not arrived is not a gathered brand. Ending crossfades
      // use the displayed opacity, so returning islands smoothly soften the light.
      return arrival > 0 ? 1 - Math.min(1, marks[mark.id].opacity / arrival) : 0;
    }),
  );
  return {
    assembly,
    gathered,
    blue: 0.2 + assembly * 0.65 + gathered * 0.15,
    regions: [-10, -2.7, 4.7, 12].map((column) => ({
      ...storyPoint(column, 4.5, story.basis),
      rx: 300,
      ry: 120,
      angle: story.basis.axisDeg,
      opacity:
        (0.2 +
          0.8 *
            mean(
              story.tiles
                .filter((tile) => Math.abs(tile.column - column) <= 5)
                .map((tile) => tiles[tile.id].blue),
            )) *
        (0.6 + 0.4 * gathered),
    })),
  };
}
export type StoryGlow = ReturnType<typeof storyGlow>;
