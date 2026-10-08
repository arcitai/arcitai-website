// Run explicitly with node --test; keep this preview out of Vitest discovery.
import test from "node:test";
import assert from "node:assert/strict";
import {
  PARTICLE_COUNT,
  createFlow,
  advanceFlow,
  sampleFlow,
  setFlowTarget,
  canAnimate,
} from "./web/motion-model.js";
test("the transferred field remains deterministic and bounded over repeated laps", () => {
  for (const target of [0, 1, 2]) {
    const state = createFlow(target);
    assert.deepEqual(state, createFlow(target));
    for (let tick = 0; tick < 6000; tick++) {
      advanceFlow(state, 1 / 60);
      if (tick % 60) continue;
      const result = sampleFlow(state);
      assert.equal(result.points.length, PARTICLE_COUNT);
      for (const { x, y } of result.points) assert.ok(x >= 0 && x <= 1000 && y >= 0 && y <= 220);
      assert.ok(result.bars.every((v) => v >= 0.16 && v <= 0.92));
      assert.ok(!result.rails.includes("NaN"));
      for (const queue of state.queues) assert.equal(queue.length, new Set(queue).size);
    }
  }
});
test("interaction opens the same queues without replacing the particles", () => {
  const state = createFlow();
  const points = state.points;
  const queued = state.queues.flat().length;
  assert.ok(queued > 0);
  setFlowTarget(state, 2);
  advanceFlow(state, 1 / 60);
  assert.ok(state.openness[0] > 0 && state.openness[0] < 1);
  for (let n = 0; n < 1800; n++) advanceFlow(state, 1 / 60);
  assert.equal(points, state.points);
  assert.ok(state.queues.flat().length < queued);
});
test("particle travel is slow and loading bars never abruptly reset", () => {
  const state = createFlow(2);
  const point = state.points.find((p) => p.x < 300);
  const x = point.x;
  const before = sampleFlow(state).bars;
  advanceFlow(state, 1 / 60);
  assert.ok(point.x - x < 0.8);
  sampleFlow(state).bars.forEach((v, i) => assert.ok(Math.abs(v - before[i]) < 0.004));
});
test("reduced motion updates openings without advancing the simulation", () => {
  const state = createFlow();
  const before = sampleFlow(state);
  const time = state.time;
  setFlowTarget(state, 1, true);
  assert.deepEqual(state.openness, [1, 0]);
  assert.notEqual(sampleFlow(state).rails, before.rails);
  for (const dt of [NaN, -1, 0]) advanceFlow(state, dt);
  assert.equal(state.time, time);
});
test("offscreen, paused, hidden and reduced states all stop motion", () => {
  const state = { reduced: false, paused: false, hidden: false, visible: true };
  assert.equal(canAnimate(state), true);
  for (const flag of ["reduced", "paused", "hidden"])
    assert.equal(canAnimate({ ...state, [flag]: true }), false);
  assert.equal(canAnimate({ ...state, visible: false }), false);
});
