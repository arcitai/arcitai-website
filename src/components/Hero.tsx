import type { Scene } from "../scene";
import { ScenePlayer } from "./Process";
export function Hero({ scene, epoch }: { scene: Scene; epoch: number }) {
  return (
    <section className="walkthrough-hero" id="top" aria-labelledby="hero-title">
      <div className="walkthrough-shell">
        <h1 id="hero-title">
          AI and software,
          <br />
          done for you
        </h1>
        <p className="walkthrough-description">
          From a promising demo to software your team can use. I review what you have, handle the
          agreed work, and set up the agents and checks around it.
        </p>
        <div className="walkthrough-media">
          <ScenePlayer key={scene} scene={scene} epoch={epoch} />
          <svg
            className="brand-mark walkthrough-mark motion-scene hero-mark"
            viewBox="4 -4 60 60"
            width="88"
            height="88"
            aria-hidden="true"
          >
            <path d="M26 2h14l-6 14H20Z" />
            <path d="M19 18h14l-6 14H13Z" />
            <path d="M12 34h14l-6 14H6Z" />
            <rect x="42" y="2" width="14" height="14" />
            <rect x="36" y="18" width="14" height="14" />
            <rect x="48" y="34" width="14" height="14" />
          </svg>
        </div>
        <div className="walkthrough-action">
          <a className="family-button" href="/project">
            Discuss your project <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
