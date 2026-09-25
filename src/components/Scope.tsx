import { FactoryFlow } from "./FactoryFlow";

export function Scope() {
  return (
    <section className="scope section-shell" id="scope" aria-labelledby="scope-title">
      <h2 id="scope-title">The work I take care of</h2>
      <div className="offers-grid">
        <article className="offer">
          <div className="motif motion-scene" aria-hidden="true">
            <svg className="focus-study" viewBox="0 0 300 120">
              <path className="motif-guide" d="M18 60H282M150 12V108" />
              <path className="focus-frame" d="M130 44v-6h12m16 0h12v6m0 32v6h-12m-16 0h-12v-6" />
              <g className="focus-particles">
                <rect x="146" y="56" width="8" height="8" />
                <rect x="146" y="56" width="8" height="8" />
                <rect x="146" y="56" width="8" height="8" />
                <rect x="146" y="56" width="8" height="8" />
                <rect x="146" y="56" width="8" height="8" />
                <rect x="146" y="56" width="8" height="8" />
              </g>
            </svg>
          </div>
          <div className="offer-body">
            <h3>One-off AI consultation</h3>
            <p className="offer-benefit">A clear next step for a specific problem.</p>
            <ul className="offer-details">
              <li>Bring a question, a blocker or a setup you’re unsure about.</li>
              <li>We work through it together and decide what’s worth doing next.</li>
            </ul>
            <a className="offer-action" href="/project">
              Discuss a consultation <span aria-hidden="true">↗</span>
            </a>
          </div>
        </article>
        <article className="offer">
          <div className="motif motion-scene" aria-hidden="true">
            <svg className="review-study" viewBox="0 0 300 120">
              <path className="motif-guide" d="M18 60H282" />
              <g className="review-tiles">
                <path d="M62 30h22v22H62ZM92 30h22v22H92ZM122 30h22v22h-22ZM152 30h22v22h-22ZM182 30h22v22h-22ZM212 30h22v22h-22Z" />
                <path d="M62 68h22v22H62ZM92 68h22v22H92ZM122 68h22v22h-22ZM152 68h22v22h-22ZM182 68h22v22h-22ZM212 68h22v22h-22Z" />
              </g>
              <rect className="review-repair" x="122" y="68" width="22" height="22" />
              <g className="review-scan">
                <path d="M0 18v84" />
                <path d="M-4 18h8M-4 102h8" />
              </g>
            </svg>
          </div>
          <div className="offer-body">
            <h3>Software review &amp; delivery</h3>
            <p className="offer-benefit">Take a working prototype into day-to-day use.</p>
            <ul className="offer-details">
              <li>I review the code, permissions and integrations in what you’ve built.</li>
              <li>Then I fix the agreed issues, test the changes and help get it released.</li>
            </ul>
            <a className="offer-action" href="/project">
              Discuss a review <span aria-hidden="true">↗</span>
            </a>
          </div>
        </article>
      </div>
      <article className="factory-offer" aria-labelledby="factory-title">
        <div className="factory-intro">
          <h3 id="factory-title">AI Agent Factory</h3>
          <div>
            <p className="factory-lead">
              A repeatable way to develop and look after your software.
            </p>
            <p>
              I set up the agents, instructions and checks around your code, so the next change has
              a clear path from a scoped task to a reviewed release.
            </p>
          </div>
        </div>
        <FactoryFlow />
        <dl className="factory-details">
          <div>
            <dt>Agent Software Factory</dt>
            <dd>
              Agents work through scoped tasks, tests and code review in your codebase. I set up the
              instructions and checks before changes move on.
            </dd>
          </div>
          <div>
            <dt>Agent Defense Factory</dt>
            <dd>
              A separately scoped workflow to assess security findings around your software,
              prioritise them and work through agreed fixes.
            </dd>
          </div>
          <div>
            <dt>Local AI, where it fits</dt>
            <dd>
              Use local models where your hardware and the work suit them. We decide what stays
              local and what uses a cloud model.
            </dd>
          </div>
          <div>
            <dt>Data access &amp; retention</dt>
            <dd>
              Decide what agents can access, where data is processed and how long prompts, outputs
              and logs are kept. I configure the available controls and document the limits of the
              tools and providers we choose.
            </dd>
          </div>
        </dl>
        <div className="factory-bottom">
          <p>
            I handle the setup and agreed ongoing work. You keep control of scope, access and
            release approvals.
          </p>
          <a className="offer-action" href="/project">
            Discuss your factory <span aria-hidden="true">↗</span>
          </a>
        </div>
      </article>
    </section>
  );
}
