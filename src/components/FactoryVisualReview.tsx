import { useEffect, useRef, useState } from "react";
import { ArcitMark } from "./ArcitMark";
import { FactoryFlow } from "./FactoryFlow";
import "./factory-visual-review.css";

const variations = [
  { id: "stack", name: "01 · Cut stack", note: "The method, with room for your domain." },
  { id: "handover", name: "02 · Handover", note: "A setup your team can take forward." },
  { id: "flow", name: "03 · Flow", note: "The delivery workflow, in Arc’IT blue." },
] as const;

const layers = [
  {
    id: "direction",
    title: "Direct the work",
    method: "AgentOps",
    detail:
      "Direct agents, agree priorities and coordinate work within your mandate. AgentOps brings decisions back to you and guides the development lifecycle.",
    tags: "Priorities · Coordination · Decisions",
  },
  {
    id: "delivery",
    title: "Build and deliver",
    method: "ADLC",
    detail:
      "Turn an agreed task into a tested, independently reviewed change. The Agentic Development Lifecycle covers specification, implementation, review and authorised delivery.",
    tags: "Specify · Build · Review · Deliver",
  },
  {
    id: "foundation",
    title: "Prepare the ground",
    method: "Foundation",
    detail:
      "Prepare the project and its environment: useful business context, scoped access, established tools and checks that reflect the work your team needs to do.",
    tags: "Context · Access · Checks",
  },
  {
    id: "tools",
    title: "Your tools & infrastructure",
    method: "Existing systems",
    detail:
      "Build on the tools you choose, such as Codex, Claude Code, T3 Code and GitHub, with hosting and model choices that fit your infrastructure. Factory adds a method around them.",
    tags: "Codex · Claude Code · GitHub",
  },
] as const;

const powerBI = {
  id: "powerbi",
  title: "Power BI",
  method: "Example domain module",
  detail:
    "Add Power BI preparation, specialist skills and validation for data models and reports. The module extends the shared method and is configured for the project’s tools and environment.",
  tags: "Data models · Reports · Validation",
};

function CutStack() {
  const [selectedId, setSelectedId] = useState<string>("foundation");
  const selected = [...layers, powerBI].find((layer) => layer.id === selectedId)!;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("has-entered");
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="factory-stack-scene">
      <div className="factory-ownership-frame">
        <p className="factory-ownership-label">Your approvals &amp; ownership</p>
        <div className="factory-cut-stack">
          <div className="factory-layers" role="group" aria-label="Explore the Factory method">
            {layers.map((layer, index) => (
              <button
                key={layer.id}
                className={`factory-layer factory-layer-${index}`}
                type="button"
                aria-pressed={selectedId === layer.id}
                aria-controls="factory-layer-detail"
                onClick={() => setSelectedId(layer.id)}
              >
                <span className="factory-layer-number" aria-hidden="true">
                  0{layers.length - index}
                </span>
                <span className="factory-layer-copy">
                  <strong>{layer.title}</strong>
                  <span>{layer.method}</span>
                </span>
                <span className="factory-layer-square" aria-hidden="true" />
              </button>
            ))}
          </div>
          <div className="factory-domain-slots">
            <button
              className="factory-domain-module"
              type="button"
              aria-pressed={selectedId === powerBI.id}
              aria-controls="factory-layer-detail"
              onClick={() => setSelectedId(powerBI.id)}
            >
              <span className="factory-module-glyph" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <strong>Power BI</strong>
              <span>Example module</span>
            </button>
            <div className="factory-domain-slot">
              <span aria-hidden="true">+</span>
              <span>Your domain</span>
            </div>
          </div>
        </div>
      </div>
      <div
        className="factory-layer-detail"
        id="factory-layer-detail"
        aria-live="polite"
        aria-atomic="true"
      >
        <div>
          <h4>{selected.title}</h4>
          <p className="factory-detail-tags">{selected.tags}</p>
        </div>
        <p>{selected.detail}</p>
      </div>
      <p className="factory-interaction-hint">Select a layer or module to explore.</p>
    </div>
  );
}

const handoverItems = ["Project code", "Configuration", "Deployment setup", "Operating docs"];

function Handover() {
  const [handedOver, setHandedOver] = useState(false);
  return (
    <div className="factory-handover" data-handed-over={handedOver}>
      <div className="factory-handover-board">
        <div className="factory-handover-lane">
          <span>Configured with Arc’IT</span>
        </div>
        <div className="factory-handover-lane">
          <span>Operated by your team</span>
        </div>
        <div className="factory-handover-package">
          {handoverItems.map((item) => (
            <div className="factory-handover-item" key={item}>
              <ArcitMark className="factory-handover-mark" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="factory-handover-controls">
        <button
          type="button"
          className="factory-preview-action"
          onClick={() => setHandedOver((value) => !value)}
        >
          {handedOver ? "Reset preview" : "Preview handover"}
          <span aria-hidden="true">{handedOver ? "↶" : "→"}</span>
        </button>
        <p aria-live="polite">
          {handedOver
            ? "Ready for your team or another partner to operate and extend. Further support is optional."
            : "Code, configuration and documentation are prepared alongside the work."}
        </p>
      </div>
      <p className="factory-handover-extension">
        The same foundation can support domain modules, such as Power BI.
      </p>
    </div>
  );
}

export default function FactoryVisualReview() {
  const params = new URLSearchParams(window.location.search);
  const selected =
    variations.find((variant) => variant.id === params.get("factory")) ?? variations[0];
  return (
    <>
      <div className="factory-comparison">
        <span>Local design preview</span>
        <nav aria-label="Factory design variations">
          {variations.map((variant) => {
            const next = new URLSearchParams(params);
            next.set("factory", variant.id);
            return (
              <a
                key={variant.id}
                href={`?${next.toString()}#factory-visual`}
                aria-current={selected.id === variant.id ? "page" : undefined}
              >
                {variant.name}
              </a>
            );
          })}
        </nav>
      </div>
      <div className="factory-visual-heading">
        <ArcitMark className="factory-visual-mark" />
        <p>{selected.note}</p>
      </div>
      {selected.id === "stack" ? (
        <CutStack />
      ) : selected.id === "handover" ? (
        <Handover />
      ) : (
        <FactoryFlow />
      )}
    </>
  );
}
