import { FactoryFlow } from "./FactoryFlow";

export function Scope() {
  return (
    <section className="scope section-shell" id="scope" aria-labelledby="scope-title">
      <h2 id="scope-title">I take care of your project</h2>
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
            <h3>One-off consultation</h3>
            <p className="offer-benefit">
              Work through a business, software, or architecture decision with me.
            </p>
            <ul className="offer-details">
              <li>Bring a business need, technical blocker, or decision about your software.</li>
              <li>I help you decide what to improve and where software is worth building.</li>
            </ul>
            <a className="offer-action" href="/project">
              Plan a consultation with me <span aria-hidden="true">↗</span>
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
            <h3>Software delivery &amp; ongoing care</h3>
            <p className="offer-benefit">
              I design, build, and maintain software around your business.
            </p>
            <ul className="offer-details">
              <li>
                I work through the business need, architecture, and integrations with you, then
                handle the agreed development and delivery.
              </li>
              <li>
                I build in security checks, testing, and review. I agree handover and ongoing
                maintenance with you.
              </li>
            </ul>
            <a className="offer-action" href="/project">
              Discuss your project <span aria-hidden="true">↗</span>
            </a>
          </div>
        </article>
      </div>
      <article className="factory-offer" aria-labelledby="factory-title">
        <div className="factory-intro">
          <h3 id="factory-title">AI Agent Factory</h3>
          <div>
            <p className="factory-lead">
              I set up a repeatable way to develop and maintain your software.
            </p>
            <p>
              I use agentic engineering practices to turn scoped work into tested, reviewed changes.
              I configure the agents, context, tools, and checks around your codebase.
            </p>
          </div>
        </div>
        <FactoryFlow />
        <dl className="factory-details">
          <div>
            <dt>Agent Software Factory</dt>
            <dd>
              I set up the development workflow around your codebase: scoped tasks, implementation,
              tests, and independent review before release approval.
            </dd>
          </div>
          <div>
            <dt>Agent Defense Factory</dt>
            <dd>
              I assess security findings, agree priorities with you, and work through scoped fixes.
              Ongoing defence work has its own agreed responsibilities.
            </dd>
          </div>
          <div>
            <dt>Local AI, where it fits</dt>
            <dd>
              I help you decide where local models suit your hardware and work, and where a cloud
              model is more useful.
            </dd>
          </div>
          <div>
            <dt>Data access &amp; retention</dt>
            <dd>
              I agree data access and retention needs with you, configure the available controls,
              and document provider limits. That includes where prompts, outputs, and logs are
              processed and kept.
            </dd>
          </div>
        </dl>
        <div className="factory-bottom">
          <p>
            I handle the agreed setup and ongoing work. You keep control of scope, access, and
            release approvals.
          </p>
          <a className="offer-action" href="/project">
            Discuss your factory with me <span aria-hidden="true">↗</span>
          </a>
        </div>
      </article>
    </section>
  );
}
