import { assert, test } from "vitest";
import {
  PARTICLE_COUNT,
  GATES,
  createFlow,
  advanceFlow,
  sampleFlow,
  setFlowProgress,
  scrollProgress,
  canAnimate,
} from "./factory-motion";

test("all squares start at the left, all stages closed, with no work leaking past the first gate", () => {
  const state = createFlow();
  assert.deepEqual(state.openness, [0, 0, 0, 0]);
  assert.ok(state.points.every((p) => p.x < 75));
  assert.equal(new Set(state.points.map((p) => `${p.x},${p.y}`)).size, PARTICLE_COUNT);
  for (let n = 0; n < 3600; n++) advanceFlow(state, 1 / 60);
  assert.equal(state.queues[0].length, PARTICLE_COUNT);
  assert.ok(state.points.every((p) => p.x < GATES[0]));
  assert.ok(state.queues.slice(1).every((queue) => queue.length === 0));
  assert.deepEqual(sampleFlow(state).bars, [0, 0, 0, 0]);
});

test("the inlet starts off-canvas and admits a small stream, not a rectangle", () => {
  const state = createFlow();
  assert.ok(state.points.every((p) => p.x < 0));
  for (let tick = 0; tick < 120; tick++) advanceFlow(state, 1 / 60);
  const visible = state.points.filter((p) => p.x >= 0);
  assert.ok(visible.length >= 3 && visible.length <= 10);
  assert.ok(visible.every((p) => p.x < GATES[0]));
});

test("scrolling back closes an opened flow instead of retaining a permanent latch", () => {
  const state = createFlow(1);
  setFlowProgress(state, 0);
  assert.equal(state.target, 0);
  for (let tick = 0; tick < 180; tick++) advanceFlow(state, 1 / 60);
  assert.deepEqual(sampleFlow(state).bars, [0, 0, 0, 0]);
});

test("bars open sequentially, stay at a fixed target, and reverse when that target changes", () => {
  const state = createFlow();
  setFlowProgress(state, 1);
  let before = sampleFlow(state).bars;
  for (let tick = 0; tick < 1800; tick++) {
    advanceFlow(state, 1 / 60);
    const bars = sampleFlow(state).bars;
    bars.forEach((value, i) => {
      assert.ok(value >= before[i]);
      if (i && value > 0) assert.equal(bars[i - 1], 1);
    });
    before = bars;
  }
  assert.deepEqual(before, [1, 1, 1, 1]);
  setFlowProgress(state, 0);
  assert.equal(state.target, 0);
  for (let tick = 0; tick < 180; tick++) advanceFlow(state, 1 / 60);
  assert.deepEqual(sampleFlow(state).bars, [0, 0, 0, 0]);
});

test("the same particles drain through all opened gates and remain bounded", () => {
  const state = createFlow();
  const points = state.points;
  setFlowProgress(state, 1);
  for (let tick = 0; tick < 6000; tick++) {
    advanceFlow(state, 1 / 60);
    if (tick % 60) continue;
    assert.equal(state.points.length, PARTICLE_COUNT);
    const queued = state.queues.flat();
    assert.equal(queued.length, new Set(queued).size);
    for (const point of state.points)
      assert.ok(point.x >= -1800 && point.x <= 1008 && point.y >= 90 && point.y <= 190);
    assert.ok(!sampleFlow(state).rails.includes("NaN"));
  }
  assert.equal(state.points, points);
  assert.equal(state.queues.flat().length, 0);
});

test("partial reveal opens exactly the matching gates without allowing closed queues to leak", () => {
  const state = createFlow();
  setFlowProgress(state, 0.5, true);
  assert.deepEqual(state.openness, [1, 1, 0, 0]);
  for (let tick = 0; tick < 4800; tick++) advanceFlow(state, 1 / 60);
  assert.equal(state.queues[2].length, PARTICLE_COUNT);
  assert.ok(state.points.every((p) => p.x < GATES[2]));
  assert.equal(GATES.length, sampleFlow(state).bars.length);
});

test("reduced motion renders the completed state without advancing time", () => {
  const state = createFlow();
  const time = state.time;
  setFlowProgress(state, 1, true);
  assert.deepEqual(sampleFlow(state).bars, [1, 1, 1, 1]);
  assert.equal(state.time, time);
  for (const invalid of [NaN, -1, 0]) advanceFlow(state, invalid);
  assert.equal(state.time, time);
});

test("scroll range reveals the workflow while on screen with bounded inputs", () => {
  assert.equal(scrollProgress(1000, 1000), 0);
  assert.equal(scrollProgress(550, 1000), 0);
  assert.equal(scrollProgress(425, 1000), 0.5);
  assert.equal(scrollProgress(300, 1000), 1);
  assert.equal(scrollProgress(-200, 1000), 1);
  assert.equal(scrollProgress(NaN, 1000), 0);
  assert.equal(scrollProgress(100, 0), 0);
});

test("the continuous pipe squeezes closed at every low bar and straightens when full", () => {
  const state = createFlow();
  const closed = sampleFlow(state).rails;
  GATES.forEach((x) => assert.ok(closed.includes(`L${x} 140`)));
  setFlowProgress(state, 1, true);
  const open = sampleFlow(state).rails;
  GATES.forEach((x) => {
    assert.ok(open.includes(`L${x} 94`));
    assert.ok(open.includes(`L${x} 186`));
  });
});

test("offscreen, paused, hidden and reduced states stop motion", () => {
  const state = { reduced: false, paused: false, hidden: false, visible: true };
  assert.equal(canAnimate(state), true);
  for (const flag of ["reduced", "paused", "hidden"])
    assert.equal(canAnimate({ ...state, [flag]: true }), false);
  assert.equal(canAnimate({ ...state, visible: false }), false);
});
