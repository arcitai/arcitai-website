import { lazy, Suspense } from "react";
import { FactoryPresentation } from "./FactoryPresentation";
import { localReview } from "../family/preview";

const FactoryVariants =
  import.meta.env.VITE_REVIEW_PREVIEW === "true" ? lazy(() => import("./FactoryVariants")) : null;

export function FactoryVisual() {
  return (
    <section className="factory-visual" id="factory-visual" aria-label="Explore the Factory stack">
      {localReview &&
      FactoryVariants &&
      new URLSearchParams(window.location.search).has("factoryCompare") ? (
        <Suspense fallback={<FactoryPresentation />}>
          <FactoryVariants />
        </Suspense>
      ) : (
        <FactoryPresentation />
      )}
    </section>
  );
}
