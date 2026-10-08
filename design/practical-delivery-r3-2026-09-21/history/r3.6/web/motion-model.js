// Ported from the owner's transferred MethodFlow.tsx (24 September 2026).
// Same persistent particles, queues and smoothly opening channel; no React dependency.
// This is an illustration, never telemetry or a throughput estimate.
export const PARTICLE_COUNT = 96;
const gates = [630, 865];

export function createFlow(target = 0) {
  const state = {
    target,
    time: 0,
    openness: [0, 0],
    clocks: [0, 0],
    queues: [[], []],
    points: Array.from({ length: PARTICLE_COUNT }, (_, id) => ({
      id,
      x: 20 + ((id * 137) % 960),
      y: 140,
      lane: (((id * 43) % 100) / 100 - 0.5) * 58,
      speed: 28 + ((id * 17) % 11),
      size: id % 4 === 0 ? 6 : 4.5,
      queue: -1,
      passed: [false, false],
    })),
  };
  state.openness = [target > 0 ? 1 : 0, target > 1 ? 1 : 0];
  // Seed the same physical field with visible queues, not a separate fake still.
  for (let n = 0; n < 480; n++) advanceFlow(state, 1 / 60);
  return state;
}

function channelHalf(state, x) {
  return (
    46 -
    gates.reduce(
      (sum, gate, i) =>
        sum + 39 * (1 - state.openness[i]) * Math.exp(-Math.pow((x - gate) / 57, 2)),
      0,
    )
  );
}

export function setFlowTarget(state, target, immediate = false) {
  state.target = Math.min(2, Math.max(0, target));
  if (immediate) {
    state.openness = [state.target > 0 ? 1 : 0, state.target > 1 ? 1 : 0];
  }
}

export function advanceFlow(state, delta) {
  const dt = Number.isFinite(delta) ? Math.max(0, Math.min(delta, 0.05)) : 0;
  if (!dt) return;
  state.time += dt;
  for (let g = 0; g < 2; g++) {
    const target = state.target > g ? 1 : 0;
    state.openness[g] += (target - state.openness[g]) * Math.min(1, dt * 2.5);
    const interval = (g === 0 ? 0.8 : 1.15) * (1 - state.openness[g]) + 0.09 * state.openness[g];
    state.clocks[g] += dt;
    if (state.clocks[g] >= interval) {
      state.clocks[g] %= interval;
      const point = state.queues[g].shift();
      if (point) {
        point.queue = -1;
        point.passed[g] = true;
      }
    }
  }
  for (const point of state.points) {
    if (point.queue >= 0) continue;
    point.x += point.speed * dt * (1 + 0.18 * Math.min(...state.openness));
    for (let g = 0; g < 2; g++) {
      if (!point.passed[g] && point.x >= gates[g] - 18 && point.x <= gates[g] + 14) {
        if (state.openness[g] < 0.92) {
          point.queue = g;
          state.queues[g].push(point);
          break;
        }
        point.passed[g] = true;
      }
    }
    if (point.x > 985) {
      point.x = 10;
      point.passed = [false, false];
    }
  }
  for (let g = 0; g < 2; g++) {
    state.queues[g].forEach((point, rank) => {
      const targetX = gates[g] - 18 - Math.floor(rank / 3) * 7;
      point.x += (targetX - point.x) * Math.min(1, dt * 6);
    });
  }
  for (const point of state.points) {
    let targetY = 140 + point.lane * (channelHalf(state, point.x) / 46);
    if (point.queue >= 0) {
      const rank = state.queues[point.queue].indexOf(point);
      targetY = 140 + ((rank % 3) - 1) * 6;
    }
    point.y += (targetY - point.y) * Math.min(1, dt * 8);
  }
}

export function sampleFlow(state) {
  const top = [],
    bottom = [];
  for (let x = 20; x <= 980; x += 8) {
    const half = channelHalf(state, x);
    top.push(`${x === 20 ? "M" : "L"}${x} ${140 - half}`);
    bottom.push(`${x === 20 ? "M" : "L"}${x} ${140 + half}`);
  }
  // Slow 12–18 second breathing cycles, with no abrupt loading-bar resets.
  const bars = Array.from({ length: 4 }, (_, stage) => {
    const phase = (state.time / (12 + stage * 1.5) + stage * 0.13) * Math.PI * 2;
    return 0.16 + (1 - Math.cos(phase)) * 0.38;
  });
  return { points: state.points, bars, rails: top.join(" ") + bottom.join(" ") };
}

export function canAnimate({ reduced, paused, hidden, visible }) {
  return !reduced && !paused && !hidden && visible;
}
