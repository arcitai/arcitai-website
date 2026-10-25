import { useEffect, useId, useRef, useState, type CSSProperties, type ComponentType } from "react";
import type { FactoryChannelLayout, FactoryChannelProps } from "./FactoryChannels";
import type { FactoryAgentTask, FactoryAgentProps, FactoryAgentEvent } from "./FactoryAgents";
import {
  describeFactoryLayer,
  factoryLayers,
  factoryModules,
  workTags,
  factoryPanelIds,
  moduleSource,
  type FactoryLayerId,
  type FactoryModuleId,
} from "../factory-stack-data";
import { factoryToolsForLayer } from "../factory-tools";
import { FactoryMobileTools } from "./FactoryToolMarks";
import { observeStackOpening } from "../factory-stack-motion";
import { FactoryIslandBase, FactorySlab } from "./FactoryIsland";
import "./arc-material.css";
import "./factory-stack.css";

const layerPitch = 96;
const closedPitch = 28;
const planeTags: Record<FactoryLayerId, readonly [string, string]> = {
  ops: ["Orchestration", "Human input"],
  work: ["Build & test", "Review"],
  context: ["Business data", "MCP · tools"],
  inference: ["Model choice", "Local & cloud"],
  compute: ["Host · runner", "Sandbox"],
  foundation: ["Project config", "Host config"],
  access: ["Brief · decide", "Review · get notified"],
};
// Complete terminology remains in the accessible label and detail panel.
const planeNotes: Partial<Record<FactoryLayerId, readonly [string, string]>> = {
  ops: ["Routines", ""],
  context: ["Metadata", "Permissions"],
  inference: ["", "Cost"],
  compute: ["", "Isolation"],
};

function FactoryHandover() {
  return (
    <div className="factory-handover">
      <p>Your team or another partner can take it forward. Further support is optional.</p>
    </div>
  );
}

export type FactoryPreviewDesign = {
  id: FactoryChannelLayout;
  facades: Partial<Record<FactoryLayerId, string>>;
  Channels: ComponentType<FactoryChannelProps>;
  Agents: ComponentType<FactoryAgentProps>;
};

export function FactoryStack({ design }: { design?: FactoryPreviewDesign }) {
  const Channels = design?.Channels;
  const Agents = design?.Agents;
  const instance = useId();
  const [seed] = useState(() => {
    const random = Math.random();
    try {
      const saved = sessionStorage.getItem("arcit-factory-story");
      const previous = saved === null ? -1 : Number(saved);
      const next =
        Number.isInteger(previous) && previous >= 0 && previous < 24
          ? (previous + 1 + Math.floor(random * 23)) % 24
          : Math.floor(random * 24);
      sessionStorage.setItem("arcit-factory-story", String(next));
      return next;
    } catch {
      return Math.floor(random * 24);
    }
  });
  const initialModule = (["software", "powerbi", "defence"] as const)[seed % 3];
  const [moduleId, setModuleId] = useState<FactoryModuleId>(initialModule);
  const [surfaceCues, setSurfaceCues] = useState<Record<string, number>>(() =>
    Object.fromEntries(factoryLayers.map((layer, index) => [layer, (seed + index) % 4])),
  );
  const taskVersion = useRef(0);
  const [selected, setSelected] = useState<FactoryLayerId>("work");
  const [directory, setDirectory] = useState(false);
  const [fullyOpen, setFullyOpen] = useState(false);
  const [agentTask, setAgentTask] = useState<FactoryAgentTask>({
    id: 0,
    layer: "work",
    module: initialModule,
    manual: false,
  });
  const track = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const more = useRef<HTMLButtonElement>(null);
  const motion = useRef<ReturnType<typeof observeStackOpening>>();
  const active = describeFactoryLayer(selected, moduleId);
  const currentModule = factoryModules.find((module) => module.id === moduleId)!;
  useEffect(() => {
    if (!track.current) return;
    const controller = observeStackOpening(track.current, (progress) => {
      setFullyOpen(progress === 1);
    });
    motion.current = controller;
    return () => {
      controller.stop();
      motion.current = undefined;
    };
  }, []);

  function storyBeat({ taskId, scene, beat }: FactoryAgentEvent) {
    // A click invalidates queued callbacks before React commits the new task.
    if (taskId !== taskVersion.current) return;
    const floor =
      beat === "arrive"
        ? factoryLayers[(scene.turn + scene.seed) % factoryLayers.length]
        : scene.layer === "foundation"
          ? "context"
          : scene.layer === "access"
            ? "ops"
            : scene.layer;
    setSurfaceCues((cues) => {
      const next = { ...cues };
      next[floor] = (next[floor] ?? 0) + 1;
      return next;
    });
    if (beat === "install" && !agentTask.manual) {
      setModuleId(scene.module);
      setSelected(scene.layer);
    }
  }
  function startTask(layer: FactoryLayerId, module: FactoryModuleId) {
    taskVersion.current += 1;
    setAgentTask({ id: taskVersion.current, layer, module, manual: true });
  }
  function keepReading() {
    if (!agentTask.manual) startTask(selected, moduleId);
  }
  function chooseModule(id: FactoryModuleId, fromDirectory = false) {
    // The activated directory button will be hidden. Keep focus in a visible control.
    if (fromDirectory) more.current?.focus({ preventScroll: true });
    startTask("work", id);
    setModuleId(id);
    setSelected("work");
    setDirectory(false);
  }
  function chooseLayer(id: FactoryLayerId, pointer = false) {
    // A click on a floor navigates to the same earlier scroll endpoint as Explore layers.
    startTask(id, moduleId);
    setSelected(id);
    setDirectory(false);
    if (!motion.current?.isOpen()) motion.current?.explore(true);
    revealDetail(pointer);
  }
  /** Phones list the layers above their detail, so a tap goes straight to it. Keyboard
   * activation keeps focus and scroll in place; "Read selected layer" follows the layers. */
  function revealDetail(pointer: boolean) {
    if (!pointer || !matchMedia("(max-width: 760px)").matches) return;
    requestAnimationFrame(() => {
      const node = panel.current;
      if (!node) return;
      const { top } = node.getBoundingClientRect();
      if (top > 80 && top < window.innerHeight * 0.6) return;
      node.scrollIntoView({
        block: "start",
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    });
  }
  function returnToLayers() {
    const layers = stage.current;
    const current = layers?.querySelector<HTMLButtonElement>('button[aria-pressed="true"]');
    const target = current ?? layers?.querySelector<HTMLButtonElement>("button");
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({
      block: "center",
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }
  const detailId = `${instance}-detail`;
  return (
    <div
      ref={track}
      className="factory-stack"
      data-module={moduleId}
      data-directory={directory}
      data-design={design?.id}
    >
      <div className="factory-frame">
        <div className="factory-toolbar">
          <div className="factory-module-picker" role="group" aria-label="Work module">
            {factoryModules
              .filter((module) => module.featured)
              .map((module) => (
                <button
                  type="button"
                  key={module.id}
                  data-module={module.id}
                  aria-pressed={!directory && moduleId === module.id}
                  aria-controls={detailId}
                  onClick={() => chooseModule(module.id)}
                >
                  <span className="module-dot" aria-hidden="true" />
                  {module.title}
                </button>
              ))}
            <button
              ref={more}
              type="button"
              className="factory-more-modules"
              aria-pressed={directory}
              aria-controls={detailId}
              onClick={(event) => {
                startTask("work", moduleId);
                setDirectory(true);
                revealDetail(event.detail > 0);
              }}
            >
              <span className="module-dot module-dot-directory" aria-hidden="true" />
              More modules
              {!currentModule.featured && !directory && (
                <span className="factory-more-selection">
                  {" "}
                  · {currentModule.title}
                  <span className="sr-only">, selected</span>
                </span>
              )}
            </button>
          </div>
        </div>
        <div className="factory-composition">
          <figure
            className="factory-drawing"
            aria-label="Factory: five layers on a shared foundation"
          >
            <div ref={stage} className="factory-stage" data-module={moduleId}>
              <FactoryIslandBase />
              {design?.id !== "bridge" && (
                <div className="factory-entry">
                  <button
                    type="button"
                    aria-pressed={!directory && selected === "access"}
                    aria-controls={detailId}
                    onClick={(event) => chooseLayer("access", event.detail > 0)}
                  >
                    <strong>You / your AI agent</strong>
                    <span>Brief · decide · review · get notified</span>
                    {!design && (
                      <span
                        className="factory-communication"
                        title="Communication channel example: Slack"
                      >
                        <img src="/assets/factory-tools/slack.png" width="16" height="16" alt="" />
                        <span className="factory-communication-name" aria-hidden="true">
                          Your workspace
                        </span>
                        <span className="sr-only">Your workspace, for example Slack</span>
                      </span>
                    )}
                  </button>
                  <span className="factory-entry-route" aria-hidden="true" />
                </div>
              )}
              {design && Channels && (
                <Channels
                  layout={design.id}
                  select={(pointer) => chooseLayer("access", pointer)}
                  controls={detailId}
                  selected={!directory && selected === "access"}
                />
              )}
              {factoryLayers.map((id, index) => {
                const detail = describeFactoryLayer(id, moduleId);
                const moduleDirectory = directory && id === "work";
                const title = moduleDirectory ? "Modules" : detail.title;
                const tags: readonly [string, string] = moduleDirectory
                  ? ["Composable", "Specialist"]
                  : id === "work"
                    ? workTags[moduleId]
                    : planeTags[id];
                const notes =
                  design && id === "compute" ? (["Linux", "Isolation"] as const) : planeNotes[id];
                const facade = design
                  ? moduleDirectory
                    ? "Your workflow"
                    : design.facades[id]
                  : undefined;
                const description = [...tags, ...(notes ?? [])].filter(Boolean).join(", ");
                return (
                  <button
                    type="button"
                    key={id}
                    className="factory-layer"
                    data-layer={id}
                    aria-label={`${title}: ${description}${facade ? `; ${facade}` : ""}${moduleDirectory && design ? "; Configure your own" : ""}`}
                    aria-pressed={moduleDirectory || (!directory && selected === id)}
                    aria-controls={detailId}
                    onClick={(event) => {
                      if (moduleDirectory) setDirectory(true);
                      else chooseLayer(id, event.detail > 0);
                    }}
                    style={
                      {
                        top: `${((70 + index * layerPitch) / 560) * 100}cqw`,
                        "--layer-shift": `${((-index * (layerPitch - closedPitch)) / 560) * 100}cqw`,
                        zIndex: 6 - index,
                      } as CSSProperties
                    }
                  >
                    <FactorySlab
                      layer={id}
                      module={moduleId}
                      title={title}
                      tags={tags}
                      directory={moduleDirectory}
                      facade={facade}
                      configure={moduleDirectory && !!design}
                      hideOpsTools={!!design && fullyOpen && !directory}
                      cueIndex={surfaceCues[id] ?? 0}
                      animateCopy={fullyOpen && !!design}
                    />
                    {moduleDirectory ? (
                      <svg
                        className="factory-mobile-tools factory-module-placeholder"
                        viewBox="0 0 76 40"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <rect x="4" y="12" width="16" height="16" rx="2" />
                        <rect x="30" y="12" width="16" height="16" rx="2" />
                        <rect x="56" y="12" width="16" height="16" rx="2" />
                      </svg>
                    ) : (
                      <FactoryMobileTools layer={id} module={moduleId} />
                    )}
                    <span className="factory-layer-label">
                      <strong>{title}</strong>
                      <span>{tags.join(" · ")}</span>
                      {facade && (
                        <span className="factory-mobile-facade">
                          {moduleDirectory ? "Configure your own" : facade}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
              {design && Agents && fullyOpen && !directory && (
                <Agents task={agentTask} seed={seed} onBeat={storyBeat} />
              )}
              <div className="factory-foundation-group">
                <button
                  type="button"
                  aria-pressed={!directory && selected === "foundation"}
                  aria-controls={detailId}
                  onClick={(event) => chooseLayer("foundation", event.detail > 0)}
                >
                  <strong>Foundation</strong>
                  <span className="foundation-summary-desktop">Prepares 3 layers</span>
                  <span className="foundation-summary-mobile">
                    Prepares Data &amp; Context, Inference and Compute
                  </span>
                </button>
              </div>
            </div>
            <button
              type="button"
              className="factory-read-detail"
              onClick={() => {
                panel.current?.focus({ preventScroll: true });
                panel.current?.scrollIntoView({ block: "nearest", behavior: "instant" });
              }}
            >
              Read selected layer <span aria-hidden="true">↓</span>
            </button>
          </figure>
          <aside
            className="factory-sidebar"
            aria-label="Inside the Factory"
            onFocusCapture={keepReading}
          >
            <div
              ref={panel}
              id={detailId}
              className="factory-detail-panels"
              role="region"
              tabIndex={-1}
              aria-label="Factory details"
            >
              {/* Each candidate reserves space, including the directory, to prevent module/layer shifts. */}
              {factoryModules.flatMap((module) =>
                factoryPanelIds.map((id) => {
                  const detail = describeFactoryLayer(id, module.id);
                  const toolExamples = factoryToolsForLayer(id, module.id).flatMap((mark) =>
                    mark.example ? [mark.example] : [],
                  );
                  if (id === "ops") toolExamples.push("T3 Code (optional workspace)");
                  const isActive = !directory && selected === id && moduleId === module.id;
                  return (
                    <section
                      key={`${module.id}-${id}`}
                      className="factory-detail-panel"
                      data-active={isActive}
                      aria-hidden={!isActive}
                      aria-labelledby={`${instance}-${module.id}-${id}-heading`}
                    >
                      <p className="factory-panel-kicker">{detail.subtitle}</p>
                      <h3 id={`${instance}-${module.id}-${id}-heading`}>{detail.title}</h3>
                      <p>{detail.description}</p>
                      {detail.terms.length > 0 && (
                        <ul className="factory-technical-terms">
                          {detail.terms.map((term) => (
                            <li key={term}>{term}</li>
                          ))}
                        </ul>
                      )}
                      {detail.steps.length > 0 && (
                        <ol className="factory-workflow" aria-label="Work stages">
                          {detail.steps.map((step) => (
                            <li key={step}>{step}</li>
                          ))}
                        </ol>
                      )}
                      <div className="factory-routines">
                        <h4>{detail.routineLabel}</h4>
                        <p>{detail.routine}</p>
                      </div>
                      {detail.source && module.id !== "software" && (
                        <a
                          className="factory-module-source"
                          href={detail.source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          tabIndex={isActive ? 0 : -1}
                        >
                          View {module.title} source <span aria-hidden="true">↗</span>
                        </a>
                      )}
                      {toolExamples.length > 0 && (
                        <p className="factory-tool-examples">
                          <span>Tool examples</span>
                          {toolExamples.join(" · ")}
                          <br />
                          Selected to fit your project.
                        </p>
                      )}
                      {id === "compute" && (
                        <p className="factory-tool-examples">
                          <span>Host example</span>
                          Linux, optionally with{" "}
                          <a
                            href="https://omarchy.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            tabIndex={isActive ? 0 : -1}
                          >
                            Omarchy
                          </a>
                          . Choose the host and OS to fit your infrastructure.
                        </p>
                      )}
                      {design && id === "access" && (
                        <p className="factory-tool-examples">
                          <span>Channel examples</span>Microsoft Teams · Slack.
                          <br />
                          Connections follow the tools and access selected for your project.
                        </p>
                      )}
                    </section>
                  );
                }),
              )}
              <section
                className="factory-detail-panel factory-directory"
                data-active={directory}
                aria-hidden={!directory}
                aria-labelledby={`${instance}-directory-heading`}
              >
                <p className="factory-panel-kicker">Specialist workflows</p>
                <h3 id={`${instance}-directory-heading`}>Modules</h3>
                <p>
                  Different work, the same foundation. Choose a workflow or browse the repositories.
                </p>
                <ul>
                  {factoryModules.map((module) => {
                    const source = moduleSource(module.id);
                    return (
                      <li key={module.id} data-module={module.id}>
                        <button
                          type="button"
                          onClick={() => chooseModule(module.id, true)}
                          tabIndex={directory ? 0 : -1}
                          aria-label={`Explore ${module.title} module`}
                        >
                          <span className="module-dot" aria-hidden="true" />
                          <strong>{module.title}</strong>
                          <span aria-hidden="true">→</span>
                        </button>
                        {source && (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            tabIndex={directory ? 0 : -1}
                          >
                            Source on GitHub <span aria-hidden="true">↗</span>
                            <span className="sr-only"> for {module.title}</span>
                          </a>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            </div>
            <button type="button" className="factory-back-to-layers" onClick={returnToLayers}>
              Choose another layer <span aria-hidden="true">↑</span>
            </button>
          </aside>
        </div>
        <FactoryHandover />
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {directory
          ? "Module directory."
          : agentTask.manual
            ? `${active.title} selected for ${currentModule.title}.`
            : ""}
      </p>
    </div>
  );
}
