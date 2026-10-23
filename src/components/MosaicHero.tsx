import {
  memo,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { CodexWorker, ClaudeWorker } from "./FactoryAgents";
import {
  createMosaicVisit,
  mosaicBuildCells,
  mosaicMatrix,
  mosaicPoint,
  mosaicPitch,
  mosaicRandom,
  mosaicSceneFrame,
  mosaicSize,
  mosaicSidePath,
  mosaicSourceCells,
  mosaicWorkLayout,
} from "../mosaic-motion";
import {
  mosaicCompactWidth,
  mosaicFloorCells,
  mosaicFloorMarks,
  mosaicMarkSize,
  mosaicVariantId,
  mosaicVariants,
  type MosaicVariant,
} from "../mosaic-variants";
import { compositions, compositionHref } from "../mosaic-story";
import { localReview } from "../family/preview";
import "./arc-material.css";
import "./mosaic-hero.css";

const marks = [
  { column: -9, row: 6, span: 1, name: "Slack", asset: "/assets/factory-tools/slack.png" },
  {
    column: -1,
    row: 2,
    span: 1,
    name: "Databricks",
    asset: "/assets/factory-tools/databricks.svg",
  },
  { column: 9, row: -2, span: 1, name: "Azure", asset: "/assets/factory-tools/azure.svg" },
  { column: 12, row: -3, span: 3, name: "Arc’IT", asset: "/assets/arcitai-mark-final.svg" },
];

function Tile({
  size = mosaicSize,
  tone = "orange",
  level = 3,
  children,
  organised,
}: {
  size?: number;
  tone?: string;
  level?: number;
  children?: ReactNode;
  organised?: number;
}) {
  return (
    <g
      className={`mosaic-tile tone-${tone} level-${level}`}
      style={
        organised === undefined
          ? undefined
          : ({
              "--tile-color": `color-mix(in srgb, var(--mosaic-carry-from, var(--mosaic-orange-3)) ${(1 - organised) * 100}%, var(--mosaic-blue-4))`,
            } as CSSProperties)
      }
    >
      <path className="mosaic-tile-side" d={mosaicSidePath(size)} />
      <g transform={mosaicMatrix}>
        <rect className="mosaic-tile-top" width={size} height={size} rx="2.3" />
        <path className="arc-mat mosaic-tile-rim" d={`M2 ${size - 2}V2H${size - 2}`} />
        {children}
      </g>
    </g>
  );
}

const MosaicGrid = memo(function MosaicGrid({ seed }: { seed: number }) {
  const id = useId();
  const tiles = [],
    tops = [];
  const cells = [];
  for (let row = -14; row <= 12; row++) {
    for (let column = -22; column <= 22; column++) {
      const point = mosaicPoint(column, row);
      const main =
        row >= -2 &&
        column >= -17 &&
        column <= 19 &&
        ((point.x - 800) / 760) ** 2 + ((point.y - 565) / 195) ** 2 < 1;
      const wing = row < -3 && ((column >= -20 && column <= -11) || (column >= 8 && column <= 20));
      const inspectionTarget = row === -5 && [8, 10, 13, 15, 17].includes(column);
      const quiet = ((point.x - 800) / 430) ** 2 + ((point.y - 250) / 215) ** 2 < 1;
      const random = mosaicRandom(seed, (row + 14) * 48 + column + 22);
      if ((!main && !wing) || quiet || (wing && random > 0.3 && !inspectionTarget)) continue;
      if (main && random > (column < -4 ? 0.62 : 0.92)) continue;
      cells.push({ column, row, point, random });
    }
  }
  cells.sort((a, b) => a.point.y - b.point.y);
  for (const { column, row, point, random } of cells) {
    if (
      marks.some(
        (mark) =>
          column >= mark.column &&
          column < mark.column + mark.span &&
          row >= mark.row &&
          row < mark.row + mark.span,
      )
    )
      continue;
    if (mosaicBuildCells.some(([c, r]) => c === column && r === row)) continue;
    if (mosaicSourceCells.some(([c, r]) => c === column && r === row)) continue;
    const progress = Math.max(0, Math.min(1, (0.6 * column - 0.8 * row + 6) / 18));
    const disorder = progress < 0.5 ? (1 - progress) ** 1.5 : 0;
    const transform = `translate(${point.x + (random * 26 - 13) * disorder} ${point.y + (random * 20 - 6) * disorder}) rotate(${(random * 16 - 8) * disorder})`;
    const tone = progress > 0.6 || (progress >= 0.45 && random > 0.5) ? "blue" : "orange";
    tiles.push(
      <g key={`${column}-${row}`} transform={transform}>
        <Tile tone={tone} level={1 + Math.floor(random * 4)} />
      </g>,
    );
    tops.push(
      <rect
        key={`${column}-${row}`}
        transform={`${transform} ${mosaicMatrix}`}
        width={mosaicSize}
        height={mosaicSize}
        rx="2.3"
      />,
    );
  }
  return (
    <g>
      <defs>
        <clipPath id={`${id}-tops`}>{tops}</clipPath>
        <linearGradient id={`${id}-light`}>
          <stop stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".17" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {tiles}
      <g clipPath={`url(#${id}-tops)`}>
        <rect
          className="mosaic-shimmer"
          x="-420"
          y="0"
          width="360"
          height="820"
          fill={`url(#${id}-light)`}
          style={{ animationDelay: `${-mosaicRandom(seed, 301) * 19}s` }}
        />
        <rect
          className="mosaic-shimmer mosaic-shimmer-soft"
          x="-420"
          y="0"
          width="360"
          height="820"
          fill={`url(#${id}-light)`}
        />
      </g>
      {marks.map((mark) => {
        const point = mosaicPoint(mark.column, mark.row);
        const size = mark.span * mosaicPitch - (mosaicPitch - mosaicSize);
        const inset = mark.name === "Arc’IT" ? size * 0.19 : size * 0.15;
        return (
          <g key={mark.name} transform={`translate(${point.x} ${point.y})`}>
            <Tile size={size} tone={mark.name === "Arc’IT" ? "brand" : "paper"}>
              <image
                href={mark.asset}
                x={inset}
                y={inset}
                width={size - inset * 2}
                height={size - inset * 2}
              />
            </Tile>
          </g>
        );
      })}
    </g>
  );
});

const MosaicFloorGrid = memo(function MosaicFloorGrid({
  seed,
  variant,
  largeIcons,
}: {
  seed: number;
  variant: MosaicVariant;
  largeIcons: boolean;
}) {
  const id = useId();
  const cells = mosaicFloorCells(seed, variant);
  const drawings: { key: string; y: number; element: ReactNode }[] = cells.map((cell) => {
    const transform = `translate(${cell.x} ${cell.y}) rotate(${cell.rotation}) scale(${cell.scale})`;
    return {
      key: `${cell.column}-${cell.row}`,
      y: cell.y,
      element: (
        <g transform={transform}>
          <Tile tone={cell.tone} level={cell.level} />
          {cell.stack && (
            <g transform="translate(2 -3)">
              <Tile tone="fragment" level={1} />
            </g>
          )}
        </g>
      ),
    };
  });
  for (const mark of mosaicFloorMarks) {
    const point = mosaicPoint(mark.column, mark.row, "floor");
    const size = mosaicMarkSize(mark.span);
    const brand = mark.name === "Arc’IT";
    const iconSize = brand ? (largeIcons ? 50 : 44) : largeIcons ? 44 : 30;
    drawings.push({
      key: mark.name,
      y: point.y,
      element: (
        <g transform={`translate(${point.x} ${point.y})`}>
          <Tile size={size} tone={brand ? "brand" : "paper"} />
          {/* Upright logos stay recognisable while their tiles follow the shared floor. */}
          <image
            href={mark.asset}
            x={size * 0.3 - iconSize / 2}
            y={size * 0.28 - iconSize / 2}
            width={iconSize}
            height={iconSize}
          />
        </g>
      ),
    });
  }
  return (
    <g>
      <defs>
        <clipPath id={`${id}-tops`}>
          {cells.map((cell) => (
            <rect
              key={`${cell.column}-${cell.row}`}
              transform={`translate(${cell.x} ${cell.y}) rotate(${cell.rotation}) scale(${cell.scale}) ${mosaicMatrix}`}
              width={mosaicSize}
              height={mosaicSize}
              rx="2.3"
            />
          ))}
        </clipPath>
        <linearGradient id={`${id}-light`}>
          <stop stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".12" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {drawings
        .sort((a, b) => a.y - b.y)
        .map(({ key, element }) => (
          <g key={key}>{element}</g>
        ))}
      <g clipPath={`url(#${id}-tops)`}>
        <rect
          className="mosaic-shimmer"
          x="-420"
          y="0"
          width="360"
          height="520"
          fill={`url(#${id}-light)`}
          style={{ animationDelay: `${-mosaicRandom(seed, 301) * 19}s` }}
        />
      </g>
    </g>
  );
});

/** Exact family assets, with a visible-time clock independent of Factory's work cycle. */
export function MosaicHero() {
  const root = useRef<HTMLDivElement>(null);
  const elapsed = useRef(0);
  const [clock, setClock] = useState(0);
  const [paused, setPaused] = useState(false);
  const [complete, setComplete] = useState(false);
  const [figureScale, setFigureScale] = useState(1.35);
  const [compactView, setCompactView] = useState(false);
  const [variantId] = useState(() => mosaicVariantId(window.location.search));
  const variant: MosaicVariant | undefined = mosaicVariants.find((entry) => entry.id === variantId);
  const layout = variantId === "wings" ? "wings" : "floor";
  const work = mosaicWorkLayout(layout);
  const point = (column: number, row: number) => mosaicPoint(column, row, layout);
  const [visit] = useState(() => createMosaicVisit(crypto.getRandomValues(new Uint32Array(1))[0]));
  const id = useId();
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const compact = matchMedia(`(max-width: ${mosaicCompactWidth}px)`);
    const small = matchMedia("(max-width: 700px)");
    const connection = (
      navigator as Navigator & { connection?: EventTarget & { saveData?: boolean } }
    ).connection;
    let visible = false,
      frame = 0,
      last: number | null = null,
      lastPaint = 0;
    const wanted = () =>
      visible && !document.hidden && !paused && !reduced.matches && !connection?.saveData;
    const tick = (now: number) => {
      if (!wanted()) {
        frame = 0;
        last = null;
        return;
      }
      if (last !== null) elapsed.current += Math.min((now - last) / 1000, 0.1);
      last = now;
      if (now - lastPaint >= 1000 / 24) {
        setClock(elapsed.current);
        lastPaint = now;
      }
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      const available = !reduced.matches && !connection?.saveData;
      node.dataset.motionAvailable = String(available);
      node.dataset.running = String(wanted());
      setComplete(!available);
      setFigureScale(small.matches ? 2.1 : 1.35);
      setCompactView(compact.matches);
      if (!wanted()) {
        cancelAnimationFrame(frame);
        frame = 0;
        last = null;
      } else if (!frame) frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.1 },
    );
    observer.observe(node);
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    compact.addEventListener("change", sync);
    small.addEventListener("change", sync);
    connection?.addEventListener("change", sync);
    return () => {
      cancelAnimationFrame(frame);
      node.dataset.running = "false";
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
      compact.removeEventListener("change", sync);
      small.removeEventListener("change", sync);
      connection?.removeEventListener("change", sync);
    };
  }, [paused]);
  const scene = mosaicSceneFrame(clock, visit, complete, figureScale, layout);
  const palette: CSSProperties = { "--mosaic-worker-scale": figureScale } as CSSProperties;
  if (variant) {
    for (let i = 0; i < 4; i++) {
      Object.assign(palette, {
        [`--mosaic-fragment-light-${i + 1}`]: variant.light[i],
        [`--mosaic-fragment-dark-${i + 1}`]: variant.dark[i],
      });
    }
    Object.assign(palette, {
      "--mosaic-carry-from": variant.accent ? "var(--mosaic-accent)" : "var(--mosaic-fragment-3)",
    });
  }
  const sourceTone = variant ? (variant.accent ? "accent" : "fragment") : "orange";
  return (
    <>
      <div ref={root} className="hero-artwork mosaic-scene" data-mosaic={variantId} style={palette}>
        <svg
          className="mosaic-canvas"
          viewBox={
            layout === "floor"
              ? compactView
                ? "160 0 1200 430"
                : "0 0 1600 520"
              : compactView
                ? "260 350 1220 430"
                : "0 0 1600 820"
          }
          preserveAspectRatio={compactView ? "xMidYMid meet" : "xMidYMin slice"}
          aria-hidden="true"
        >
          <defs>
            <clipPath id={`${id}-stage`}>
              <rect x="0" y="0" width="1600" height={layout === "floor" ? 520 : 820} />
            </clipPath>
            <linearGradient id={`${id}-bottom`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="white" />
              <stop offset=".69" stopColor="white" />
              <stop offset=".87" stopColor="black" />
            </linearGradient>
            <mask id={`${id}-floor-mask`}>
              <rect width="1600" height="520" fill={`url(#${id}-bottom)`} />
            </mask>
            <radialGradient id={`${id}-veil`}>
              <stop style={{ stopColor: "var(--paper)" }} stopOpacity=".92" />
              <stop offset=".55" style={{ stopColor: "var(--paper)" }} stopOpacity=".82" />
              <stop offset="1" style={{ stopColor: "var(--paper)" }} stopOpacity="0" />
            </radialGradient>
          </defs>
          <g clipPath={`url(#${id}-stage)`}>
            {variant ? (
              <g mask={`url(#${id}-floor-mask)`}>
                <MosaicFloorGrid
                  seed={visit.seed}
                  variant={variant}
                  largeIcons={figureScale > 1.5}
                />
              </g>
            ) : (
              <MosaicGrid seed={visit.seed} />
            )}
            {work.source.slice(scene.remainingSourceStart).map(([column, row]) => {
              const p = point(column, row);
              return (
                <g key={`${column}-${row}`} transform={`translate(${p.x} ${p.y})`}>
                  <Tile tone={sourceTone} />
                </g>
              );
            })}
            {work.build.map(([column, row], i) => {
              const p = point(column, row);
              return (
                <g key={column} transform={`translate(${p.x} ${p.y})`}>
                  {i < scene.installed ? (
                    <Tile tone="blue" level={4} />
                  ) : (
                    <rect
                      transform={mosaicMatrix}
                      className="mosaic-slot"
                      width={mosaicSize}
                      height={mosaicSize}
                      rx="2"
                    />
                  )}
                </g>
              );
            })}
            {scene.inspecting !== null &&
              (() => {
                const p = point(scene.inspecting, work.inspectionRow);
                return (
                  <rect
                    className="mosaic-inspection"
                    transform={`translate(${p.x} ${p.y}) ${mosaicMatrix}`}
                    width={mosaicSize}
                    height={mosaicSize}
                    rx="2.3"
                  />
                );
              })()}
            {scene.tile && (
              <g transform={`translate(${scene.tile.point.x} ${scene.tile.point.y})`}>
                <Tile organised={scene.tile.organised} />
              </g>
            )}
            {[...scene.workers]
              .sort((a, b) => a.pose.y - b.pose.y)
              .map(({ id: workerId, name, pose }) => (
                <g
                  key={workerId}
                  transform={`translate(${pose.x} ${pose.y})`}
                  style={{ "--factory-top": "var(--mosaic-eye)" } as CSSProperties}
                >
                  <g className="mosaic-worker-figure">
                    <ellipse className="arc-mat mosaic-worker-shadow" cy="1" rx="11" ry="2" />
                    <ellipse className="arc-mat arc-mat-contact-core" cy="1" rx="6.5" ry="1.3" />
                    {name === "codex" ? (
                      <CodexWorker pose={pose} />
                    ) : (
                      <ClaudeWorker
                        pose={pose}
                        clock={clock + (workerId === "carrier" ? 2.1 : 4.3)}
                      />
                    )}
                  </g>
                </g>
              ))}
            {layout === "floor" && (
              <ellipse cx="800" cy="28" rx="600" ry="120" fill={`url(#${id}-veil)`} />
            )}
          </g>
        </svg>
        <button
          className="mosaic-motion-toggle"
          type="button"
          onClick={() => setPaused(!paused)}
          aria-label={paused ? "Play background animation" : "Pause background animation"}
        >
          <svg viewBox="0 0 20 20" aria-hidden="true">
            {paused ? <path d="M6 4 16 10 6 16Z" /> : <path d="M6 4h3v12H6zM12 4h3v12h-3z" />}
          </svg>
        </button>
      </div>
      {localReview && (
        <nav className="mosaic-variants" aria-label="Hero mosaic variants">
          <span>Composition</span>
          {compositions.map((entry) => (
            <a
              key={entry.id}
              href={compositionHref(entry.id, window.location.search)}
              title={entry.description}
            >
              {entry.label}
            </a>
          ))}
          <a
            href={compositionHref("wings", window.location.search)}
            aria-current={variantId === "wings" ? "page" : undefined}
          >
            Previous
          </a>
        </nav>
      )}
    </>
  );
}
