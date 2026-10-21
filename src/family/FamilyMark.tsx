import type { FamilyBrand } from "./preview";
import { ArcitBadge } from "../components/ArcitMark";

// Matches the canonical onlinesourdough large-pixel-v3 mark, using currentColor for each site.
const boule = [
  "0001111000",
  "0111111110",
  "1110110110",
  "1101101101",
  "1111111111",
  "1111111111",
  "0111111110",
];

export function FamilyMark({ brand }: { brand: FamilyBrand }) {
  if (brand === "gustavonline")
    return (
      <img
        className="family-portrait"
        src="/assets/gustav-linkedin-portrait.jpg"
        width="28"
        height="28"
        alt=""
      />
    );
  if (brand === "onlinesourdough")
    return (
      <svg className="family-mark family-mark-bread" viewBox="0 0 10 7" aria-hidden="true">
        {boule.flatMap((row, y) =>
          [...row].map((cell, x) =>
            cell === "1" ? (
              <rect key={y * 10 + x} x={x + 0.09} y={y + 0.09} width=".82" height=".82" />
            ) : null,
          ),
        )}
      </svg>
    );
  return <ArcitBadge className="family-mark family-mark-arcit" />;
}
