import { lazy, Suspense } from "react";
import { localReview } from "../family/preview";

const HeroArtwork =
  import.meta.env.VITE_REVIEW_PREVIEW === "true"
    ? lazy(() => import("./HeroArtwork").then(({ HeroArtwork }) => ({ default: HeroArtwork })))
    : null;

export function Hero() {
  const artwork =
    localReview &&
    HeroArtwork &&
    new URLSearchParams(window.location.search).get("hero") !== "plain";
  return (
    <section
      className={`walkthrough-hero${artwork ? " has-artwork" : ""}`}
      id="top"
      aria-labelledby="hero-title"
    >
      {artwork && (
        <Suspense fallback={null}>
          <HeroArtwork />
        </Suspense>
      )}
      <div className="walkthrough-shell">
        <h1 id="hero-title">
          Does AI understand
          <br className="hero-linebreak" /> <span>your business?</span>
        </h1>
        <p className="walkthrough-description">
          Your data and business context are the foundation for AI to do useful work. Connect them
          with the right tools and workflows, and agents can help develop software, investigate
          systems and turn information into decisions. Practical data and AI consultancy that brings
          these pieces together around your goals, with clear ways to review the work and build on
          it.
        </p>
      </div>
    </section>
  );
}
