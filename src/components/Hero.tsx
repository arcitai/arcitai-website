import type { Scene } from "../scene";

type HeroProps = {
  clock: string;
  scene: Scene;
};

export function Hero({ clock, scene }: HeroProps) {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title" data-scene={scene}>
      <div className="hero-content">
        <p className="hero-status">
          <span aria-hidden="true" />
          Q3 2026 / LIMITED BUILD CAPACITY
        </p>
        <h1 id="hero-title">Better software begins with better business questions</h1>
        <p className="hero-lead">
          AI lets smaller teams build what once required far more time, money, and people. The
          opportunity is real. So is the noise. Start with the business, cut through what does not
          matter, and turn the useful part into software that holds up in real work.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="#project-form">
            <span>Start a project</span>
            <i aria-hidden="true">↘</i>
          </a>
          <a className="button button-secondary" href="#process">
            <span>See how it works</span>
            <i aria-hidden="true">↓</i>
          </a>
        </div>
      </div>
      <div className="hero-rail" aria-hidden="true">
        <span>BUSINESS &gt; SOFTWARE</span>
        <span>{clock}</span>
      </div>
    </section>
  );
}
