import { useEffect, useId, useRef, useState } from "react";
import {
  agentHomes,
  agentSceneFrame,
  agentLift,
  agentHelperFrames,
  agentParcel,
  nextAgentScene,
  type AgentScene,
  createAgentScene,
  codexFrame,
  type AgentPose,
  type AgentName,
} from "../factory-agent-motion";
import { playAgentScene, type AgentBeat } from "../factory-agent-player";
import type { FactoryLayerId, FactoryModuleId } from "../factory-stack-data";

export type FactoryAgentTask = {
  id: number;
  layer: FactoryLayerId;
  module: FactoryModuleId;
  manual: boolean;
};
export type FactoryAgentEvent = { taskId: number; scene: AgentScene; beat: AgentBeat };
export type FactoryAgentProps = {
  task: FactoryAgentTask;
  seed: number;
  onBeat: (event: FactoryAgentEvent) => void;
};

function CodexWorker({ pose }: { pose: AgentPose }) {
  const { row, column } = codexFrame(pose);
  return (
    <svg
      x={-(38 * 192) / 208 / 2}
      y="-38"
      width={(38 * 192) / 208}
      height="38"
      viewBox="0 0 192 208"
      overflow="hidden"
    >
      <image
        href="/assets/factory-tools/codex-spritesheet-v4.webp"
        width="1536"
        height="1872"
        x={-column * 192}
        y={-row * 208}
      />
    </svg>
  );
}
function ClaudeWorker({ pose, clock }: { pose: AgentPose; clock: number }) {
  const step = pose.action === "walk" ? Math.sin(pose.phase * Math.PI * 4) : 0;
  const blink = clock % 4.8 > 0.7 && clock % 4.8 < 0.84;
  const working = pose.action === "work";
  return (
    <g transform={`scale(${pose.facing} 1)`}>
      <g transform="translate(-19 -31.6667) scale(1.583333)">
        {/* Segmented from the MIT Lobe Icons silhouette; motion is original. */}
        <g fill="#D97757">
          <path d="M3 5H20.998V17.079H3Z" />
          <path d="M0 10.949H3V14.051H0Z" />
          <g
            transform={`rotate(${working ? -12 + Math.sin(pose.phase * 4.2) * 14 : step * 8} 21 12)`}
          >
            <path d="M20.998 10.949H24V14.051H20.998Z" />
            {working && (
              <path className="factory-clawd-tool" d="M23 11L27 8M26 5L26 8L29 9L31 7L29 7L28 5Z" />
            )}
          </g>
          {[4.487, 7.488, 15, 18].map((x, i) => (
            <rect
              key={x}
              x={x}
              y={17.079 + Math.min(0, (i % 2 ? -step : step) * 0.7)}
              width="1.5"
              height="2.921"
            />
          ))}
        </g>
        <g fill="var(--factory-top)">
          <rect x="6" y={blink ? 9.4 : 8.102} width="1.488" height={blink ? 0.4 : 2.847} />
          <rect x="16.51" y={blink ? 9.4 : 8.102} width="1.49" height={blink ? 0.4 : 2.847} />
        </g>
      </g>
    </g>
  );
}
function Transfer({ pose, serviceRoute = false }: { pose: AgentPose; serviceRoute?: boolean }) {
  const lift = agentLift(pose);
  const left = pose.x < 280;
  const liftX = serviceRoute ? (left ? 84 : 486) : left ? 108 : 462;
  const floor = Math.round((pose.y - 161) / 96);
  const floorY = 161 + floor * 96;
  const nearFloor = Math.abs(pose.y - floorY) < 0.01;
  const between = Math.max(0, Math.min(3, Math.floor((pose.y - 161) / 96)));
  const upper = 161 + between * 96;
  const outside = left ? pose.x < 128 : pose.x > 438;
  return (
    <g className="factory-service-lift">
      {nearFloor && outside && (
        <path
          className="factory-lift-landing"
          d={left ? `M${liftX} ${floorY}H130` : `M436 ${floorY}H${liftX}`}
        />
      )}
      {lift && (
        <>
          <path
            className="factory-lift-guide"
            d={
              left
                ? `M128 ${upper}H${lift.x}V${upper + 96}H128`
                : `M438 ${upper}H${lift.x}V${upper + 96}H438`
            }
          />
          <g transform={`translate(${lift.x} ${lift.y})`}>
            <path className="factory-lift-car" d="M-15 0H15L11 5H-11Z" />
            <path className="factory-lift-rim" d="M-15-4V0H15V-4" />
          </g>
        </>
      )}
    </g>
  );
}
function Worker({ name, pose, clock }: { name: AgentName; pose: AgentPose; clock: number }) {
  return (
    <g transform={`translate(${pose.x} ${pose.y}) scale(${32 / 38})`} opacity={pose.opacity}>
      <ellipse className="factory-agent-shadow" cy="1" rx="11" ry="2" />
      {name === "codex" ? <CodexWorker pose={pose} /> : <ClaudeWorker pose={pose} clock={clock} />}
    </g>
  );
}
export function FactoryAgents({ task, seed, onBeat }: FactoryAgentProps) {
  const instance = useId();
  const element = useRef<SVGSVGElement>(null);
  const positions = useRef(agentHomes(seed));
  const hasPlayed = useRef(false);
  const onBeatRef = useRef(onBeat);
  const taskRef = useRef(task);
  useEffect(() => {
    onBeatRef.current = onBeat;
    taskRef.current = task;
  }, [onBeat, task]);
  const [frame, setFrame] = useState(() => {
    const scene = createAgentScene(task.layer, task.module, agentHomes(seed), true, 0, seed);
    return { poses: agentSceneFrame(scene, 0), clock: 0, running: false, scene };
  });
  useEffect(() => {
    if (!element.current) return;
    const request = taskRef.current;
    let appliedTask = request.id;
    const scene = createAgentScene(
      request.layer,
      request.module,
      positions.current,
      !hasPlayed.current,
      0,
      seed,
    );
    hasPlayed.current = true;
    return playAgentScene(
      element.current,
      scene,
      (poses, clock, running, activeScene) => {
        positions.current = poses;
        setFrame({ poses, clock, running, scene: activeScene });
      },
      {
        beat: (activeScene, beat) =>
          onBeatRef.current({ taskId: taskRef.current.id, scene: activeScene, beat }),
        next: (activeScene, poses) => {
          const request = taskRef.current;
          // Selection updates the surface immediately. Finish the current routes
          // before taking the new brief, so helpers do not disappear mid-journey.
          if (request.id !== appliedTask) {
            appliedTask = request.id;
            return createAgentScene(
              request.layer,
              request.module,
              poses,
              false,
              activeScene.turn + 1,
              seed,
            );
          }
          return nextAgentScene(activeScene, poses, request.manual);
        },
      },
    );
  }, [seed]);
  const parcel = agentParcel(frame.scene, frame.clock);
  return (
    <svg
      ref={element}
      className="factory-working-agents"
      viewBox="0 0 560 700"
      aria-hidden="true"
      focusable="false"
      data-running={frame.running}
    >
      <defs>
        {/* The roof hides each worker until it walks through an actual doorway.
            Both apertures are cut into the same roof silhouette as FactorySlab. */}
        <clipPath id={`${instance}-roof-doors`} clipPathUnits="userSpaceOnUse">
          <path
            clipRule="evenodd"
            d="M0 0H560V700H0Z
            M208 102 280 66 316 96V84L321.25 88.375 330 84 346 92V109L352 114V132L280 168 208 132Z
            M226 130 236 135V146L226 141Z
            M337 101 342 98V110L337 113Z"
          />
        </clipPath>
      </defs>
      {agentHelperFrames(frame.scene, frame.clock).map((helper, index) => (
        <g key={`helper-${index}`}>
          {helper.dispatch && helper.source === "control" && (
            <g className="factory-dispatch-note" transform="translate(354 80)">
              <path d="M0 0H20V14H7L3 18V14H0Z" />
              <path className="factory-parcel-mark" d="M5 5H15M5 9H12" />
            </g>
          )}
          <g clipPath={`url(#${instance}-roof-doors)`}>
            {helper.pose.opacity > 0 && <Transfer pose={helper.pose} serviceRoute />}
            <Worker name={helper.name} pose={helper.pose} clock={frame.clock + index * 0.83} />
          </g>
        </g>
      ))}
      {(["codex", "claude"] as const).map((name) => (
        <g key={name} clipPath={`url(#${instance}-roof-doors)`}>
          {frame.poses[name].opacity > 0 && <Transfer pose={frame.poses[name]} />}
          <Worker
            name={name}
            pose={frame.poses[name]}
            clock={frame.clock + (name === "claude" ? 1.7 : 0)}
          />
        </g>
      ))}
      {parcel && (
        <g
          className="factory-team-parcel"
          opacity={parcel.opacity}
          transform={`translate(${parcel.x} ${parcel.y}) scale(${parcel.scale})`}
        >
          <path d="M-9-5 0-10 9-5 9 3 0 8-9 3Z" />
          <path
            className="factory-parcel-mark"
            d={parcel.reviewed ? "M-4-1-1 2 5-4" : "M-4-3H4M-4 0H2"}
          />
        </g>
      )}
    </svg>
  );
}
