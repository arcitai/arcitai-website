import type { FactoryLayerId, FactoryModuleId } from "./factory-stack-data";

export type FactoryToolMark = {
  name: string;
  asset?: string;
  darkAsset?: string;
  monochrome?: boolean;
  glyph?: "model" | "chip" | "route" | "server" | "search" | "sources" | "shield";
  sprite?: boolean;
  example?: string;
};

const marks = {
  codex: { name: "Codex", asset: "codex-spritesheet-v4.webp", sprite: true, example: "Codex" },
  claude: { name: "Claude Code", asset: "claudecode.svg", example: "Claude Code" },
  cursor: {
    name: "Cursor",
    asset: "cursor-light.svg",
    darkAsset: "cursor-dark.svg",
    example: "Cursor",
  },
  github: { name: "GitHub", asset: "github.svg", monochrome: true, example: "GitHub" },
  powerbi: { name: "Microsoft Power BI", asset: "powerbi.svg", example: "Microsoft Power BI" },
  security: {
    name: "Codex Security",
    asset: "codex-security.png",
    example: "Codex Security for code review",
  },
  databricks: { name: "Databricks", asset: "databricks.svg", example: "Databricks" },
  shield: { name: "Security controls", glyph: "shield" },
  mcp: { name: "MCP", asset: "mcp.svg", example: "MCP" },
  azure: { name: "Azure", asset: "azure.svg", example: "Azure" },
  model: { name: "Semantic model", glyph: "model" },
  chip: { name: "Inference", glyph: "chip" },
  route: { name: "Model choice", glyph: "route" },
  server: { name: "Execution host", glyph: "server" },
  search: { name: "Research", glyph: "search" },
  sources: { name: "Sources", glyph: "sources" },
} satisfies Record<string, FactoryToolMark>;

const workMarks = {
  software: [marks.cursor, marks.github],
  powerbi: [marks.powerbi, marks.model],
  defence: [marks.security, marks.shield],
  research: [marks.search, marks.sources],
} satisfies Record<FactoryModuleId, readonly [FactoryToolMark, FactoryToolMark]>;

// Illustrative choices, not an inventory of installed or qualified integrations.
export function factoryToolsForLayer(
  layer: FactoryLayerId,
  module: FactoryModuleId,
): readonly FactoryToolMark[] {
  switch (layer) {
    case "ops":
      return [marks.codex, marks.claude];
    case "work":
      return workMarks[module];
    case "context":
      return [marks.databricks, marks.mcp];
    case "inference":
      return [marks.chip, marks.route];
    case "compute":
      return [marks.server, marks.azure];
    default:
      return [];
  }
}
