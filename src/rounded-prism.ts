export type PrismPoint = readonly [number, number];

const between = (a: PrismPoint, b: PrismPoint, t: number): PrismPoint => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
];
const point = (p: PrismPoint, dy = 0) => `${p[0].toFixed(3)} ${(+p[1] + dy).toFixed(3)}`;

/** The same rounded, extruded tile at any size and projection. B, R, F, L clockwise. */
export function roundedPrism(
  back: PrismPoint,
  right: PrismPoint,
  front: PrismPoint,
  left: PrismPoint,
  depth: number,
  radius = 0.082,
) {
  const corners = [back, right, front, left];
  const t = Math.max(0, Math.min(0.25, radius));
  const curves = corners.map((corner, i) => {
    const incoming = between(corner, corners[(i + 3) % 4], t);
    const outgoing = between(corner, corners[(i + 1) % 4], t);
    const first = between(incoming, corner, 0.5);
    const second = between(corner, outgoing, 0.5);
    return { corner, incoming, outgoing, first, second, middle: between(first, second, 0.5) };
  });
  const top = `M${point(curves[0].incoming)}${curves
    .map((c, i) => `${i ? `L${point(c.incoming)}` : ""}Q${point(c.corner)} ${point(c.outgoing)}`)
    .join("")}Z`;
  const side = (a: number, b: number, low = 0, high = depth) => {
    const from = curves[a];
    const to = curves[b];
    return `M${point(from.middle, low)}Q${point(from.second, low)} ${point(from.outgoing, low)}L${point(to.incoming, low)}Q${point(to.first, low)} ${point(to.middle, low)}L${point(to.middle, high)}Q${point(to.first, high)} ${point(to.incoming, high)}L${point(from.outgoing, high)}Q${point(from.second, high)} ${point(from.middle, high)}Z`;
  };
  // The visible halves meet at the exact midpoint of the rounded front corner.
  const face = side(2, 3);
  const rightFace = side(1, 2);
  const l = curves[3];
  const b = curves[0];
  const r = curves[1];
  const rim = `M${point(l.middle)}Q${point(l.second)} ${point(l.outgoing)}L${point(b.incoming)}Q${point(b.corner)} ${point(b.outgoing)}L${point(r.incoming)}Q${point(r.first)} ${point(r.middle)}`;
  return {
    top,
    face,
    side: rightFace,
    rim,
    lip: `${side(2, 3, 0, depth * 0.12)}${side(1, 2, 0, depth * 0.12)}`,
    shade: `${side(2, 3, depth * 0.76, depth)}${side(1, 2, depth * 0.76, depth)}`,
  };
}
