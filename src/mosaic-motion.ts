import type { AgentAction, AgentName, AgentPose } from "./factory-agent-motion";

export const mosaicPitch = 36.4;
export const mosaicSize = 28;
export const mosaicU = { x: 1, y: 0.06 };
export const mosaicV = { x: -0.4, y: 0.5 };
export const mosaicMatrix = `matrix(${mosaicU.x} ${mosaicU.y} ${mosaicV.x} ${mosaicV.y} 0 0)`;
export function mosaicSidePath(size: number, thickness = 3) {
  const u = { x: size * mosaicU.x, y: size * mosaicU.y };
  const v = { x: size * mosaicV.x, y: size * mosaicV.y };
  return `M${v.x} ${v.y}L${u.x + v.x} ${u.y + v.y}L${u.x} ${u.y}V${u.y + thickness}L${u.x + v.x} ${u.y + v.y + thickness}L${v.x} ${v.y + thickness}Z`;
}
export type MosaicPoint = { x: number; y: number };
export type MosaicVisit = ReturnType<typeof createMosaicVisit>;
export type MosaicLayout = "wings" | "floor";
export function mosaicPoint(
  column: number,
  row: number,
  layout: MosaicLayout = "wings",
): MosaicPoint {
  return {
    x: 800 + mosaicPitch * (column * mosaicU.x + row * mosaicV.x),
    y: (layout === "floor" ? 170 : 470) + mosaicPitch * (column * mosaicU.y + row * mosaicV.y),
  };
}

/** One seeded story per mount; no random choices are made while it plays. */
export function mosaicRandom(seed: number, index: number) {
  let value = (seed + Math.imul(index + 1, 0x9e3779b9)) | 0;
  value = Math.imul(value ^ (value >>> 16), 0x21f0aaad);
  value = Math.imul(value ^ (value >>> 15), 0x735a2d97);
  return ((value ^ (value >>> 15)) >>> 0) / 4294967296;
}
export function createMosaicVisit(seed: number) {
  return {
    seed,
    carrier: (mosaicRandom(seed, 0) < 0.5 ? "codex" : "claude") as AgentName,
    duration: 32 + mosaicRandom(seed, 1) * 6,
    inspectionDuration: 35 + mosaicRandom(seed, 2) * 7,
    inspectionOffset: mosaicRandom(seed, 3) * 11,
    helperStart: 28 + mosaicRandom(seed, 4) * 16,
    helperPeriod: 185 + mosaicRandom(seed, 5) * 22,
    leadIn: mosaicRandom(seed, 6) * 4,
  };
}
export const mosaicBuildCells = Array.from({ length: 8 }, (_, i) => [4 - i, 3] as const);
export const mosaicSourceCells = [
  [-6, 5],
  [-7, 6],
  [-8, 5],
  [-9, 7],
  [-10, 6],
  [-11, 8],
  [-12, 7],
  [-13, 9],
] as const;
export const mosaicFloorBuildCells = Array.from({ length: 8 }, (_, i) => [8 - i, 4] as const);
export const mosaicFloorSourceCells = [
  [-7, 5],
  [-8, 6],
  [-9, 5],
  [-10, 7],
  [-12, 6],
  [-13, 7],
  [-14, 5],
  [-14, 7],
] as const;
export function mosaicWorkLayout(layout: MosaicLayout) {
  return layout === "floor"
    ? {
        build: mosaicFloorBuildCells,
        source: mosaicFloorSourceCells,
        inspectionRow: 0,
        inspectionColumns: [6, 8, 10, 12, 14],
      }
    : {
        build: mosaicBuildCells,
        source: mosaicSourceCells,
        inspectionRow: -5,
        inspectionColumns: [8, 10, 13, 15, 17],
      };
}
const mix = (a: MosaicPoint, b: MosaicPoint, t: number): MosaicPoint => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});
const clamp = (t: number) => Math.max(0, Math.min(1, t));
const ease = (t: number) => {
  const n = clamp(t);
  return n * n * (3 - 2 * n);
};
type Stop = { at: number; point: MosaicPoint; action: AgentAction; facing?: number };
function follow(stops: Stop[], t: number, duration: number): AgentPose {
  const index = Math.max(
    0,
    stops.findIndex((s, i) => i < stops.length - 1 && t >= s.at && t < stops[i + 1].at),
  );
  const from = stops[index],
    to = stops[index + 1];
  return {
    ...mix(from.point, to.point, ease((t - from.at) / (to.at - from.at))),
    floor: 0,
    action: from.action,
    phase: (t - from.at) * duration,
    facing: from.facing ?? (Math.sign(to.point.x - from.point.x) || 1),
    opacity: 1,
  };
}

/** Once installed, a tile stays installed. After the finite build, the crew maintains it. */
export function mosaicSceneFrame(
  seconds: number,
  visit: MosaicVisit,
  complete = false,
  figureScale = 1.35,
  layout: MosaicLayout = "wings",
) {
  const floor = layout === "floor";
  const { build: buildCells, source: sourceCells, inspectionColumns } = mosaicWorkLayout(layout);
  const point = (column: number, row: number) => mosaicPoint(column, row, layout);
  const time = Math.max(0, seconds) + visit.leadIn;
  const cycle = Math.floor(time / visit.duration);
  const t = (time % visit.duration) / visit.duration;
  const building = !complete && cycle < buildCells.length;
  const cell = buildCells[Math.min(cycle, buildCells.length - 1)];
  const slot = point(cell[0], cell[1]);
  const start = point(-6, floor ? 8.4 : 6.4);
  const finish = point(cell[0], floor ? 5.4 : 4.4);
  const inspect = point(cell[0] + 1.2, floor ? 5.4 : 4.4);
  const source = sourceCells[Math.min(cycle, sourceCells.length - 1)];
  const pickup = point(source[0], source[1] + 1.1);
  const maintenanceHome = point(floor ? 5 : 2, floor ? 5.4 : 4.4);
  const maintenanceTarget = point(
    (floor ? [2, 7, 3, 6] : [1, 4, 0, 3])[(cycle + visit.seed) % 4],
    floor ? 5.4 : 4.4,
  );
  const pose =
    cycle < buildCells.length
      ? follow(
          [
            { at: 0, point: start, action: "idle", facing: 1 },
            { at: 0.04, point: start, action: "walk" },
            { at: 0.16, point: pickup, action: "work", facing: 1 },
            { at: 0.23, point: pickup, action: "walk" },
            { at: 0.5, point: finish, action: "work", facing: 1 },
            { at: 0.59, point: finish, action: "walk" },
            { at: 0.66, point: inspect, action: "work", facing: -1 },
            { at: 0.73, point: inspect, action: "walk" },
            { at: 0.98, point: start, action: "idle", facing: 1 },
            { at: 1, point: start, action: "idle", facing: 1 },
          ],
          t,
          visit.duration,
        )
      : follow(
          [
            {
              at: 0,
              point: cycle === buildCells.length ? start : maintenanceHome,
              action: "walk",
            },
            { at: 0.4, point: maintenanceTarget, action: "work", facing: -1 },
            { at: 0.75, point: maintenanceTarget, action: "walk" },
            { at: 0.97, point: maintenanceHome, action: "idle" },
            { at: 1, point: maintenanceHome, action: "idle" },
          ],
          t,
          visit.duration,
        );
  const pile = point(source[0], source[1]);
  const hand = { x: pose.x + (25 * figureScale) / 1.35, y: pose.y - (27 * figureScale) / 1.35 };
  const place = ease((t - 0.5) / 0.09);
  const tile =
    !building || t >= 0.59
      ? null
      : {
          point:
            t < 0.16
              ? pile
              : t < 0.23
                ? mix(pile, hand, ease((t - 0.16) / 0.07))
                : t < 0.5
                  ? hand
                  : mix(hand, slot, place),
          organised: place,
        };
  const installed = complete
    ? buildCells.length
    : Math.min(buildCells.length, cycle + (t >= 0.59 ? 1 : 0));
  const remainingSourceStart = complete
    ? sourceCells.length
    : Math.min(cycle + 1, sourceCells.length);
  const inspectionTime = time + visit.inspectionOffset;
  const it = (inspectionTime % visit.inspectionDuration) / visit.inspectionDuration;
  const inspectionCycle = Math.floor(inspectionTime / visit.inspectionDuration);
  const targetColumn = inspectionColumns[(inspectionCycle + (visit.seed % 5)) % 5];
  const home = point(11, floor ? -0.6 : -5.6);
  const target = point(targetColumn, floor ? -0.4 : -5.4);
  const reviewer = follow(
    [
      { at: 0, point: home, action: "idle" },
      { at: 0.17, point: home, action: "walk" },
      { at: 0.4, point: target, action: "work", facing: -1 },
      { at: 0.7, point: target, action: "walk" },
      { at: 0.94, point: home, action: "idle" },
      { at: 1, point: home, action: "idle" },
    ],
    it,
    visit.inspectionDuration,
  );
  const other: AgentName = visit.carrier === "codex" ? "claude" : "codex";
  const workers: { id: string; name: AgentName; pose: AgentPose }[] = [
    { id: "carrier", name: visit.carrier, pose },
    { id: "reviewer", name: other, pose: reviewer },
  ];
  // Helpers reset only outside the SVG clip. They never dissolve into the work surface.
  if (!complete) {
    const local = time % visit.helperPeriod;
    for (const [index, begin, duration, edge, work] of [
      [0, visit.helperStart, 38, { x: -110, y: floor ? 300 : 640 }, point(-15, floor ? 6 : 8.6)],
      [
        1,
        visit.helperStart + 28,
        41,
        { x: 1710, y: floor ? 230 : 300 },
        point(floor ? 16 : 15, floor ? 2 : -7),
      ],
    ] as const) {
      const elapsed = local - begin;
      if (elapsed < 0 || elapsed >= duration) continue;
      const helper = follow(
        [
          { at: 0, point: edge, action: "walk" },
          { at: 0.26, point: work, action: "work", facing: index === 0 ? 1 : -1 },
          { at: 0.68, point: work, action: "walk" },
          { at: 1, point: edge, action: "idle" },
        ],
        elapsed / duration,
        duration,
      );
      workers.push({
        id: `helper-${index}`,
        name: index === 0 ? other : visit.carrier,
        pose: helper,
      });
    }
  }
  return {
    tile,
    installed,
    remainingSourceStart,
    workers,
    inspecting: it >= 0.4 && it < 0.7 ? targetColumn : null,
  };
}
