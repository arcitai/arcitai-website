import { lazy, Suspense } from "react";
import { AgenticSystemPresentation } from "./AgenticSystemPresentation";
import { localReview } from "../family/preview";

const AgenticSystemVariants =
  import.meta.env.VITE_REVIEW_PREVIEW === "true"
    ? lazy(() => import("./AgenticSystemVariants"))
    : null;

export function AgenticSystemVisual() {
  return (
    <section
      className="agentic-system-visual"
      id="agentic-system-visual"
      aria-label="Explore the Agentic Systems stack"
    >
      {localReview &&
      AgenticSystemVariants &&
      new URLSearchParams(window.location.search).has("agenticSystemCompare") ? (
        <Suspense fallback={<AgenticSystemPresentation />}>
          <AgenticSystemVariants />
        </Suspense>
      ) : (
        <AgenticSystemPresentation />
      )}
    </section>
  );
}
