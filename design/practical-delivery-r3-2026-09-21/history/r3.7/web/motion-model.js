// Derived from the owner's transferred MethodFlow particle field.
// Progress illustrates connecting a workflow, never live project or security results.
export const PARTICLE_COUNT = 96;
export const GATES = [125, 375, 625, 875];
const clamp = (value) => Math.min(1, Math.max(0, value));

export function createFlow(progress = 0) {
  const initial = Number.isFinite(progress) ? clamp(progress) : 0;
  const state = {
    target: initial,
    progress: initial,
    time: 0,
    openness: GATES.map((_, i) => clamp(initial * 4 - i)),
    clocks: GATES.map(() => 0),
    queues: GATES.map(() => []),
    points: Array.from({ length: PARTICLE_COUNT }, (_, id) => ({
      id,
      x: 10 + Math.floor(id / 8) * 5.5,
      y: 140 + ((id % 8) - 3.5) * 5.5,
      lane: (((id * 43) % 100) / 100 - 0.5) * 58,
      speed: 48 + ((id * 17) % 13),
      size: id % 4 === 0 ? 6 : 4.5,
      queue: -1,
      passed: GATES.map(() => false),
    })),
  };
  return state;
}

export function setFlowProgress(state, progress, immediate = false) {
  if (!Number.isFinite(progress)) return;
  // Scrolling up or moving the pointer left must never undo the demonstration.
  state.target = Math.max(state.target, clamp(progress));
  if (immediate) state.progress = state.target;
  state.openness = GATES.map((_, i) => clamp(state.progress * 4 - i));
}

function channelHalf(state, x) {
  const constriction = Math.max(
    ...GATES.map((gate, i) => (1 - state.openness[i]) * Math.exp(-Math.pow((x - gate) / 62, 2))),
  );
  return 46 * (1 - constriction);
}

export function advanceFlow(state, delta) {
  const dt = Number.isFinite(delta) ? Math.max(0, Math.min(delta, 0.05)) : 0;
  if (!dt) return;
  state.time += dt;
  // One calm reveal, roughly 7.5 seconds end to end. No oscillating loading bars.
  state.progress = Math.min(state.target, state.progress + dt / 7.5);
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
        point.passed[g] = true;
      }
    }
  }
  for (const point of state.points) {
    if (point.queue >= 0) continue;
    const previous = point.x;
    point.x += point.speed * dt;
    for (let g = 0; g < GATES.length; g++) {
      if (!point.passed[g] && previous <= GATES[g] && point.x >= GATES[g] - 52) {
        if (state.openness[g] < 0.98) {
          point.x = Math.min(point.x, GATES[g] - 52);
          point.queue = g;
          state.queues[g].push(point);
          break;
        }
        point.passed[g] = true;
      }
    }
    if (point.x > 985) {
      point.x = 10;
      point.passed = GATES.map(() => false);
    }
  }
  for (let g = 0; g < GATES.length; g++) {
    state.queues[g].forEach((point, rank) => {
      const targetX = Math.max(7, GATES[g] - 52 - Math.floor(rank / 8) * 6);
      point.x += (targetX - point.x) * Math.min(1, dt * 6);
    });
  }
  for (const point of state.points) {
    let targetY = 140 + point.lane * (channelHalf(state, point.x) / 46);
    if (point.queue >= 0) {
      const rank = state.queues[point.queue].indexOf(point);
      targetY = 140 + ((rank % 8) - 3.5) * 5.5;
    }
    point.y += (targetY - point.y) * Math.min(1, dt * 8);
  }
}

export function sampleFlow(state) {
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

export function scrollProgress(top, viewportHeight) {
  if (!Number.isFinite(top) || !Number.isFinite(viewportHeight) || viewportHeight <= 0) return 0;
  return clamp((viewportHeight * 0.85 - top) / (viewportHeight * 0.45));
}

export function canAnimate({ reduced, paused, hidden, visible }) {
  return !reduced && !paused && !hidden && visible;
}
