import { useMemo, useRef } from "react";
import { useFactoryDissolve } from "./useFactoryDissolve";
import {
  factorySurfaceCue,
  type FactoryLayerId,
  type FactoryModuleId,
} from "../factory-stack-data";

import { FactoryFloorTools } from "./FactoryToolMarks";
import { PrismFinish } from "./ArcMaterial";
import { roundedPrism } from "../rounded-prism";

const slabShape = roundedPrism([200, 10], [360, 90], [200, 170], [40, 90], 28);
const islandShape = roundedPrism([280, 472], [480, 572], [280, 672], [80, 572], 8);
const controlShape = roundedPrism([250, 14], [266, 22], [254, 28], [238, 20], 18, 0.1);

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
      <path className="slab-face" d={slabShape.face} />
      <path className="slab-side" d={slabShape.side} />
      <path className="slab-top" d={slabShape.top} />
      <path className="arc-mat arc-mat-rim" d={slabShape.rim} />
      <path className="arc-mat arc-mat-lip" d={slabShape.lip} />
      <path className="arc-mat arc-mat-shade" d={slabShape.shade} />
      {layer === "ops" && (
        <g className="factory-roof">
          <path className="slab-side" d="M200 80 272 44V62L200 98Z" />
          <path className="arc-mat arc-mat-shade is-side" d="M200 98 272 62 272 58 200 94Z" />
          <path className="factory-roof-plane" d="M200-4 236 26 164 62 128 32Z" />
          <PrismFinish
            left={[128, 32]}
            back={[200, -4]}
            right={[236, 26]}
            front={[164, 62]}
            depth={30}
            rimOnly
          />
          {/* The near stepped wall occludes the rear tooth, closing its apparent notch. */}
          <path className="slab-face" d="M128 62V32L164 62V50L200 80V98Z" />
          <path className="arc-mat arc-mat-shade" d="M128 62 200 98 200 94 128 58Z" />
          <path
            className="arc-mat arc-mat-lip"
            d="M128 32 164 62 164 63.5 128 33.5Z M164 50 200 80 200 81.5 164 51.5Z"
          />
          <path className="factory-roof-plane" d="M236 14 272 44 200 80 164 50Z" />
          <PrismFinish
            left={[164, 50]}
            back={[236, 14]}
            right={[272, 44]}
            front={[200, 80]}
            depth={18}
            faces="side"
          />
          <path
            className="factory-roof-light"
            d="m139 60 9 4.5V72l-9-4.5Zm16 8 9 4.5V80l-9-4.5Zm17 8 9 4.5V88l-9-4.5Z"
          />
          <path className="factory-roof-door" d="M146 60 156 65V76L146 71Z" />
          <g className="factory-control-room">
            <path
              className="arc-mat arc-mat-shade"
              d="M238 38 254 46 266 40 270 42 254 50 238 42Z"
            />
            <path className="factory-control-glass" d={controlShape.face} />
            <path className="factory-control-side" d={controlShape.side} />
            <path className="factory-vent-top" d={controlShape.top} />
            <path className="arc-mat arc-mat-rim" d={controlShape.rim} />
            <path className="arc-mat arc-mat-lip" d={controlShape.lip} />
            <path className="arc-mat arc-mat-shade" d={controlShape.shade} />
            <path className="arc-mat arc-mat-glint" d="M241 22.5 245 24.5V40.5L241 38.5Z" />
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
      <path className="island-front" d={islandShape.face} />
      <path className="island-side" d={islandShape.side} />
      <path className="island-top" d={islandShape.top} />
      <path className="arc-mat arc-mat-rim" d={islandShape.rim} />
      <path className="arc-mat arc-mat-lip" d={islandShape.lip} />
      <path
        className="island-grid"
        d="m130 547 200 100m-150-125 200 100m-150-125 200 100m-100-100-200 100m250-75-200 100m250-75-200 100"
      />
      <path className="arc-mat factory-stack-contact" d="M118 573 280 492 448 576 286 659Z" />
    </svg>
  );
}
