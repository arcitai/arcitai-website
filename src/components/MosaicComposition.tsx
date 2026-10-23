import { localReview } from "../family/preview";
import { memo, useEffect, useId, useMemo, useRef, useState, type CSSProperties } from "react";
import { CodexWorker, ClaudeWorker } from "./FactoryAgents";
import { roundedPrism } from "../rounded-prism";
import {
  compositionHref,
  compositionId,
  compositions,
  createMosaicStory,
  compositionFamily,
  storyBasis,
  storyPoint,
  storySize,
  storyTileFrame,
  storyVisitSeed,
  storyWorkerFrames,
  type CompositionId,
  type MosaicStory,
  type StoryBasis,
  type StoryPoint,
} from "../mosaic-story";
import { advancePointerTrails, storyEntityMotion, type PointerTrails } from "../mosaic-pointer";
import { storyGlow, type StoryGlow } from "../mosaic-glow";
import {
  endingId,
  endings,
  endingTimeline,
  endingMarkFrame,
  endingContextFrame,
  endingInk,
  endingCalm,
  endingAccent,
  endingWorkers,
  endingFoundation,
  storyAppearance,
  transitionEndingFrame,
  transitionEndingValue,
  type EndingId,
  type EndingTimeline,
  type EndingFrame,
} from "../mosaic-ending";
import "./mosaic-hero.css";
import "./mosaic-composition.css";

function geometry(size: number, depth: number, basis: StoryBasis) {
  const { ux, uy, vx, vy } = basis;
  return roundedPrism(
    [0, 0],
    [size * ux, size * uy],
    [size * (ux + vx), size * (uy + vy)],
    [size * vx, size * vy],
    depth,
  );
}
const Plate = memo(function Plate({
  shape,
  className = "",
}: {
  shape: ReturnType<typeof geometry>;
  className?: string;
}) {
  return (
    <g className={`story-plate ${className}`}>
      <path className="story-face" d={shape.face} />
      <path className="story-side" d={shape.side} />
      <path className="story-top" d={shape.top} />
      <path className="arc-mat-rim" d={shape.rim} />
      <path className="arc-mat-lip" d={shape.lip} />
    </g>
  );
});

const Mark = memo(function Mark({
  span,
  file,
  label,
  arc = false,
  phone = false,
  basis,
}: {
  span: number;
  file: string;
  label: string;
  arc?: boolean;
  phone?: boolean;
  basis: StoryBasis;
}) {
  const size = span * 36.4 - 8.4;
  const logo = phone ? (arc ? 68 : 56) : arc ? 42 : span < 1.8 ? 26 : 29;
  return (
    <g className={arc ? "story-brand story-arc" : "story-brand"}>
      <title>{label}</title>
      <Plate shape={geometry(size, arc ? 6 : 4, basis)} />
      <image
        href={file}
        x={(size * (basis.ux + basis.vx)) / 2 - logo / 2}
        y={(size * (basis.uy + basis.vy)) / 2 - logo / 2}
        width={logo}
        height={logo}
        preserveAspectRatio="xMidYMid meet"
      />
    </g>
  );
});

/** A transparent wash across the whole hero, including the copy and side islands.
 * Its bounds do not depend on the compact artwork crop. */
const Atmosphere = memo(function Atmosphere({ id, blue }: { id: string; blue: number }) {
  const colour = `color-mix(in srgb, var(--story-cool) ${(blue * 100).toFixed(2)}%, var(--story-mist))`;
  return (
    <div className="story-atmosphere" data-composition="blend" aria-hidden="true">
      <svg viewBox="0 0 1600 900" preserveAspectRatio="none">
        <defs>
          <radialGradient id={`${id}-atmosphere`}>
            <stop stopColor={colour} stopOpacity="var(--story-cool-centre)" />
            <stop offset=".5" stopColor={colour} stopOpacity="var(--story-cool-mid)" />
            <stop offset="1" stopColor={colour} stopOpacity="0" />
          </radialGradient>
        </defs>
        <g fill={`url(#${id}-atmosphere)`} opacity={0.28 + blue * 0.24}>
          <ellipse cx="360" cy="310" rx="350" ry="300" />
          <ellipse cx="1240" cy="420" rx="350" ry="390" />
          <ellipse cx="800" cy="640" rx="780" ry="250" />
        </g>
      </svg>
    </div>
  );
});

const Surroundings = memo(function Surroundings({
  variant,
  id,
  story,
  glow,
}: {
  variant: CompositionId;
  id: string;
  story: MosaicStory;
  glow: StoryGlow;
}) {
  const { basis } = story;
  const family = compositionFamily(variant);
  const point = (column: number, row: number) => storyPoint(column, row, basis);
  const polygon = (corners: [number, number][]) =>
    corners
      .map(([column, row], index) => {
        const p = point(column, row);
        return `${index ? "L" : "M"}${p.x} ${p.y}`;
      })
      .join("") + "Z";
  const arc = story.platforms[0];
  const arcPoint = point(arc.column, arc.row);
  const arcSize = arc.span * 36.4 - 8.4;
  const cool = {
    x: arcPoint.x + (arcSize * (basis.ux + basis.vx)) / 2,
    y: arcPoint.y + (arcSize * (basis.uy + basis.vy)) / 2,
  };
  const ghostShape = geometry(storySize, 3, basis);
  return (
    <g className={`story-surroundings story-surroundings-${family}`}>
      <defs>
        <radialGradient id={`${id}-warm`}>
          <stop stopColor="var(--story-warm)" stopOpacity="var(--story-warm-centre)" />
          <stop offset=".5" stopColor="var(--story-warm)" stopOpacity="var(--story-warm-mid)" />
          <stop offset="1" stopColor="var(--story-warm)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-cool`}>
          <stop stopColor="var(--story-cool)" stopOpacity="var(--story-cool-centre)" />
          <stop offset=".5" stopColor="var(--story-cool)" stopOpacity="var(--story-cool-mid)" />
          <stop offset="1" stopColor="var(--story-cool)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-copy-glow`}>
          <stop stopColor="var(--story-cool)" stopOpacity="var(--story-copy-glow)" />
          <stop offset="1" stopColor="var(--story-cool)" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id={`${id}-copy-mask`}
          gradientUnits="userSpaceOnUse"
          cx="800"
          cy="280"
          r="513"
          gradientTransform="translate(800 280) scale(1 .460526) translate(-800 -280)"
        >
          <stop offset=".63" stopColor="black" />
          <stop offset="1" stopColor="white" />
        </radialGradient>
        <mask
          id={`${id}-contours`}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="1600"
          height="900"
        >
          <rect width="1600" height="900" fill={`url(#${id}-copy-mask)`} />
        </mask>
      </defs>
      {(family === "haze" || family === "blend" || family === "reflection") && (
        <>
          {family !== "blend" && (
            <g>
              <ellipse
                cx="520"
                cy="610"
                rx="380"
                ry="170"
                transform={`rotate(${basis.axisDeg} 520 610)`}
                fill={`url(#${id}-warm)`}
              />
              <ellipse
                cx="1180"
                cy="680"
                rx="330"
                ry="160"
                transform={`rotate(${basis.axisDeg} 1180 680)`}
                fill={`url(#${id}-cool)`}
              />
            </g>
          )}
          {family === "blend" && (
            <g>
              {glow.regions.map((region, index) => (
                <ellipse
                  key={index}
                  cx={region.x}
                  cy={region.y}
                  rx={region.rx}
                  ry={region.ry}
                  transform={`rotate(${region.angle} ${region.x} ${region.y})`}
                  fill={`url(#${id}-cool)`}
                  opacity={region.opacity}
                />
              ))}
            </g>
          )}
          {!story.compact && (
            <ellipse cx="800" cy="300" rx="420" ry="150" fill={`url(#${id}-copy-glow)`} />
          )}
        </>
      )}
      {family === "contour" && (
        <g mask={`url(#${id}-contours)`}>
          <g className="story-contours">
            {Array.from({ length: 6 }, (_, i) => (
              <ellipse
                key={i}
                cx={cool.x}
                cy={cool.y}
                rx={260 + 130 * i}
                ry={(260 + 130 * i) * 0.42}
                transform={`rotate(${basis.axisDeg} ${cool.x} ${cool.y})`}
              />
            ))}
          </g>
          <g className="story-routes">
            {story.sources.map((brand) => {
              const a = point(brand.column, brand.row + 1);
              const tile = story.tiles.find((tile) => tile.source === brand.id)!;
              const b = tile.destination;
              return <path key={brand.id} d={`M${a.x} ${a.y}Q${a.x} ${b.y + 32} ${b.x} ${b.y}`} />;
            })}
          </g>
        </g>
      )}
      {(family === "frame" || family === "blend") && (
        <g className="story-ghosts">
          {story.ghosts.map((p, i) => (
            <path key={i} d={ghostShape.top} transform={`translate(${p.x} ${p.y})`} />
          ))}
        </g>
      )}
      {family === "glass" && (
        <path
          d={polygon([
            [6, -5],
            [17, -5],
            [17, -1],
            [6, -1],
          ])}
          className="story-glass"
        />
      )}
      {family === "swell" && (
        <g className="story-swell">
          {[-1.2, -2.4, -3.6].map((row) => {
            const a = point(-14, row);
            const b = point(0, row);
            const c = point(17, row);
            return <path key={row} d={`M${a.x} ${a.y}Q${b.x} ${b.y - 30} ${c.x} ${c.y}`} />;
          })}
        </g>
      )}
    </g>
  );
});

type EndingSelection = {
  id: EndingId;
  previous?: EndingTimeline;
  at: number;
  frames?: Record<string, EndingFrame>;
  ink?: Record<string, number>;
  calm?: Record<string, number>;
  accents?: Record<string, number>;
  foundation?: Record<string, number>;
  workers?: number;
};

/** One conserved field, with a gentle travelling wave shared by tiles and brand plates. */
export function MosaicComposition() {
  const root = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const elapsed = useRef(0);
  const pointer = useRef<StoryPoint | null>(null);
  const [clock, setClock] = useState(0);
  const pointerRevision = useRef(0);
  const [trails, setTrails] = useState<PointerTrails>({});
  const [selection, setSelection] = useState<EndingSelection>(() => ({
    id: localReview ? endingId(window.location.search) : "all",
    at: 0,
  }));
  const [complete, setComplete] = useState(false);
  const [compact, setCompact] = useState(() => matchMedia("(max-width: 1280px)").matches);
  const [phone, setPhone] = useState(() => matchMedia("(max-width: 700px)").matches);
  const [basis] = useState(() => storyBasis(8));
  const tileShape = useMemo(() => geometry(storySize, 3, basis), [basis]);
  const contextShape = useMemo(() => geometry(storySize * 0.82, 2.5, basis), [basis]);
  const [variant] = useState(() => compositionId(localReview ? window.location.search : ""));
  // Old comparison URLs carried a fixed seed. Only an explicit replay should pin a new visit.
  const [seed] = useState(
    () =>
      (localReview ? storyVisitSeed(window.location.search) : undefined) ??
      crypto.getRandomValues(new Uint32Array(1))[0],
  );
  const story = useMemo(
    () => createMosaicStory(seed, basis, { variant, compact }),
    [seed, basis, variant, compact],
  );
  const timeline = useMemo(
    () =>
      endingTimeline(
        story,
        variant === "blend" ? selection.id : "quiet",
        selection.previous,
        selection.at,
      ),
    [story, selection, variant],
  );
  const blend = variant === "blend";
  const sinceSwitch = clock - selection.at;
  const marksAndPlatforms = [...story.sources, ...story.platforms];
  const tileFrames = Object.fromEntries(
    story.tiles.map((tile) => [tile.id, storyTileFrame(tile, story, clock, complete)]),
  );
  const markFrames = Object.fromEntries(
    marksAndPlatforms.map((mark) => [
      mark.id,
      transitionEndingFrame(
        complete ? undefined : selection.frames?.[mark.id],
        endingMarkFrame(story, mark, timeline, clock, complete),
        sinceSwitch,
      ),
    ]),
  );
  const contextFrames = Object.fromEntries(
    story.context.map((tile) => [
      tile.id,
      transitionEndingFrame(
        complete ? undefined : selection.frames?.[tile.id],
        endingContextFrame(story, tile, timeline, clock, complete),
        sinceSwitch,
      ),
    ]),
  );
  const ink = Object.fromEntries(
    story.tiles.map((tile) => [
      tile.id,
      blend
        ? transitionEndingValue(
            complete ? undefined : selection.ink?.[tile.id],
            endingInk(tile, timeline, clock, complete),
            sinceSwitch,
          )
        : 0,
    ]),
  );
  const calm = Object.fromEntries(
    story.tiles.map((tile) => [
      tile.id,
      blend
        ? transitionEndingValue(
            complete ? undefined : selection.calm?.[tile.id],
            endingCalm(tile, timeline, clock, complete),
            sinceSwitch,
          )
        : 0,
    ]),
  );
  const accents = Object.fromEntries(
    story.tiles.map((tile) => [
      tile.id,
      blend
        ? transitionEndingValue(
            complete ? undefined : selection.accents?.[tile.id],
            endingAccent(tile, timeline, clock, complete),
            sinceSwitch,
          )
        : 1,
    ]),
  );
  const workerOpacity = blend
    ? transitionEndingValue(
        complete ? undefined : selection.workers,
        endingWorkers(timeline, clock, complete),
        sinceSwitch,
      )
    : 1;
  const glow = storyGlow(story, tileFrames, markFrames, clock, complete);
  const foundation = endingFoundation(story, timeline, clock, complete).map((tile) => ({
    ...tile,
    opacity: transitionEndingValue(
      complete ? undefined : selection.foundation?.[tile.id],
      tile.opacity,
      sinceSwitch,
    ),
  }));
  const chooseEnding = (id: EndingId) => {
    if (id === selection.id) return;
    setSelection({
      id,
      previous: timeline,
      at: clock,
      frames: { ...markFrames, ...contextFrames },
      ink,
      calm,
      accents,
      workers: workerOpacity,
      foundation: Object.fromEntries(foundation.map((tile) => [tile.id, tile.opacity])),
    });
    const url = new URL(window.location.href);
    url.searchParams.set("ending", id);
    history.replaceState(history.state, "", url);
  };
  const id = useId();
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const small = matchMedia("(max-width: 1280px)");
    const narrow = matchMedia("(max-width: 700px)");
    const connection = (
      navigator as Navigator & { connection?: EventTarget & { saveData?: boolean } }
    ).connection;
    let visible = false;
    let request = 0;
    let previous = 0;
    let painted = 0;
    let lastRevision = pointerRevision.current;
    let lastPointer: StoryPoint | null = null;
    let currentTrails: PointerTrails = {};
    const frame = (now: number) => {
      if (previous) elapsed.current += Math.min(0.1, (now - previous) / 1000);
      previous = now;
      if (now - painted >= 1000 / 24) {
        setClock(elapsed.current);
        const point = pointer.current;
        const moved = !!point && lastRevision !== pointerRevision.current;
        const speed =
          point && lastPointer ? Math.hypot(point.x - lastPointer.x, point.y - lastPointer.y) : 14;
        const centres = [
          ...story.tiles.map((tile) => {
            const p = storyTileFrame(tile, story, elapsed.current);
            return {
              id: tile.id,
              point: {
                x: p.x + (storySize * (basis.ux + basis.vx)) / 2,
                y: p.y + (storySize * (basis.uy + basis.vy)) / 2,
              },
            };
          }),
          ...[...story.sources, ...story.platforms].map((mark) => {
            const p = storyPoint(mark.column, mark.row, basis);
            const size = mark.span * 36.4 - 8.4;
            return {
              id: mark.id,
              point: {
                x: p.x + (size * (basis.ux + basis.vx)) / 2,
                y: p.y + (size * (basis.uy + basis.vy)) / 2,
              },
            };
          }),
        ];
        currentTrails = advancePointerTrails(
          currentTrails,
          centres,
          point,
          speed,
          moved,
          painted ? Math.min(0.1, (now - painted) / 1000) : 1 / 24,
        );
        setTrails(currentTrails);
        if (moved) lastPointer = point;
        if (!point) lastPointer = null;
        lastRevision = pointerRevision.current;
        painted = now;
      }
      request = requestAnimationFrame(frame);
    };
    const sync = () => {
      cancelAnimationFrame(request);
      previous = 0;
      const staticScene = reduced.matches || !!connection?.saveData;
      setComplete(staticScene);
      setCompact(small.matches);
      setPhone(narrow.matches);
      const running = visible && !document.hidden && !staticScene;
      node.dataset.running = String(running);
      node.dataset.motionAvailable = String(!staticScene);
      if (running) request = requestAnimationFrame(frame);
      else {
        pointer.current = null;
        currentTrails = {};
        lastPointer = null;
        painted = 0;
        setTrails({});
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.05 },
    );
    observer.observe(node);
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    small.addEventListener("change", sync);
    narrow.addEventListener("change", sync);
    connection?.addEventListener("change", sync);
    sync();
    return () => {
      cancelAnimationFrame(request);
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
      small.removeEventListener("change", sync);
      narrow.removeEventListener("change", sync);
      connection?.removeEventListener("change", sync);
    };
  }, [story, basis]);
  const workers = storyWorkerFrames(story, clock, complete);
  const tiles = story.tiles.map((tile) => {
    const frame = tileFrames[tile.id];
    const ambient =
      complete || (tile.kind === "carrier" && !frame.installed)
        ? { x: 0, y: 0, shine: 0, scale: 1 }
        : storyEntityMotion(tile.column, tile.row, clock, trails[tile.id]);
    const finish = tile.finish
      ? `color-mix(in srgb, ${tile.finish} ${(accents[tile.id] * 100).toFixed(1)}%, var(--mosaic-blue-${tile.level}))`
      : `var(--mosaic-blue-${tile.level})`;
    const settledColor = `color-mix(in srgb, ${finish} ${(frame.blue * 100).toFixed(1)}%, ${tile.color})`;
    const calmColor = `color-mix(in srgb, var(--mosaic-blue-3) ${(calm[tile.id] * 100).toFixed(1)}%, ${settledColor})`;
    const baseColor = `color-mix(in srgb, var(--story-ink) ${(ink[tile.id] * 100).toFixed(1)}%, ${calmColor})`;
    const arrival = storyAppearance(tile.appears, clock, complete);
    // Keep the travelling light from washing out the completed letter strokes.
    const shine = ambient.shine * (1 - calm[tile.id] * 0.8);
    const color = `color-mix(in srgb, white ${(shine * 100).toFixed(1)}%, ${baseColor})`;
    return {
      depth: frame.y + storySize * (basis.uy + basis.vy),
      node: (
        <g
          key={tile.id}
          opacity={arrival.opacity}
          transform={`translate(${frame.x} ${frame.y + arrival.rise}) rotate(${frame.rotation})`}
        >
          <g
            className="story-pointer-tile"
            style={
              {
                translate: `${ambient.x.toFixed(2)}px ${ambient.y.toFixed(2)}px`,
                scale: ambient.scale.toFixed(4),
                "--tile-color": color,
              } as CSSProperties
            }
          >
            <Plate shape={tileShape} />
          </g>
        </g>
      ),
    };
  });
  const markMotion = Object.fromEntries(
    [...story.sources, ...story.platforms].map((brand) => [
      brand.id,
      complete || markFrames[brand.id].flying || markFrames[brand.id].opacity === 0
        ? { x: 0, y: 0, shine: 0, scale: 1 }
        : storyEntityMotion(
            brand.column,
            brand.row,
            clock,
            trails[brand.id],
            brand.id === "arcitai" ? 0.45 : 0.6,
          ),
    ]),
  );
  const marks = marksAndPlatforms.map((brand) => {
    const frame = markFrames[brand.id];
    const motion = markMotion[brand.id];
    return {
      depth: frame.flying ? 2000 : frame.y + (brand.span * 36.4 - 8.4) * (basis.uy + basis.vy),
      node: (
        <g
          key={brand.id}
          opacity={frame.opacity}
          transform={`translate(${frame.x} ${frame.y}) scale(${frame.scale})`}
        >
          <g
            className="story-pointer-mark"
            style={{ translate: `${motion.x.toFixed(2)}px ${motion.y.toFixed(2)}px` }}
          >
            <Mark
              {...brand}
              basis={basis}
              phone={phone}
              arc={brand.id === "arcitai"}
              file={
                brand.id === "arcitai"
                  ? "/assets/arcitai-mark-final.svg"
                  : brand.file.startsWith("/")
                    ? brand.file
                    : `/assets/factory-tools/${brand.file}`
              }
            />
          </g>
        </g>
      ),
    };
  });
  const context = story.context.map((tile) => {
    const frame = contextFrames[tile.id];
    const motion = frame.flying ? { x: 0, y: 0 } : markMotion[tile.markId];
    return {
      depth: frame.flying ? 2000 : frame.y + storySize * 0.82 * (basis.uy + basis.vy),
      node: (
        <g
          key={tile.id}
          opacity={frame.opacity}
          transform={`translate(${frame.x} ${frame.y}) scale(${frame.scale})`}
        >
          <g
            className="story-pointer-mark"
            style={
              {
                translate: `${motion.x.toFixed(2)}px ${motion.y.toFixed(2)}px`,
                "--tile-color": tile.color,
              } as CSSProperties
            }
          >
            <Plate shape={contextShape} />
          </g>
        </g>
      ),
    };
  });
  const foundationTiles = foundation.map((tile) => {
    const p = storyPoint(tile.column, tile.row, basis);
    const motion = complete
      ? { x: 0, y: 0, scale: 1 }
      : storyEntityMotion(tile.column, tile.row, clock);
    return {
      depth: p.y + storySize * (basis.uy + basis.vy),
      node: (
        <g key={tile.id} opacity={tile.opacity} transform={`translate(${p.x} ${p.y})`}>
          <g
            className="story-pointer-tile"
            style={
              {
                translate: `${motion.x}px ${motion.y}px`,
                scale: motion.scale,
                "--tile-color": `var(--mosaic-blue-${2 + ((tile.column + tile.row) % 3)})`,
              } as CSSProperties
            }
          >
            <Plate shape={tileShape} />
          </g>
        </g>
      ),
    };
  });
  const field = [...tiles, ...foundationTiles, ...marks, ...context].sort(
    (a, b) => a.depth - b.depth,
  );
  return (
    <>
      {blend && <Atmosphere id={id} blue={glow.blue} />}
      <div
        ref={root}
        className="hero-artwork mosaic-scene story-scene"
        data-composition={variant}
        data-ending={selection.id}
      >
        <svg
          ref={svg}
          className="mosaic-canvas"
          viewBox={compact ? "100 400 1440 470" : "0 0 1600 900"}
          preserveAspectRatio={compact ? "xMidYMid meet" : "xMidYMin meet"}
          aria-hidden="true"
          onPointerMove={(event) => {
            if (
              event.pointerType !== "mouse" ||
              complete ||
              root.current?.dataset.running !== "true"
            )
              return;
            const matrix = svg.current?.getScreenCTM();
            if (matrix) {
              pointer.current = new DOMPoint(event.clientX, event.clientY).matrixTransform(
                matrix.inverse(),
              );
              pointerRevision.current += 1;
            }
          }}
          onPointerLeave={() => {
            pointer.current = null;
          }}
        >
          <defs>
            <radialGradient id={`${id}-veil`}>
              <stop stopColor="var(--paper)" stopOpacity=".95" />
              <stop offset=".55" stopColor="var(--paper)" stopOpacity=".88" />
              <stop offset="1" stopColor="var(--paper)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <Surroundings variant={variant} id={id} story={story} glow={glow} />
          <g className="story-field">{field.map((item) => item.node)}</g>
          {workers
            .sort((a, b) => a.pose.y - b.pose.y)
            .map(({ name, pose }) => (
              <g
                key={name}
                opacity={
                  workerOpacity *
                  storyAppearance(
                    story.tiles.find(
                      (tile) => tile.id === story.jobs.find((job) => job.agent === name)?.tileId,
                    )?.appears,
                    clock,
                    complete,
                  ).opacity
                }
                transform={`translate(${pose.x} ${pose.y})`}
                style={{ "--factory-top": "var(--mosaic-eye)" } as CSSProperties}
              >
                <g className="mosaic-worker-figure">
                  <ellipse className="mosaic-worker-shadow" cy="1" rx="11" ry="2" />
                  {name === "codex" ? (
                    <CodexWorker pose={pose} />
                  ) : (
                    <ClaudeWorker pose={pose} clock={clock} />
                  )}
                </g>
              </g>
            ))}
          {!compact && (
            <ellipse
              cx="800"
              cy="270"
              rx="510"
              ry="260"
              fill={`url(#${id}-veil)`}
              pointerEvents="none"
            />
          )}
        </svg>
      </div>
      {localReview &&
        new URLSearchParams(window.location.search).get("compare") === "1" &&
        (blend ? (
          <nav
            className="mosaic-variants story-variants story-endings"
            aria-label="Hero ending variants"
          >
            <span>Ending</span>
            {endings.map((entry) => (
              <button
                key={entry.id}
                type="button"
                aria-pressed={entry.id === selection.id}
                title={entry.description}
                onClick={() => chooseEnding(entry.id)}
              >
                {entry.label}
              </button>
            ))}
          </nav>
        ) : (
          <nav className="mosaic-variants story-variants" aria-label="Hero composition variants">
            <span>Composition</span>
            {compositions.map((entry) => (
              <a
                key={entry.id}
                href={compositionHref(entry.id, window.location.search)}
                aria-current={entry.id === variant ? "page" : undefined}
                title={entry.description}
              >
                {entry.label}
              </a>
            ))}
          </nav>
        ))}
    </>
  );
}
