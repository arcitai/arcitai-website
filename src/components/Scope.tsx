import { ArrowIcon } from "../family/ArrowIcon";
import { AgenticSystemVisual } from "./AgenticSystemVisual";
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
                  Book a free consultation{" "}
                  <span aria-hidden="true">
                    <ArrowIcon />
                  </span>
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
                  your existing systems, with guidance and documentation to help your team use,
                  adapt and build on them.
                </p>
                <a className="offer-button" href="/project/">
                  Discuss your project{" "}
                  <span aria-hidden="true">
                    <ArrowIcon direction="right" />
                  </span>
                </a>
              </div>
            </article>
          </div>
          <section className="business-context" aria-labelledby="business-context-title">
            <div>
              <h3 id="business-context-title">Data and context</h3>
              <p>
                Data is the information in your documents and systems. Context explains what it
                means in your organisation: how the business runs, the rules you follow and why
                decisions are made.
              </p>
            </div>
            <div>
              <p>
                Making that data and context clear and available to AI gives your team a foundation
                to build on across the organisation. The same foundation can support your own
                software, analysis and automation.
              </p>
              <p>
                Clear data and context, with documentation of the agreed work, support a handover
                your team can use. Replacing a system still needs adaptation and testing; the data
                and context can be reused where they still apply. Further support is optional.
              </p>
            </div>
          </section>
        </div>
      </section>
      <section
        className="agentic-system-method"
        id="agentic-system"
        aria-labelledby="agentic-system-title"
      >
        <div className="agentic-system-shell section-shell">
          <div className="agentic-system-intro">
            <div>
              <h2 id="agentic-system-title">Agentic Systems</h2>
              <p>
                An open-source framework for building and operating agentic systems. Bring agents,
                data, context, tools and review together in a setup you can adapt to software
                development, business intelligence, security and research.
              </p>
              <p>
                Run it on your own machine, a VPS or in the cloud. Choose AI models and ways of
                working to suit each project, grounded in your data, business context and existing
                systems.
              </p>
              <a
                className="agentic-system-source-link"
                href="https://github.com/arcitai/agentic-systems#start"
                target="_blank"
                rel="noopener noreferrer"
              >
                Start with Agentic Systems{" "}
                <span aria-hidden="true">
                  <ArrowIcon />
                </span>
              </a>
            </div>
          </div>
          <AgenticSystemVisual />
        </div>
      </section>
    </>
  );
}
