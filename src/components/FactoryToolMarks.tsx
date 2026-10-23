import type { FactoryLayerId, FactoryModuleId } from "../factory-stack-data";
import { factoryToolsForLayer, type FactoryToolMark } from "../factory-tools";

// Phosphor Icons (MIT): shared duotone paths, coloured with Arc’IT tokens.
// Attribution and upstream names: public/assets/factory-tools/SOURCES.md.
function ToolGlyph({ glyph }: Pick<FactoryToolMark, "glyph">) {
  switch (glyph) {
    case "model":
      return (
        <>
          <path
            className="factory-icon-tone"
            d="M128,129.09V232a8,8,0,0,1-3.84-1l-88-48.16a8,8,0,0,1-4.16-7V80.2a8,8,0,0,1,.7-3.27Z"
          />
          <path d="M223.68,66.15,135.68,18h0a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32h0l80.34,44L128,120,47.66,76ZM40,90l80,43.78v85.79L40,175.82Zm96,129.57V133.82L216,90v85.78Z" />
        </>
      );
    case "chip":
      return (
        <>
          <path
            className="factory-icon-tone"
            d="M200,48H56a8,8,0,0,0-8,8V200a8,8,0,0,0,8,8H200a8,8,0,0,0,8-8V56A8,8,0,0,0,200,48ZM152,152H104V104h48Z"
          />
          <path d="M152,96H104a8,8,0,0,0-8,8v48a8,8,0,0,0,8,8h48a8,8,0,0,0,8-8V104A8,8,0,0,0,152,96Zm-8,48H112V112h32Zm88,0H216V112h16a8,8,0,0,0,0-16H216V56a16,16,0,0,0-16-16H160V24a8,8,0,0,0-16,0V40H112V24a8,8,0,0,0-16,0V40H56A16,16,0,0,0,40,56V96H24a8,8,0,0,0,0,16H40v32H24a8,8,0,0,0,0,16H40v40a16,16,0,0,0,16,16H96v16a8,8,0,0,0,16,0V216h32v16a8,8,0,0,0,16,0V216h40a16,16,0,0,0,16-16V160h16a8,8,0,0,0,0-16Zm-32,56H56V56H200v95.87s0,.09,0,.13,0,.09,0,.13V200Z" />
        </>
      );
    case "route":
      return (
        <>
          <path
            className="factory-icon-tone"
            d="M64,112v32a8,8,0,0,1-8,8H24a8,8,0,0,1-8-8V112a8,8,0,0,1,8-8H56A8,8,0,0,1,64,112ZM208,40H160a8,8,0,0,0-8,8V96a8,8,0,0,0,8,8h48a8,8,0,0,0,8-8V48A8,8,0,0,0,208,40Zm0,112H160a8,8,0,0,0-8,8v48a8,8,0,0,0,8,8h48a8,8,0,0,0,8-8V160A8,8,0,0,0,208,152Z"
          />
          <path d="M160,112h48a16,16,0,0,0,16-16V48a16,16,0,0,0-16-16H160a16,16,0,0,0-16,16V64H128a24,24,0,0,0-24,24v32H72v-8A16,16,0,0,0,56,96H24A16,16,0,0,0,8,112v32a16,16,0,0,0,16,16H56a16,16,0,0,0,16-16v-8h32v32a24,24,0,0,0,24,24h16v16a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V160a16,16,0,0,0-16-16H160a16,16,0,0,0-16,16v16H128a8,8,0,0,1-8-8V88a8,8,0,0,1,8-8h16V96A16,16,0,0,0,160,112ZM56,144H24V112H56v32Zm104,16h48v48H160Zm0-112h48V96H160Z" />
        </>
      );
    case "server":
      return (
        <>
          <path
            className="factory-icon-tone"
            d="M216,152v48a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8H208A8,8,0,0,1,216,152ZM208,48H48a8,8,0,0,0-8,8v48a8,8,0,0,0,8,8H208a8,8,0,0,0,8-8V56A8,8,0,0,0,208,48Z"
          />
          <path d="M208,136H48a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V152A16,16,0,0,0,208,136Zm0,64H48V152H208v48Zm0-160H48A16,16,0,0,0,32,56v48a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V56A16,16,0,0,0,208,40Zm0,64H48V56H208v48ZM192,80a12,12,0,1,1-12-12A12,12,0,0,1,192,80Zm0,96a12,12,0,1,1-12-12A12,12,0,0,1,192,176Z" />
        </>
      );
    case "search":
      return (
        <>
          <path className="factory-icon-tone" d="M192,112a80,80,0,1,1-80-80A80,80,0,0,1,192,112Z" />
          <path d="M229.66,218.34,179.6,168.28a88.21,88.21,0,1,0-11.32,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
        </>
      );
    case "sources":
      return (
        <>
          <path
            className="factory-icon-tone"
            d="M208,72V184a8,8,0,0,1-8,8H176V104L136,64H80V40a8,8,0,0,1,8-8h80Z"
          />
          <path d="M213.66,66.34l-40-40A8,8,0,0,0,168,24H88A16,16,0,0,0,72,40V56H56A16,16,0,0,0,40,72V216a16,16,0,0,0,16,16H168a16,16,0,0,0,16-16V200h16a16,16,0,0,0,16-16V72A8,8,0,0,0,213.66,66.34ZM168,216H56V72h76.69L168,107.31v84.53c0,.06,0,.11,0,.16s0,.1,0,.16V216Zm32-32H184V104a8,8,0,0,0-2.34-5.66l-40-40A8,8,0,0,0,136,56H88V40h76.69L200,75.31Zm-56-32a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h48A8,8,0,0,1,144,152Zm0,32a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h48A8,8,0,0,1,144,184Z" />
        </>
      );
    case "shield":
      return (
        <>
          <path
            className="factory-icon-tone"
            d="M216,56v56c0,96-88,120-88,120S40,208,40,112V56a8,8,0,0,1,8-8H208A8,8,0,0,1,216,56Z"
          />
          <path d="M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.26,47,25.53a8,8,0,0,0,4.2,0c1-.27,23.91-6.67,47-25.53C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Zm0,72c0,37.07-13.66,67.16-40.6,89.42A129.3,129.3,0,0,1,128,223.62a128.25,128.25,0,0,1-38.92-21.81C61.82,179.51,48,149.3,48,112l0-56,160,0ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z" />
        </>
      );
    default:
      return null;
  }
}

export function ToolMark({
  mark,
  x,
  y,
  size,
}: {
  mark: FactoryToolMark;
  x: number;
  y: number;
  size: number;
}) {
  const base = "/assets/factory-tools/";
  return (
    <g>
      <title>{mark.name}</title>
      {mark.sprite ? (
        // Display one native idle frame without modifying or animating the source sheet.
        <>
          <svg
            x={x + (size - (size * 192) / 208) / 2}
            y={y}
            width={(size * 192) / 208}
            height={size}
            viewBox="0 0 192 208"
            overflow="hidden"
          >
            <image
              href={`${base}${mark.asset}`}
              width="1536"
              height="1872"
              style={{ pointerEvents: "none" }}
            />
          </svg>
          <rect x={x} y={y} width={size} height={size} fill="transparent" />
        </>
      ) : mark.asset ? (
        <>
          <image
            className={
              mark.darkAsset
                ? "factory-tool-light"
                : mark.monochrome
                  ? "factory-tool-monochrome"
                  : undefined
            }
            href={`${base}${mark.asset}`}
            x={x}
            y={y}
            width={size}
            height={size}
          />
          {mark.darkAsset && (
            <image
              className="factory-tool-dark"
              href={`${base}${mark.darkAsset}`}
              x={x}
              y={y}
              width={size}
              height={size}
            />
          )}
        </>
      ) : (
        <svg
          className="factory-layer-symbol"
          x={x}
          y={y}
          width={size}
          height={size}
          viewBox="0 0 256 256"
        >
          <ToolGlyph glyph={mark.glyph} />
        </svg>
      )}
    </g>
  );
}

export function FactoryFloorTools({
  layer,
  module,
  variant = 0,
  rightCue = false,
}: {
  layer: FactoryLayerId;
  module: FactoryModuleId;
  variant?: number;
  rightCue?: boolean;
}) {
  const tools = factoryToolsForLayer(layer, module);
  const shown = layer === "ops" ? tools : [tools[variant % tools.length]];
  return (
    <g className="factory-floor-symbols" data-resident={layer === "ops"}>
      {shown.map((mark, index) => {
        const x = layer === "ops" ? (index === 0 ? 66 : 334) : rightCue ? 84 : 328;
        const size = layer === "ops" ? 32 : 28;
        const footOffset = layer === "ops" && mark.asset === "claudecode.svg" ? (4 / 24) * size : 0;
        return (
          <g key={mark.name}>
            <ellipse className="arc-mat factory-tool-shadow" cx={x} cy="91" rx="15" ry="3" />
            <ToolMark mark={mark} x={x - size / 2} y={91 - size + footOffset} size={size} />
          </g>
        );
      })}
    </g>
  );
}

export function FactoryMobileTools({
  layer,
  module,
}: {
  layer: FactoryLayerId;
  module: FactoryModuleId;
}) {
  return (
    <svg
      className="factory-mobile-tools"
      data-single={layer !== "ops"}
      viewBox={layer === "ops" ? "0 0 76 40" : "0 0 36 40"}
      aria-hidden="true"
      focusable="false"
    >
      {factoryToolsForLayer(layer, module)
        .slice(0, layer === "ops" ? 2 : 1)
        .map((mark, index) => (
          <ToolMark key={mark.name} mark={mark} x={index * 40} y={3} size={34} />
        ))}
    </svg>
  );
}
