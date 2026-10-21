import { ArcitBadge } from "./ArcitMark";
import { currentArcitVariant, type ArcitVariant } from "../arcit-brand";
const variants: { id: ArcitVariant; label: string; note: string }[] = [
  { id: "outline", label: "01 · Outline", note: "Open rails, three filled terminals." },
  { id: "tonal", label: "02 · Tonal", note: "Six pieces in different blue tones." },
  { id: "github", label: "03 · Solid", note: "The current mark on a blue ground." },
];
export default function BrandReview() {
  const selected = currentArcitVariant();
  return (
    <section
      id="brand-variations"
      className="brand-review section-shell"
      aria-labelledby="brand-review-title"
    >
      <h2 id="brand-review-title">Arc’IT mark variations</h2>
      <p>Local review · the selected mark also appears in the navigation.</p>
      <div>
        {variants.map((variant) => (
          <a
            key={variant.id}
            href={`?brand=${variant.id}#brand-variations`}
            aria-current={selected === variant.id ? "page" : undefined}
          >
            <ArcitBadge variant={variant.id} />
            <strong>{variant.label}</strong>
            <span>{variant.note}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
