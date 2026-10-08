import test from "node:test";
import assert from "node:assert/strict";
import { createHeroVideo } from "./web/hero-video.js";

function fixture() {
  const classes = new Set();
  const listeners = {};
  const video = {
    paused: true,
    src: "",
    error: null,
    loads: [],
    plays: 0,
    classList: { add: (name) => classes.add(name), remove: (name) => classes.delete(name) },
    addEventListener: (name, callback) => (listeners[name] = callback),
    removeAttribute: () => (video.src = ""),
    load: () => video.loads.push(video.src),
    pause: () => (video.paused = true),
    play: () => {
      video.plays++;
      video.paused = false;
      return Promise.resolve();
    },
  };
  return {
    video,
    classes,
    listeners,
    controller: createHeroVideo(video, { day: "day.mp4", night: "night.mp4" }),
  };
}
const settle = () => new Promise((resolve) => setImmediate(resolve));

test("no download offscreen, reduced or data-saving; only selected scene loads", () => {
  for (const flag of [{ visible: false }, { reduced: true }, { saveData: true }]) {
    const { controller, video } = fixture();
    controller.update({ scene: "day", visible: true, ...flag });
    assert.deepEqual(video.loads, []);
  }
  const { controller, video } = fixture();
  controller.update({ scene: "night", visible: true });
  assert.deepEqual(video.loads, ["night.mp4"]);
  assert.equal(video.muted, true);
});

test("pause, document hide and offscreen halt playback; resume reuses loaded source", async () => {
  for (const flags of [
    ["paused", true, false],
    ["hidden", true, false],
    ["visible", false, true],
  ]) {
    const { controller, video } = fixture();
    controller.update({ scene: "day", visible: true });
    await settle();
    controller.update({ [flags[0]]: flags[1] });
    assert.equal(video.paused, true);
    controller.update({ [flags[0]]: flags[2] });
    assert.equal(video.paused, false);
    assert.deepEqual(video.loads, ["day.mp4"]);
  }
});

test("theme change clears old visible frame, then loads only the new scene", async () => {
  const { controller, video, listeners, classes } = fixture();
  controller.update({ scene: "day", visible: true });
  await settle();
  listeners.playing();
  assert.ok(classes.has("is-ready"));
  controller.update({ scene: "night" });
  assert.ok(!classes.has("is-ready"));
  assert.deepEqual(video.loads, ["day.mp4", "", "night.mp4"]);
  listeners.playing();
  assert.ok(classes.has("is-ready"));
  controller.update({ reduced: true });
  assert.equal(video.src, "");
  assert.ok(!classes.has("is-ready"));
});

test("unavailable/autoplay-denied media falls back without repeated load attempts", async () => {
  const { controller, video, classes } = fixture();
  video.play = () => Promise.reject(new Error("not allowed"));
  controller.update({ scene: "day", visible: true });
  await settle();
  assert.equal(video.src, "");
  controller.update({ visible: true });
  assert.deepEqual(video.loads, ["day.mp4", ""]);
  assert.ok(!classes.has("is-ready"));
});

test("stale play rejection cannot remove a newly selected scene", async () => {
  const { controller, video } = fixture();
  let rejectOld;
  video.play = () => new Promise((_, reject) => (rejectOld = reject));
  controller.update({ scene: "day", visible: true });
  video.play = () => Promise.resolve();
  controller.update({ scene: "night" });
  rejectOld(new Error("aborted previous source"));
  await settle();
  assert.equal(video.src, "night.mp4");
});

test("a decode/network error hides the frame and stops retrying the failed scene", async () => {
  const { controller, video, listeners, classes } = fixture();
  controller.update({ scene: "day", visible: true });
  await settle();
  listeners.playing();
  video.error = { code: 3 };
  listeners.error();
  assert.equal(video.src, "");
  assert.equal(video.paused, true);
  assert.ok(!classes.has("is-ready"));
  controller.update({ visible: true });
  assert.deepEqual(video.loads, ["day.mp4", ""]);
});

test("unknown scenes and late playing events cannot start unwanted media", () => {
  const { controller, video, listeners, classes } = fixture();
  controller.update({ scene: "missing", visible: true });
  assert.deepEqual(video.loads, []);
  controller.update({ scene: "day", visible: true });
  controller.update({ paused: true });
  listeners.playing();
  assert.equal(video.paused, true);
  assert.ok(!classes.has("is-ready"));
});
