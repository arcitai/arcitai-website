import { useEffect, useRef, useState } from "react";
import "./method-flow.css";

type Pixel = {
  id: number;
  x: number;
  y: number;
  lane: number;
  speed: number;
  size: number;
  queue: number;
  passed: boolean[];
};
const COUNT = 96;
const gates = [630, 865];
const labels = ["SPEC", "BUILD", "REVIEW", "SHIP"];
const labelX = [125, 365, 630, 865];
const palette = ["#315840", "#658b64", "#93a98a"];
const makePixels = (): Pixel[] =>
  Array.from({ length: COUNT }, (_, id) => ({
    id,
    x: 20 + ((id * 137) % 960),
    y: 140,
    lane: (((id * 43) % 100) / 100 - 0.5) * 58,
    speed: 56 + ((id * 17) % 24),
    size: id % 4 === 0 ? 6 : 4.5,
    queue: -1,
    passed: [false, false],
  }));

export function MethodFlow() {
  const host = useRef<HTMLButtonElement>(null);
  const pixels = useRef(makePixels());
  const rects = useRef<(SVGRectElement | null)[]>([]);
  const walls = useRef<(SVGPathElement | null)[]>([]);
  const bars = useRef<(SVGRectElement | null)[]>([]);
  const stageLabels = useRef<(SVGTextElement | null)[]>([]);
  const control = useRef({
    target: 0,
    hover: false,
    pinned: false,
    viewing: false,
    visible: true,
    openness: [0, 0],
    queues: [[] as Pixel[], [] as Pixel[]],
    clocks: [0, 0],
    time: 0,
    until: 0,
    raf: 0,
    last: 0,
  });
  const wake = useRef(() => {});
  const [pinned, setPinned] = useState(false);
  useEffect(() => {
    const c = control.current;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const advance = (dt: number, warm = false) => {
      c.time += dt;
      for (let g = 0; g < 2; g++) {
        const target = c.target > g ? 1 : 0;
        c.openness[g] += (target - c.openness[g]) * Math.min(1, dt * 5);
        const interval =
          (g === 0 ? 0.3 : 0.5) * (1 - c.openness[g]) + 0.025 * c.openness[g];
        c.clocks[g] += dt;
        if (c.clocks[g] >= interval) {
          c.clocks[g] %= interval;
          const p = c.queues[g].shift();
          if (p) {
            p.queue = -1;
            p.passed[g] = true;
          }
        }
      }
      for (const p of pixels.current) {
        if (p.queue >= 0) continue;
        p.x += p.speed * dt * (1 + 0.8 * Math.min(...c.openness));
        for (let g = 0; g < 2; g++) {
          if (!p.passed[g] && p.x >= gates[g] - 18 && p.x <= gates[g] + 14) {
            if (c.openness[g] < 0.92) {
              p.queue = g;
              c.queues[g].push(p);
              break;
            }
            p.passed[g] = true;
          }
        }
        if (p.x > 985) {
          p.x = 10;
          p.passed = [false, false];
        }
      }
      for (let g = 0; g < 2; g++)
        c.queues[g].forEach((p, rank) => {
          const targetX = gates[g] - 18 - Math.floor(rank / 3) * 7;
          p.x += (targetX - p.x) * Math.min(1, dt * 12);
        });
      if (!warm) draw();
    };
    const half = (x: number) =>
      46 -
      39 * (1 - c.openness[0]) * Math.exp(-Math.pow((x - gates[0]) / 57, 2)) -
      39 * (1 - c.openness[1]) * Math.exp(-Math.pow((x - gates[1]) / 57, 2));
    const draw = () => {
      const top: string[] = [];
      const bottom: string[] = [];
      for (let x = 20; x <= 980; x += 8) {
        const h = half(x);
        top.push(`${x === 20 ? "M" : "L"}${x} ${140 - h}`);
        bottom.push(`${x === 20 ? "M" : "L"}${x} ${140 + h}`);
      }
      walls.current[0]?.setAttribute("d", top.join(" "));
      walls.current[1]?.setAttribute("d", bottom.join(" "));
      const open = Math.min(...c.openness);
      for (let i = 0; i < 2; i++)
        walls.current[i]?.setAttribute(
          "stroke",
          open > 0.98 ? "#66856b" : "url(#method-tube-color)",
        );
      for (const p of pixels.current) {
        let targetY = 140 + p.lane * (half(p.x) / 46);
        if (p.queue >= 0) {
          const rank = c.queues[p.queue].indexOf(p);
          targetY = 140 + ((rank % 3) - 1) * 6;
        }
        p.y += (targetY - p.y) * 0.2;
        rects.current[p.id]?.setAttribute("x", String(p.x - p.size / 2));
        rects.current[p.id]?.setAttribute("y", String(p.y - p.size / 2));
      }
      for (let i = 0; i < 4; i++) {
        const progress =
          i < 2
            ? (c.time * (i === 0 ? 0.45 : 0.7)) % 1
            : c.clocks[i - 2] /
              ((i === 2 ? 0.3 : 0.5) * (1 - c.openness[i - 2]) +
                0.025 * c.openness[i - 2]);
        bars.current[i]?.setAttribute(
          "width",
          String(130 * Math.min(1, progress)),
        );
        const color = i < 2 || c.openness[i - 2] > 0.85 ? "#54765a" : "#a4643d";
        bars.current[i]?.setAttribute("fill", color);
        stageLabels.current[i]?.setAttribute("fill", color);
      }
    };
    // Pre-roll this same particle set so the first frame already shows both queues.
    for (let n = 0; n < 240; n++) advance(1 / 60, true);
    draw();
    const tick = (now: number) => {
      c.raf = 0;
      if (!c.viewing || !c.visible || reduced.matches) {
        c.last = 0;
        return;
      }
      const dt = Math.min((now - (c.last || now - 16)) / 1000, 0.04);
      c.last = now;
      advance(dt);
      if (c.hover || c.pinned || now < c.until)
        c.raf = requestAnimationFrame(tick);
      else c.last = 0;
    };
    wake.current = () => {
      if (reduced.matches) {
        c.openness = [c.target > 0 ? 1 : 0, c.target > 1 ? 1 : 0];
        draw();
        return;
      }
      if (!c.raf) {
        c.last = 0;
        c.raf = requestAnimationFrame(tick);
      }
    };
    const observer = new IntersectionObserver(
      ([e]) => {
        c.viewing = e.isIntersecting;
        if (c.viewing) {
          c.until = performance.now() + 4500;
          wake.current();
        } else {
          cancelAnimationFrame(c.raf);
          c.raf = 0;
          c.last = 0;
        }
      },
      { threshold: 0.15 },
    );
    if (host.current) observer.observe(host.current);
    const visibility = () => {
      c.visible = !document.hidden;
      if (c.visible) wake.current();
      else {
        cancelAnimationFrame(c.raf);
        c.raf = 0;
      }
    };
    const preference = () => {
      if (reduced.matches) {
        cancelAnimationFrame(c.raf);
        c.raf = 0;
      }
      wake.current();
    };
    document.addEventListener("visibilitychange", visibility);
    reduced.addEventListener("change", preference);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(c.raf);
      document.removeEventListener("visibilitychange", visibility);
      reduced.removeEventListener("change", preference);
    };
  }, []);
  const enter = (target: number) => {
    const c = control.current;
    c.hover = true;
    if (!c.pinned) c.target = target;
    wake.current();
  };
  const leave = () => {
    const c = control.current;
    c.hover = false;
    if (!c.pinned) c.target = 0;
    c.until = performance.now() + 850;
    wake.current();
  };
  return (
    <div className="da-section da-flow da-physical-flow">
      <button
        ref={host}
        className="da-interactive-flow"
        aria-label="Open the flow through Review and Ship"
        aria-pressed={pinned}
        onPointerMove={(e) => {
          if (e.pointerType === "mouse") {
            const r = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width;
            enter(x > 0.77 ? 2 : x > 0.48 ? 1 : 0);
          }
        }}
        onPointerLeave={leave}
        onFocus={() => enter(2)}
        onBlur={leave}
        onClick={() => {
          const c = control.current;
          c.pinned = !c.pinned;
          c.target = c.pinned ? 2 : 0;
          setPinned(c.pinned);
          wake.current();
        }}
      >
        <div className="da-mobile-stages" aria-hidden="true">
          {labels.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
        <svg
          className="da-pipeline"
          viewBox="0 0 1000 220"
          role="img"
          aria-label="The same pieces of work queue at Review and Ship, then pass through as the bottlenecks open."
        >
          <defs>
            <linearGradient id="method-tube-color">
              <stop stopColor="#66856b" />
              <stop offset=".48" stopColor="#66856b" />
              <stop offset="1" stopColor="#b68368" />
            </linearGradient>
          </defs>
          {labels.map((l, i) => (
            <g key={l}>
              <text
                ref={(e) => {
                  stageLabels.current[i] = e;
                }}
                className="da-stage"
                textAnchor="middle"
                x={labelX[i]}
                y="22"
              >
                {l}
              </text>
              <rect
                x={labelX[i] - 65}
                y="36"
                width="130"
                height="2"
                fill="var(--line)"
              />
              <rect
                ref={(e) => {
                  bars.current[i] = e;
                }}
                x={labelX[i] - 65}
                y="36"
                width="0"
                height="2"
                fill="#66856b"
              />
            </g>
          ))}
          <path
            ref={(e) => {
              walls.current[0] = e;
            }}
            fill="none"
            strokeWidth="1.4"
          />
          <path
            ref={(e) => {
              walls.current[1] = e;
            }}
            fill="none"
            strokeWidth="1.4"
          />
          {pixels.current.map((p) => (
            <rect
              ref={(e) => {
                rects.current[p.id] = e;
              }}
              data-pixel={p.id}
              key={p.id}
              width={p.size}
              height={p.size}
              x={p.x}
              y={p.y}
              fill={palette[p.id % 3]}
              opacity=".86"
            />
          ))}
        </svg>
      </button>
    </div>
  );
}
