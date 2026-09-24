import type { Scene } from "../scene";
import { SceneMedia } from "./SceneMedia";

export function Hero({ scene, epoch }: { scene: Scene; epoch: number }) {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <SceneMedia scene={scene} epoch={epoch} className="hero-landscape" />
      <div className="hero-content">
        <svg
          className="brand-mark hero-mark motion-scene"
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
        <h1 id="hero-title">
          From prototype to
          <br className="desktop-break" /> production-ready software.
        </h1>
        <p className="hero-description">
          You’ve built something that works. I help get it ready for real use — and set up AI agents
          to keep development and security work moving, with the right checks in place.
        </p>
        <div className="hero-actions">
          <a className="button" href="#project">
            Discuss a project <span aria-hidden="true">↗</span>
          </a>
          <a className="text-link" href="#process">
            Meet Gustav <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
