// Deterministic illustration, not telemetry or a throughput estimate.
export const PARTICLE_COUNT = 48;

const routes = {
  connected: [
    [0, 16],
    [2.6, 466],
    [3, 478],
    [4.1, 666],
    [4.5, 678],
    [5.6, 866],
    [6.1, 878],
    [6.8, 984],
  ],
  disconnected: [
    [0, 16],
    [2.6, 430],
    [6.8, 478],
    [8, 644],
    [11.6, 678],
    [12.8, 866],
    [13.3, 878],
    [14, 984],
  ],
};

export function flowFrame(seconds, mode = "connected") {
  const route = routes[mode] ?? routes.connected;
  const duration = route.at(-1)[0];
  const time = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  const points = Array.from({ length: PARTICLE_COUNT }, (_, id) => {
    const phase = (time + (id / PARTICLE_COUNT) * duration) % duration;
    const next = route.findIndex(([end]) => end > phase);
    const [startTime, startX] = route[next - 1];
    const [endTime, endX] = route[next];
    const x = startX + ((phase - startTime) / (endTime - startTime)) * (endX - startX);
    const lane = ((id * 17) % 9) - 4;
    const distance = Math.min(Math.abs(x - 490), Math.abs(x - 690));
    const spread = mode === "disconnected" ? Math.min(1, Math.max(0.15, distance / 78)) : 1;
    return { x, y: 90 + lane * 8 * spread, size: id % 4 === 0 ? 6 : 4 };
  });
  const bars = Array.from({ length: 5 }, (_, stage) => {
    const pace = mode === "disconnected" && (stage === 2 || stage === 3) ? 0.12 : 0.3;
    return 0.12 + ((time * pace + stage * 0.19) % 1) * 0.88;
  });
  return { points, bars };
}

export function flowRails(mode) {
  return mode === "disconnected"
    ? "M12 38H408L478 78H502L572 38H608L678 78H702L772 38H988M12 142H408L478 102H502L572 142H608L678 102H702L772 142H988"
    : "M12 38H988M12 142H988";
}

export function canAnimate({ reduced, paused, hidden, visible }) {
  return !reduced && !paused && !hidden && visible;
}
