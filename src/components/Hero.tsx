import { lazy, Suspense } from "react";
import { localReview } from "../family/preview";
import { usesLegacyMosaic } from "../mosaic-story";

const HeroArtwork = lazy(() =>
  import("./HeroArtwork").then(({ HeroArtwork }) => ({ default: HeroArtwork })),
);

export function Hero() {
  const requested = localReview ? new URLSearchParams(window.location.search).get("hero") : null;
  const artworkVariant = requested === "atelier" || requested === "engraved" ? requested : "mosaic";
  const artwork = requested !== "plain";
  return (
    <section
      className={`walkthrough-hero${artwork ? ` has-artwork hero-${artworkVariant === "engraved" ? "mosaic" : artworkVariant}` : ""}`}
      id="top"
      aria-labelledby="hero-title"
      data-mosaic-layout={
        artwork && artworkVariant === "mosaic"
          ? !(localReview && usesLegacyMosaic(window.location.search))
            ? "composition"
            : new URLSearchParams(window.location.search).get("mosaic") === "wings-archive"
              ? "wings"
              : "floor"
          : undefined
      }
    >
      <div className="walkthrough-shell">
        <h1 id="hero-title">
          AI should understand
          <br className="hero-linebreak" /> <span>your business</span>
        </h1>
        <p className="walkthrough-description">
          Your data and business context are the foundation for AI to do useful work. Connect them
          with the right tools and workflows, and agents can help develop software, investigate
          systems and turn information into decisions. Practical data and AI consultancy that brings
          these pieces together around your goals, with clear ways to review the work and build on
          it.
        </p>
      </div>
      {artwork && (
        <Suspense fallback={null}>
          <HeroArtwork variant={artworkVariant} />
        </Suspense>
      )}
    </section>
  );
}
