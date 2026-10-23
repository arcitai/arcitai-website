type Point = readonly [number, number];

const toward = (point: Point, centre: Point): Point => [
  point[0] + (centre[0] - point[0]) * 0.03,
  point[1] + (centre[1] - point[1]) * 0.03,
];

/** Finish follows the existing prism. No filters, shared SVG IDs or moving geometry. */
export function PrismFinish({
  left,
  back,
  right,
  front,
  depth,
  rimOnly = false,
  faces = "both",
}: {
  left: Point;
  back: Point;
  right: Point;
  front: Point;
  depth: number;
  rimOnly?: boolean;
  faces?: "both" | "side";
}) {
  const centre: Point = [(left[0] + right[0]) / 2, (back[1] + front[1]) / 2];
  const [l, b, r] = [left, back, right].map((point) => toward(point, centre));
  const lip = Math.min(2.5, depth * 0.12);
  const shade = Math.min(9, depth * 0.32);
  const band = (a: Point, z: Point, y0: number, y1: number) =>
    `M${a[0]} ${a[1] + y0}L${z[0]} ${z[1] + y0}L${z[0]} ${z[1] + y1}L${a[0]} ${a[1] + y1}Z`;
  return (
    <g className="arc-mat" aria-hidden="true">
      <path className="arc-mat-rim" d={`M${l[0]} ${l[1]}L${b[0]} ${b[1]}L${r[0]} ${r[1]}`} />
      {!rimOnly && (
        <>
          {faces === "both" && (
            <>
              <path className="arc-mat-lip" d={band(left, front, 0, lip)} />
              <path className="arc-mat-shade" d={band(left, front, depth - shade, depth)} />
            </>
          )}
          <path className="arc-mat-lip is-side" d={band(front, right, 0, lip)} />
          <path className="arc-mat-shade is-side" d={band(front, right, depth - shade, depth)} />
        </>
      )}
    </g>
  );
}
