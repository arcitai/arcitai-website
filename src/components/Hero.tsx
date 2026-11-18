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
          Put AI to work
          <br className="hero-linebreak" /> <span>across your teams</span>
        </h1>
        <p className="walkthrough-description">
          Use AI agents to investigate issues, analyse information and develop software with the
          business data and context your teams share. Arc’IT AI builds around your systems, with
          agreed access and human review.
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
