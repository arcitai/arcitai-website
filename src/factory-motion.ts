export type FlowPoint = {
  id: number;
  x: number;
  y: number;
  lane: number;
  speed: number;
  size: number;
  queue: number;
};
export type FlowState = {
  target: number;
  progress: number;
  time: number;
  openness: number[];
  clocks: number[];
  queues: FlowPoint[][];
  points: FlowPoint[];
};
// Derived from the owner's transferred MethodFlow particle field.
// Progress illustrates connecting a workflow, never live project or security results.
export const PARTICLE_COUNT = 96;
export const GATES = [125, 375, 625, 875];
const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function createFlow(progress = 0): FlowState {
  const initial = Number.isFinite(progress) ? clamp(progress) : 0;
  const state: FlowState = {
    target: initial,
    progress: initial,
    time: 0,
    openness: GATES.map((_, i) => clamp(initial * 4 - i)),
    clocks: GATES.map(() => 0),
    queues: GATES.map(() => []),
    points: Array.from({ length: PARTICLE_COUNT }, (_, id) => ({
      id,
      // A staggered reservoir outside the SVG feeds a stream through its left edge.
      x: -12 - id * 18,
      y: 140 + (((id * 43) % 100) / 100 - 0.5) * 58,
      lane: (((id * 43) % 100) / 100 - 0.5) * 58,
      speed: 48 + ((id * 17) % 13),
      size: id % 4 === 0 ? 6 : 4.5,
      queue: -1,
    })),
  };
  return state;
}

export function setFlowProgress(state: FlowState, progress: number, immediate = false) {
  if (!Number.isFinite(progress)) return;
  state.target = clamp(progress);
  if (immediate) state.progress = state.target;
  state.openness = GATES.map((_, i) => clamp(state.progress * 4 - i));
}

function channelHalf(state: FlowState, x: number) {
  const constriction = Math.max(
    ...GATES.map((gate, i) => (1 - state.openness[i]) * Math.exp(-Math.pow((x - gate) / 62, 2))),
  );
  return 46 * (1 - constriction);
}

export function advanceFlow(state: FlowState, delta: number) {
  const dt = Number.isFinite(delta) ? Math.max(0, Math.min(delta, 0.05)) : 0;
  if (!dt) return;
  state.time += dt;
  // Follow the current scroll/preview target in either direction, without a timed loop.
  state.progress += (state.target - state.progress) * Math.min(1, dt * 7);
  if (Math.abs(state.target - state.progress) < 0.001) state.progress = state.target;
  state.openness = GATES.map((_, i) => clamp(state.progress * 4 - i));
  for (let g = 0; g < GATES.length; g++) {
    // Closed stages hold the squares. No work leaks through low bars.
    if (state.openness[g] < 0.98) continue;
    state.clocks[g] += dt;
    if (state.clocks[g] >= 0.16) {
      state.clocks[g] %= 0.16;
      const point = state.queues[g].shift();
      if (point) {
        point.queue = -1;
      }
    }
  }
  for (const point of state.points) {
    if (point.queue >= 0) continue;
    const previous = point.x;
    point.x += point.speed * dt;
    for (let g = 0; g < GATES.length; g++) {
      if (previous <= GATES[g] && point.x >= GATES[g] - 52) {
        if (state.openness[g] < 0.98) {
          point.x = Math.min(point.x, GATES[g] - 52);
          point.queue = g;
          state.queues[g].push(point);
          break;
        }
      }
    }
    if (point.x > 1008) {
      point.x = -12;
    }
  }
  for (let g = 0; g < GATES.length; g++) {
    state.queues[g].forEach((point, rank) => {
      // A loose stream backs up behind a bottleneck, not a packed grid.
      const targetX = GATES[g] - 52 - rank * 7;
      point.x += (targetX - point.x) * Math.min(1, dt * 6);
    });
  }
  for (const point of state.points) {
    let targetY = 140 + point.lane * (channelHalf(state, point.x) / 46);
    if (point.queue >= 0) {
      targetY = 140 + point.lane * (channelHalf(state, point.x) / 46) * 0.72;
    }
    point.y += (targetY - point.y) * Math.min(1, dt * 8);
  }
}

export function sampleFlow(state: FlowState) {
  const positions = [
    ...new Set([...Array.from({ length: 241 }, (_, i) => 20 + i * 4), ...GATES]),
  ].sort((a, b) => a - b);
  const rails = [-1, 1]
    .map((side) =>
      positions
        .map((x, i) => `${i ? "L" : "M"}${x} ${140 + side * channelHalf(state, x)}`)
        .join(" "),
    )
    .join(" ");
  return { points: state.points, bars: [...state.openness], rails };
}

export function scrollProgress(center: number, viewportHeight: number) {
  if (!Number.isFinite(center) || !Number.isFinite(viewportHeight) || viewportHeight <= 0) return 0;
  // Closed on approach; fully open after the illustration passes the reading line.
  return clamp((viewportHeight * 0.55 - center) / (viewportHeight * 0.25));
}

export function canAnimate({
  reduced,
  paused,
  hidden,
  visible,
}: {
  reduced: boolean;
  paused: boolean;
  hidden: boolean;
  visible: boolean;
}) {
  return !reduced && !paused && !hidden && visible;
}
