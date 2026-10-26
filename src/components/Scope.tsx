import { FactoryVisual } from "./FactoryVisual";
import { siteData } from "../site-data";

export function Scope() {
  return (
    <>
      <section className="scope" id="scope" aria-labelledby="scope-title">
        <div className="scope-inner section-shell">
          <h2 id="scope-title" className="sr-only">
            Offers
          </h2>
          <div className="offers-grid">
            <article className="offer">
              <div className="offer-body">
                <span className="offer-number" aria-hidden="true">
                  01
                </span>
                <h3>One-off consultation</h3>
                <p className="offer-benefit">
                  A free 20-minute conversation to explore your next step.
                </p>
                <p className="offer-summary">
                  Talk through an idea, an existing setup or where data and AI could help your
                  business. Leave with a clearer direction and a practical next step.
                </p>
                <a className="offer-button" href={siteData.links.consultation}>
                  Book a free consultation <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
            <article className="offer">
              <div className="offer-body">
                <span className="offer-number" aria-hidden="true">
                  02
                </span>
                <h3>Custom projects</h3>
                <p className="offer-benefit">Data and AI shaped around your business.</p>
                <p className="offer-summary">
                  From data foundations to agentic engineering. Practical solutions built around
                  your existing systems, designed for your team to use, adapt and build on.
                </p>
                <a className="offer-button" href="/project/">
                  Discuss your project <span aria-hidden="true">→</span>
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>
      <section className="factory-method" id="factory" aria-labelledby="factory-title">
        <div className="factory-shell section-shell">
          <div className="factory-intro">
            <div>
              <h2 id="factory-title">Factory</h2>
              <p>
                An open-source framework for agentic engineering. Factory brings established methods
                and open standards together in an approach you can adapt across projects, from
                software and business intelligence to security and research.
              </p>
              <p>
                Run it on your own machine, a VPS or in the cloud. Choose AI models and ways of
                working to suit each project, grounded in your data, business context and existing
                systems.
              </p>
              <a
                className="factory-source-link"
                href="https://github.com/arcitai/factory#start"
                target="_blank"
                rel="noopener noreferrer"
              >
                Start with Factory <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
          <FactoryVisual />
        </div>
      </section>
    </>
  );
}
