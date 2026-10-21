import { useMemo, useRef } from "react";
import { useFactoryDissolve } from "./useFactoryDissolve";
import {
  factorySurfaceCue,
  type FactoryLayerId,
  type FactoryModuleId,
} from "../factory-stack-data";

import { FactoryFloorTools } from "./FactoryToolMarks";

// Original factory geometry. Vendor marks retain their own proportions and colours.
export function FactorySlab({
  layer,
  module,
  title,
  directory = false,
  facade,
  configure = false,
  hideOpsTools = false,
  cueIndex = 0,
  animateCopy = false,
}: {
  layer: FactoryLayerId;
  module: FactoryModuleId;
  title: string;
  tags: readonly [string, string];
  directory?: boolean;
  facade?: string;
  configure?: boolean;
  hideOpsTools?: boolean;
  cueIndex?: number;
  animateCopy?: boolean;
}) {
  const element = useRef<SVGSVGElement>(null);
  const requested = useMemo(
    () => ({
      module,
      title,
      facade,
      cueIndex,
      side: animateCopy && !directory && !!facade && cueIndex % 2 === 1,
    }),
    [module, title, facade, cueIndex, animateCopy, directory],
  );
  const moduleKey = layer === "work" || layer === "context" ? module : "shared";
  const key = `${moduleKey}:${title}:${facade}:${cueIndex}:${requested.side}`;
  const { value: copy, phase } = useFactoryDissolve(
    element,
    requested,
    key,
    animateCopy && !directory,
  );
  const right =
    Math.floor(copy.cueIndex / 4) % 2 === 0
      ? layer === "work" || layer === "inference"
      : layer !== "work" && layer !== "inference";
  const descriptor = factorySurfaceCue(layer, copy.module, Math.floor(copy.cueIndex / 2));
  return (
    <svg
      ref={element}
      className="factory-slab"
      viewBox="0 0 400 200"
      aria-hidden="true"
      focusable="false"
    >
      <path className="slab-face" d="M40 90 200 170 200 198 40 118Z" />
      <path className="slab-side" d="M200 170 360 90 360 118 200 198Z" />
      <path className="slab-top" d="M200 10 360 90 200 170 40 90Z" />
      {layer === "ops" && (
        <g className="factory-roof">
          <path className="slab-face" d="M128 62V32L164 62V50L200 80V98Z" />
          <path className="slab-side" d="M200 80 272 44V62L200 98Z" />
          <path className="slab-top" d="M200-4 236 26 164 62 128 32Z" />
          <path className="factory-roof-glazing" d="M236 26V14L164 50V62Z" />
          <path className="slab-top" d="M236 14 272 44 200 80 164 50Z" />
          <path
            className="factory-roof-light"
            d="m139 60 9 4.5V72l-9-4.5Zm16 8 9 4.5V80l-9-4.5Zm17 8 9 4.5V88l-9-4.5Z"
          />
          <path className="factory-roof-door" d="M146 60 156 65V76L146 71Z" />
          <g className="factory-control-room">
            <path className="factory-control-glass" d="M238 20 254 28V46L238 38Z" />
            <path className="factory-control-side" d="M254 28 266 22V40L254 46Z" />
            <path className="factory-vent-top" d="M250 14 266 22 254 28 238 20Z" />
            <path className="factory-control-frame" d="M246 24V42M238 32 254 40 266 34" />
            <path className="factory-roof-door" d="M257 31 262 28V40L257 43Z" />
            <path className="factory-roof-steps" d="m266 41 6 3v4l6 3v4l6 3" />
          </g>
        </g>
      )}
      <g className="factory-copy-dissolve" data-phase={phase}>
        {directory
          ? !configure && (
              <path className="factory-module-socket" d="M200 50 280 90 200 130 120 90Z" />
            )
          : !(hideOpsTools && layer === "ops") && (
              <g className="factory-live-surface">
                <FactoryFloorTools
                  layer={layer}
                  module={copy.module}
                  variant={copy.cueIndex}
                  rightCue={right}
                />
              </g>
            )}
        {!directory && (
          <g className="factory-plane-labels factory-live-surface">
            <text
              className="factory-plane-tag"
              transform={right ? "matrix(1 -.5 1 .5 206 160)" : "matrix(1 .5 -1 .5 86 106)"}
            >
              {factorySurfaceCue(layer, copy.module, copy.cueIndex)}
            </text>
          </g>
        )}
        {configure && (
          <text
            className="factory-configure-label factory-plane-labels"
            transform="matrix(1 .5 -1 .5 160 95)"
          >
            <tspan x="0">Configure</tspan>
            <tspan x="0" dy="18">
              your own
            </tspan>
          </text>
        )}
        <text
          className="factory-face-title"
          data-long-title={!directory && copy.title === "Business Intelligence"}
          transform="matrix(1 .5 0 1 56 98)"
          y={!directory && copy.title === "Business Intelligence" ? 10 : 20}
          opacity={copy.side ? 0 : 1}
        >
          {directory ? (
            title
          ) : copy.title === "Business Intelligence" ? (
            <>
              <tspan x="0">Business</tspan>
              <tspan x="0" dy="13">
                Intelligence
              </tspan>
            </>
          ) : (
            copy.title
          )}
        </text>
        {copy.facade && (
          <text
            className="factory-side-title"
            transform="matrix(1 -.5 0 1 214 164)"
            y="20"
            opacity={copy.side ? 1 : 0}
          >
            {descriptor}
          </text>
        )}
      </g>
    </svg>
  );
}

export function FactoryIslandBase() {
  return (
    <svg className="factory-island-base" viewBox="0 0 560 700" aria-hidden="true" focusable="false">
      <path className="island-front" d="M80 572 280 672 280 680 80 580Z" />
      <path className="island-side" d="M280 672 480 572 480 580 280 680Z" />
      <path className="island-top" d="M280 472 480 572 280 672 80 572Z" />
      <path
        className="island-grid"
        d="m130 547 200 100m-150-125 200 100m-150-125 200 100m-100-100-200 100m250-75-200 100m250-75-200 100"
      />
    </svg>
  );
}
