import { siteData } from "../site-data";

export function Scope() {
  return (
    <section className="scope-section paper-section" id="scope">
      <header className="section-heading scope-heading">
        <p>SCOPE</p>
        <h2>From first conversation to software that earns its place in the work</h2>
        <span>
          No fixed stack. No prompt package. The scope follows the business problem, the people
          involved, and the smallest result worth shipping.
        </span>
      </header>

      <div className="scope-rows">
        {siteData.scope.map((item) => (
          <article className="scope-row" key={item.step}>
            <p>{item.step}</p>
            <div>
              <h3>{item.title}</h3>
              <span>{item.description}</span>
              <span className="scope-proof">{item.proof}</span>
            </div>
            <i aria-hidden="true">{item.symbol}</i>
          </article>
        ))}
      </div>
    </section>
  );
}
