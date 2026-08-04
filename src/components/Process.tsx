import { useRef, useState } from "react";

import type { Scene } from "../scene";
import { siteData } from "../site-data";

export function Process({ scene }: { scene: Scene }) {
  const [storyboardOpen, setStoryboardOpen] = useState(false);
  const playRef = useRef<HTMLButtonElement>(null);

  const closeStoryboard = () => {
    setStoryboardOpen(false);
    window.requestAnimationFrame(() => playRef.current?.focus());
  };

  return (
    <section className="vsl-section paper-section" id="process">
      <header className="section-heading">
        <p>PROCESS</p>
        <h2>AI-first companies are built by people, not tool stacks</h2>
        <span>
          Tools raise the ceiling. Business context, capable people, and a clear outcome decide
          whether AI improves the work or becomes another tool nobody uses.
        </span>
      </header>

      <div className={`vsl-window${storyboardOpen ? " is-storyboard" : ""}`}>
        <div className="window-bar" aria-hidden="true">
          <span className="window-dots">
            <i />
            <i />
            <i />
          </span>
          <span>ARCIT / FOUNDER WALKTHROUGH</span>
          <span>02:15</span>
        </div>

        <div className="vsl-screen" data-scene={scene}>
          <div className="vsl-message">
            <p>FROM BUSINESS PROBLEM TO USEFUL SOFTWARE</p>
            <h3>What happens before, during, and after the build</h3>
            <span>
              Two minutes on context, scope, production, and making the result useful in everyday
              work.
            </span>
            <button
              className="vsl-play"
              type="button"
              aria-expanded={storyboardOpen}
              aria-controls="vsl-storyboard"
              onClick={() => setStoryboardOpen(true)}
              ref={playRef}
            >
              <i aria-hidden="true">▶</i>
              <span>
                {storyboardOpen ? "Founder walkthrough is open" : "Play the founder walkthrough"}
              </span>
            </button>
          </div>

          <ol id="vsl-storyboard" className="vsl-storyboard" aria-hidden={!storyboardOpen}>
            {siteData.process.chapters.map((chapter) => (
              <li key={chapter.time}>
                <span>{chapter.time}</span>
                <strong>{chapter.title}</strong>
                <small>{chapter.description}</small>
              </li>
            ))}
          </ol>
          <button
            className="vsl-return"
            type="button"
            onClick={closeStoryboard}
            hidden={!storyboardOpen}
          >
            ← Return to film
          </button>
        </div>

        <div className="window-timeline" aria-hidden="true">
          <span>00:00</span>
          <i />
          <span>02:15</span>
        </div>
      </div>
    </section>
  );
}
