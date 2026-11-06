import { ArrowIcon } from "../family/ArrowIcon";
import { useEffect, useRef, useState } from "react";
import { ArcitMark } from "./ArcitMark";
import { AgenticSystemFlow } from "./AgenticSystemFlow";
import "./agentic-system-visual-review.css";

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
      "Build on the tools you choose, such as Codex, Claude Code, T3 Code and GitHub, with hosting and model choices that fit your infrastructure. Agentic Systems adds a method around them.",
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
    <div ref={ref} className="agentic-system-stack-scene">
      <div className="agentic-system-ownership-frame">
        <p className="agentic-system-ownership-label">Your approvals &amp; ownership</p>
        <div className="agentic-system-cut-stack">
          <div
            className="agentic-system-layers"
            role="group"
            aria-label="Explore the Agentic Systems method"
          >
            {layers.map((layer, index) => (
              <button
                key={layer.id}
                className={`agentic-system-layer agentic-system-layer-${index}`}
                type="button"
                aria-pressed={selectedId === layer.id}
                aria-controls="agentic-system-layer-detail"
                onClick={() => setSelectedId(layer.id)}
              >
                <span className="agentic-system-layer-number" aria-hidden="true">
                  0{layers.length - index}
                </span>
                <span className="agentic-system-layer-copy">
                  <strong>{layer.title}</strong>
                  <span>{layer.method}</span>
                </span>
                <span className="agentic-system-layer-square" aria-hidden="true" />
              </button>
            ))}
          </div>
          <div className="agentic-system-domain-slots">
            <button
              className="agentic-system-domain-module"
              type="button"
              aria-pressed={selectedId === powerBI.id}
              aria-controls="agentic-system-layer-detail"
              onClick={() => setSelectedId(powerBI.id)}
            >
              <span className="agentic-system-module-glyph" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <strong>Power BI</strong>
              <span>Example module</span>
            </button>
            <div className="agentic-system-domain-slot">
              <span aria-hidden="true">+</span>
              <span>Your domain</span>
            </div>
          </div>
        </div>
      </div>
      <div
        className="agentic-system-layer-detail"
        id="agentic-system-layer-detail"
        aria-live="polite"
        aria-atomic="true"
      >
        <div>
          <h4>{selected.title}</h4>
          <p className="agentic-system-detail-tags">{selected.tags}</p>
        </div>
        <p>{selected.detail}</p>
      </div>
      <p className="agentic-system-interaction-hint">Select a layer or module to explore.</p>
    </div>
  );
}

const handoverItems = ["Project code", "Configuration", "Deployment setup", "Operating docs"];

function Handover() {
  const [handedOver, setHandedOver] = useState(false);
  return (
    <div className="agentic-system-handover" data-handed-over={handedOver}>
      <div className="agentic-system-handover-board">
        <div className="agentic-system-handover-lane">
          <span>Configured with Arc’IT</span>
        </div>
        <div className="agentic-system-handover-lane">
          <span>Operated by your team</span>
        </div>
        <div className="agentic-system-handover-package">
          {handoverItems.map((item) => (
            <div className="agentic-system-handover-item" key={item}>
              <ArcitMark className="agentic-system-handover-mark" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="agentic-system-handover-controls">
        <button
          type="button"
          className="agentic-system-preview-action"
          onClick={() => setHandedOver((value) => !value)}
        >
          {handedOver ? "Reset preview" : "Preview handover"}
          <span aria-hidden="true">
            <ArrowIcon direction={handedOver ? "return" : "right"} />
          </span>
        </button>
        <p aria-live="polite">
          {handedOver
            ? "Ready for your team or another partner to operate and extend. Further support is optional."
            : "Code, configuration and documentation are prepared alongside the work."}
        </p>
      </div>
      <p className="agentic-system-handover-extension">
        The same foundation can support domain modules, such as Power BI.
      </p>
    </div>
  );
}

export default function AgenticSystemVisualReview() {
  const params = new URLSearchParams(window.location.search);
  const selected =
    variations.find((variant) => variant.id === params.get("agentic-system")) ?? variations[0];
  return (
    <>
      <div className="agentic-system-comparison">
        <span>Local design preview</span>
        <nav aria-label="Agentic Systems design variations">
          {variations.map((variant) => {
            const next = new URLSearchParams(params);
            next.set("agentic-system", variant.id);
            return (
              <a
                key={variant.id}
                href={`?${next.toString()}#agentic-system-visual`}
                aria-current={selected.id === variant.id ? "page" : undefined}
              >
                {variant.name}
              </a>
            );
          })}
        </nav>
      </div>
      <div className="agentic-system-visual-heading">
        <ArcitMark className="agentic-system-visual-mark" />
        <p>{selected.note}</p>
      </div>
      {selected.id === "stack" ? (
        <CutStack />
      ) : selected.id === "handover" ? (
        <Handover />
      ) : (
        <AgenticSystemFlow />
      )}
    </>
  );
}
