import type { FactoryLayerId, FactoryModuleId } from "./factory-stack-data";

export type AgentName = "codex" | "claude";
export type AgentAction = "idle" | "walk" | "ride" | "work";
export type AgentPose = {
  x: number;
  y: number;
  floor: number;
  action: AgentAction;
  phase: number;
  facing: number;
  opacity: number;
};
export type AgentPositions = Record<AgentName, AgentPose>;
type Stop = { at: number; pose: AgentPose };
export type AgentScene = {
  layer: FactoryLayerId;
  module: FactoryModuleId;
  turn: number;
  seed: number;
  leader: AgentName;
  collaborative: boolean;
  tracks: Record<AgentName, Stop[]>;
  helpers: {
    name: AgentName;
    layer: FactoryLayerId;
    left: boolean;
    floor: number;
    source: "control" | "factory";
    dispatchAt: number;
    stops: Stop[];
  }[];
  arriveAt: number;
  handoffAt: number;
  reviewAt: number;
  installAt: number;
  duration: number;
};
const floorIndex: Record<FactoryLayerId, number> = {
  ops: 0,
  work: 1,
  context: 2,
  inference: 3,
  compute: 4,
  foundation: 2,
  access: 0,
};
const floorNames: FactoryLayerId[] = ["ops", "work", "context", "inference", "compute"];
const pose = (
  x: number,
  y: number,
  floor: number,
  facing: number,
  action: AgentAction = "idle",
  opacity = 1,
): AgentPose => ({ x, y, floor, facing, action, opacity, phase: 0 });
const smooth = (p: number) => p * p * (3 - 2 * p);
export function agentHomes(seed = 0): AgentPositions {
  const left = pose(146, 161, 0, 1),
    right = pose(414, 161, 0, -1);
  return seed % 2 ? { codex: right, claude: left } : { codex: left, claude: right };
}

/** A route retains its own timing, including unfinished work across story beats. */
function itinerary(stops: Stop[], serviceRoute = false) {
  const last = () => stops[stops.length - 1];
  const add = (p: AgentPose, seconds: number) => stops.push({ at: last().at + seconds, pose: p });
  function hold(action: AgentAction, seconds: number) {
    last().pose.action = action;
    add({ ...last().pose, phase: 0 }, seconds);
  }
  function travel(floor: number) {
    const from = last().pose;
    const left = from.x < 280,
      facing = left ? 1 : -1,
      station = left ? 128 : 438,
      lift = serviceRoute ? (left ? 84 : 486) : left ? 108 : 462;
    const baseY = 161 + floor * 96;
    if (Math.abs(from.floor - floor) > 0.001) {
      if (Math.abs(from.x - lift) > 0.01) {
        last().pose.action = "walk";
        last().pose.facing = -facing;
        add(
          pose(station, 161 + from.floor * 96, from.floor, -facing, "walk"),
          Math.max(0.2, Math.abs(from.x - station) / 100),
        );
        add(pose(lift, 161 + from.floor * 96, from.floor, facing, "ride"), 0.3);
      } else last().pose.action = "ride";
      add(
        pose(lift, baseY, floor, facing, "walk"),
        Math.max(0.5, Math.abs(floor - from.floor) * 0.85),
      );
      add(pose(station, baseY, floor, facing), 0.3);
    } else {
      last().pose.action = "walk";
      last().pose.facing = Math.sign(station - from.x) || facing;
      add(
        pose(station, baseY, floor, facing),
        Math.max(0.2, Math.hypot(from.x - station, from.y - baseY) / 100),
      );
    }
  }
  return { last, add, hold, travel };
}

/** Change stations through the roof, keeping both doors clear before anyone exits. */
function exchangeSides(tracks: Record<AgentName, Stop[]>) {
  const routes = (["codex", "claude"] as const).map((name) => {
    const route = itinerary(tracks[name]);
    route.travel(0);
    const left = route.last().pose.x < 280;
    const door = left ? pose(232, 143, 0, 1) : pose(340, 110, 0, -1);
    const edge = left ? pose(192, 155, 0, 1, "walk") : pose(374, 140, 0, -1, "walk");
    route.last().pose.action = "walk";
    route.last().pose.facing = left ? 1 : -1;
    route.add(edge, 0.85);
    route.add({ ...door, action: "walk" }, 0.65);
    route.add({ ...door, opacity: 0 }, 0.01);
    return { route, left };
  });
  const indoorsAt = Math.max(...routes.map(({ route }) => route.last().at));
  routes.forEach(({ route, left }, index) => {
    route.hold("idle", indoorsAt - route.last().at + 0.5 + index * 0.65);
    const exit = left ? pose(340, 110, 0, 1, "walk") : pose(232, 143, 0, -1, "walk");
    route.add({ ...exit, opacity: 0 }, 0.9);
    route.add(exit, 0.01);
    route.add(left ? pose(374, 140, 0, 1, "walk") : pose(192, 155, 0, -1, "walk"), 0.65);
    route.add(pose(left ? 438 : 128, 161, 0, left ? -1 : 1), 0.85);
  });
}

function remainingStops(stops: Stop[], seconds: number): Stop[] {
  return [
    { at: 0, pose: sampleStops(stops, seconds) },
    ...stops
      .filter((stop) => stop.at > seconds)
      .map((stop) => ({
        at: stop.at - seconds,
        pose: { ...stop.pose },
      })),
  ];
}

export function createAgentScene(
  layer: FactoryLayerId,
  module: FactoryModuleId,
  residents = agentHomes(),
  entrance = false,
  turn = 0,
  seed = 0,
  pending?: Record<AgentName, Stop[]>,
): AgentScene {
  const floor = floorIndex[layer];
  const leader: AgentName = (turn + seed) % 2 ? "claude" : "codex";
  const colleague: AgentName = leader === "codex" ? "claude" : "codex";
  const collaborative = !entrance && turn > 0 && (turn + seed) % 6 === 5;
  const tracks = Object.fromEntries(
    (["codex", "claude"] as const).map((name) => [
      name,
      pending?.[name].map((stop) => ({ at: stop.at, pose: { ...stop.pose } })) ?? [
        { at: 0, pose: { ...residents[name], opacity: 1 } },
      ],
    ]),
  ) as Record<AgentName, Stop[]>;
  // Interruptions preserve the actual position. Ordinary loops preserve the rest
  // of each worker's route, so a scene boundary is not a simultaneous reset.
  for (const name of [leader, colleague]) {
    if (!pending && residents[name].action !== "ride") {
      itinerary(tracks[name]).hold(
        residents[name].action === "work" ? "work" : "idle",
        name === leader ? 0.25 : 3.1 + (seed % 3) * 0.65,
      );
    }
  }
  if (!entrance && !collaborative && turn > 1 && (turn + seed) % 5 === 2) {
    exchangeSides(tracks);
  }
  const primary = itinerary(tracks[leader]);
  primary.travel(floor);
  let arriveAt = primary.last().at;
  let handoffAt = 0,
    reviewAt = 0;
  let installAt: number;
  if (collaborative) {
    const review = itinerary(tracks[colleague]);
    review.travel(floor);
    arriveAt = Math.max(arriveAt, review.last().at);
    primary.hold("work", arriveAt - primary.last().at + 4.8);
    handoffAt = primary.last().at;
    reviewAt = handoffAt + 2.4;
    review.hold("idle", reviewAt - review.last().at);
    review.hold("work", 4.2);
    installAt = review.last().at;
    primary.hold("idle", installAt - primary.last().at + 3.6);
    review.hold("idle", 5.1);
  } else {
    primary.hold("work", 7.2 + ((turn + seed) % 4) * 0.7);
    installAt = primary.last().at;
    primary.hold("idle", 4.6);
    const other = itinerary(tracks[colleague]);
    let job = 0;
    // The other worker has a separate destination, work duration and break.
    // Longer jobs carry into the next scene instead of being cut short.
    while (other.last().at < installAt + 4) {
      const choices = [0, 1, 2, 3, 4].filter(
        (f) => f !== floor && f !== Math.round(other.last().pose.floor),
      );
      const destination = choices[(seed + turn + job * 2) % choices.length];
      other.travel(destination);
      other.hold("work", 5.7 + ((seed + turn * 2 + job) % 4) * 0.9);
      other.hold("idle", 1.8 + ((seed + job) % 3) * 0.55);
      job++;
    }
  }
  let duration = installAt + 3.6;
  const helperCount =
    entrance || turn < 3 || collaborative
      ? 0
      : [0, 0, 1, 0, 0, 0, 3, 0, 0, 0, 4, 0][(turn + seed) % 12];
  const helpers: AgentScene["helpers"] = [];
  // Helpers have a real top-floor origin and a return journey, never a lower-floor spawn.
  // Reserve space against both core routes and earlier helpers before dispatching.
  for (let i = 0; i < helperCount; i++) {
    const left = i % 2 === 0;
    const source = left ? "factory" : "control";
    const facing = left ? 1 : -1;
    const door = left ? pose(232, 143, 0, -1) : pose(340, 110, 0, 1);
    const edge = left ? pose(192, 155, 0, -1, "walk") : pose(374, 140, 0, 1, "walk");
    const landing = pose(left ? 128 : 438, 161, 0, facing, "walk");
    let candidate: AgentScene["helpers"][number] | undefined;
    for (let delay = 0; delay < 18 && !candidate; delay += 1.2) {
      for (const target of [4, 2, 3, 1]) {
        const start = 2 + i * 2.7 + delay;
        const stops: Stop[] = [
          { at: 0, pose: { ...door, opacity: 0 } },
          { at: start, pose: { ...door, action: "walk" } },
        ];
        const route = itinerary(stops, true);
        route.add(edge, 0.65);
        route.add(landing, 0.85);
        route.travel(target);
        route.hold("work", helperCount >= 3 && i < 2 ? 18 : 6.4 + i * 0.4);
        route.travel(0);
        route.last().pose.facing = left ? 1 : -1;
        route.last().pose.action = "walk";
        route.add({ ...edge, facing: left ? 1 : -1 }, 0.85);
        route.add({ ...door, facing: left ? 1 : -1, action: "walk" }, 0.65);
        route.add({ ...door, opacity: 0 }, 0.01);
        let clear = true;
        const obstacles = [...Object.values(tracks), ...helpers.map((helper) => helper.stops)];
        for (let t = start; t <= route.last().at && clear; t += 0.04) {
          const p = sampleStops(stops, t);
          for (const obstacle of obstacles) {
            const q = sampleStops(obstacle, t);
            if (p.opacity && q.opacity && Math.abs(p.x - q.x) < 34 && Math.abs(p.y - q.y) < 34) {
              clear = false;
              break;
            }
          }
        }
        if (clear) {
          candidate = {
            name: (Math.floor((turn + seed) / 12) + i + seed) % 2 ? "claude" : "codex",
            layer: floorNames[target],
            left,
            floor: target,
            source,
            dispatchAt: start - 1.2,
            stops,
          };
          break;
        }
      }
    }
    if (candidate) {
      helpers.push(candidate);
      duration = Math.max(duration, candidate.stops[candidate.stops.length - 1].at + 0.5);
    }
  }
  return {
    layer,
    module,
    turn,
    seed,
    leader,
    collaborative,
    tracks,
    helpers,
    arriveAt,
    handoffAt,
    reviewAt,
    installAt,
    duration,
  };
}

function sampleStops(stops: readonly Stop[], seconds: number): AgentPose {
  const last = stops[stops.length - 1];
  if (seconds >= last.at)
    return { ...last.pose, action: "idle", phase: last.pose.phase + seconds - last.at };
  const index = stops.findIndex(
    (stop, i) => i < stops.length - 1 && seconds >= stop.at && seconds < stops[i + 1].at,
  );
  const start = stops[Math.max(0, index)],
    end = stops[Math.max(0, index) + 1];
  const t = Math.max(0, (seconds - start.at) / (end.at - start.at));
  const amount = start.pose.action === "ride" ? smooth(t) : t;
  return {
    ...start.pose,
    x: start.pose.x + (end.pose.x - start.pose.x) * amount,
    y: start.pose.y + (end.pose.y - start.pose.y) * amount,
    floor: start.pose.floor + (end.pose.floor - start.pose.floor) * amount,
    // Visibility switches only behind the helper doorway clip, never through an alpha fade.
    opacity: start.pose.opacity,
    phase: start.pose.phase + seconds - start.at,
  };
}
export function agentSceneFrame(scene: AgentScene, seconds: number): AgentPositions {
  const t = Number.isFinite(seconds) ? Math.max(0, seconds) : scene.duration;
  return { codex: sampleStops(scene.tracks.codex, t), claude: sampleStops(scene.tracks.claude, t) };
}
export function agentHelperFrames(scene: AgentScene, seconds: number) {
  return scene.helpers.map((helper) => ({
    name: helper.name,
    source: helper.source,
    dispatch: seconds >= helper.dispatchAt && seconds < helper.dispatchAt + 1.6,
    left: helper.left,
    floor: helper.floor,
    pose: sampleStops(helper.stops, seconds),
  }));
}
export function nextAgentScene(scene: AgentScene, residents: AgentPositions, manual: boolean) {
  const turn = scene.turn + 1;
  const tour: FactoryLayerId[] = ["context", "work", "compute", "work", "inference", "ops", "work"];
  const layer = tour[(turn - 1 + (scene.seed % 3) * 2) % tour.length];
  const modules: FactoryModuleId[] = ["software", "powerbi", "defence"];
  const module =
    !manual && layer === "work" ? modules[(modules.indexOf(scene.module) + 1) % 3] : scene.module;
  return createAgentScene(layer, module, residents, false, turn, scene.seed, {
    codex: remainingStops(scene.tracks.codex, scene.duration),
    claude: remainingStops(scene.tracks.claude, scene.duration),
  });
}
export function agentLift(p: AgentPose) {
  return [84, 108, 462, 486].some((x) => Math.abs(p.x - x) < 0.01) ? { x: p.x, y: p.y } : null;
}
export function agentParcel(scene: AgentScene, seconds: number) {
  if (!scene.collaborative || seconds < scene.handoffAt || seconds > scene.reviewAt + 0.4)
    return null;
  const from = agentSceneFrame(scene, scene.arriveAt)[scene.leader];
  const direction = from.x < 280 ? 1 : -1;
  const handoff = Math.max(
    0,
    Math.min(1, (seconds - scene.handoffAt) / (scene.reviewAt - scene.handoffAt)),
  );
  const receiver = agentSceneFrame(scene, scene.arriveAt)[
    scene.leader === "codex" ? "claude" : "codex"
  ];
  return {
    x: from.x + direction * 19 + (receiver.x - from.x - direction * 38) * smooth(handoff),
    y: from.y - 13 + Math.sin(Math.PI * handoff) * 66,
    scale: 1,
    opacity: 1,
    reviewed: seconds >= scene.installAt,
  };
}

// OpenAI's public Codex pet catalogue: native 192×208 frames, 8 columns × 9 rows.
export function codexFrame(pose: AgentPose) {
  const idle = [1680, 660, 660, 840, 840, 1920];
  const row = pose.action === "walk" ? (pose.facing < 0 ? 2 : 1) : pose.action === "work" ? 7 : 0;
  const durations =
    row === 0
      ? idle
      : row === 7
        ? [120, 120, 120, 120, 120, 220]
        : [120, 120, 120, 120, 120, 120, 120, 220];
  let t = (pose.phase * 1000) % durations.reduce((a, b) => a + b, 0),
    column = 0;
  while (column < durations.length - 1 && t >= durations[column]) t -= durations[column++];
  return { row, column };
}
