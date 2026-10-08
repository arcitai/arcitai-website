// Run explicitly with node --test; keep this preview out of Vitest discovery.
import test from "node:test";
import assert from "node:assert/strict";
import { PARTICLE_COUNT, flowFrame, flowRails, canAnimate } from "./web/motion-model.js";

test("deterministic illustration stays inside its viewBox", () => {
  for (const mode of ["connected", "disconnected"]) {
    for (const time of [0, 0.016, 4.2, 10, 9999, NaN, -1]) {
      const frame = flowFrame(time, mode);
      assert.equal(frame.points.length, PARTICLE_COUNT);
      for (const { x, y, size } of frame.points) {
        assert.ok(x > 0 && x < 1000 && y > 0 && y < 180);
        assert.ok(size === 4 || size === 6);
      }
      assert.ok(frame.bars.every((value) => value >= 0.12 && value <= 1));
      assert.deepEqual(frame, flowFrame(time, mode));
    }
  }
});
test("time advances both particles and illustrative loading bars", () => {
  assert.notDeepEqual(flowFrame(1), flowFrame(2));
});
test("comparison changes the queues without removing review stages", () => {
  const queue = (mode) =>
    flowFrame(4.2, mode).points.filter((p) => (p.x > 430 && p.x < 490) || (p.x > 644 && p.x < 690))
      .length;
  assert.ok(queue("disconnected") > queue("connected"));
  assert.notEqual(flowRails("connected"), flowRails("disconnected"));
});
test("all motion gates must allow playback", () => {
  const state = { reduced: false, paused: false, hidden: false, visible: true };
  assert.equal(canAnimate(state), true);
  for (const flag of ["reduced", "paused", "hidden"]) {
    assert.equal(canAnimate({ ...state, [flag]: true }), false);
  }
  assert.equal(canAnimate({ ...state, visible: false }), false);
});
