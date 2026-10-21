import sourceSnapshot from "../public/data/factory-module-sources.json";

export const factoryModules = [
  {
    id: "software",
    title: "Software",
    featured: true,
    description:
      "Develop, test and deliver changes to your solution with specialist agents and a separate review.",
    steps: ["Scope", "Build & test", "Separate review", "Approval & deploy"],
    context:
      "Project knowledge, repositories and the business rules your solution needs to follow.",
    routines: "Checks on each change, review before release and follow-up on the accepted backlog.",
    hostRoutines: "Service readiness, tool updates and recovery checks.",
  },
  {
    id: "powerbi",
    title: "Business Intelligence",
    featured: true,
    description:
      "Turn a business question into models and reports. Agents help prepare and clean data, build semantic models and create reports in tools such as Power BI, with validation before publishing.",
    steps: ["Prepare data", "Model & report", "Validate & review", "Approve & publish"],
    context: "Data sources, transformations, semantic models and shared business definitions.",
    routines:
      "Scheduled cleanup, refresh checks and data quality reviews, with model and report updates as requirements change.",
    hostRoutines: "Data connections, gateway access and recovery readiness.",
  },
  {
    id: "defence",
    title: "Defence",
    featured: true,
    description:
      "Shape a security workflow around your systems: the signals to observe, the risks to investigate and the response to agree.",
    steps: ["Observe", "Investigate", "Review", "Approved response"],
    context: "Operational signals, system inventories, access boundaries and response procedures.",
    routines: "Triage, escalation and reviewed responses for the signals in scope.",
    hostRoutines: "Signal access, alert routes and recovery readiness.",
  },
  {
    id: "research",
    title: "Research",
    featured: false,
    description:
      "Investigate a question, codebase or system with agents and specialist open-source tools. Research and reverse engineering turn source material into findings you can inspect and use.",
    steps: ["Frame", "Investigate", "Review", "Recommendation"],
    context:
      "Research questions, source documents, code and system behaviour, with evidence behind each finding.",
    routines: "Source reviews on an agreed schedule, with findings brought back for a decision.",
    hostRoutines: "Source access, scheduled wake-ups and tool updates.",
  },
] as const;

export type FactoryModuleId = (typeof factoryModules)[number]["id"];
export type FactoryLayerId =
  "ops" | "work" | "context" | "inference" | "compute" | "foundation" | "access";
export const workTags: Record<FactoryModuleId, readonly [string, string]> = {
  software: ["Build & test", "Review"],
  powerbi: ["Data model", "Validation"],
  defence: ["Signals", "Response"],
  research: ["Sources", "Evidence"],
};
export const factoryLayers: FactoryLayerId[] = ["ops", "work", "context", "inference", "compute"];
export const factoryPanelIds: FactoryLayerId[] = [...factoryLayers, "foundation", "access"];

const sourceRepositories: Partial<Record<FactoryModuleId, string>> = {
  software: "arcitai/factory",
  powerbi: "arcitai/Agentic-PowerBI-System",
};
export function moduleSource(id: FactoryModuleId, snapshot: unknown = sourceSnapshot) {
  const repository = sourceRepositories[id];
  if (!repository || !snapshot || typeof snapshot !== "object" || !("sources" in snapshot))
    return null;
  const sources = snapshot.sources;
  if (!sources || typeof sources !== "object" || !(id in sources)) return null;
  const source = (sources as Record<string, unknown>)[id];
  if (!source || typeof source !== "object" || !("repository" in source) || !("url" in source))
    return null;
  if (source.repository !== repository || source.url !== `https://github.com/${repository}`)
    return null;
  return { repository, url: source.url };
}

export function describeFactoryLayer(id: FactoryLayerId, moduleId: FactoryModuleId) {
  const module = factoryModules.find((item) => item.id === moduleId)!;
  const shared = {
    steps: [] as readonly string[],
    source: null as ReturnType<typeof moduleSource>,
  };
  switch (id) {
    case "ops":
      return {
        ...shared,
        title: "AgentOps",
        subtitle: "Direction & orchestration",
        description:
          "A lead agent for each project, coordinating the team and recurring work. Decisions come back to you where needed.",
        terms: ["Native orchestration", "Human in the loop", "Automations", "Separate review"],
        routineLabel: "Evaluation & improvement",
        routine:
          "Use available run metrics and review findings to improve working methods, AI model choices and routines.",
      };
    case "work":
      return {
        ...shared,
        title: module.title,
        subtitle: "Work module",
        description: module.description,
        steps: module.steps,
        terms: [] as string[],
        routineLabel: "Project routines",
        routine: module.routines,
        source: moduleSource(moduleId),
      };
    case "context":
      return {
        ...shared,
        title: "Data & Context",
        subtitle: "Business definitions & project knowledge",
        description: module.context + " Bring available metadata and source history into the work.",
        terms: [
          "Business definitions",
          "Metadata & lineage",
          "Permissions & access",
          "MCP & CLI access",
        ],
        routineLabel: "Maintain the context",
        routine:
          "Keep definitions, metadata and permissions aligned with source systems, using their governance and lineage controls where available.",
      };
    case "inference":
      return {
        ...shared,
        title: "Inference",
        subtitle: "AI models for each role",
        description:
          "Choose AI models for each role based on quality, privacy, performance and cost. Use local or cloud inference where supported by the agent environment you choose.",
        terms: [
          "Codex · Claude Code",
          "AI model selection",
          "Local & cloud inference",
          "Usage & cost",
        ],
        routineLabel: "AI model policy",
        routine:
          "Configure provider routes, budgets and retention around your requirements. Zero data retention is an option where the chosen provider, account and features support it.",
      };
    case "compute":
      return {
        ...shared,
        title: "Compute",
        subtitle: "Execution host, runner & sandbox",
        description:
          "Run agent sessions on a local machine, a VPS or cloud infrastructure. Choose the operating system, runner and isolation to fit the work. Linux is one option; access stays scoped to each project.",
        terms: [
          "Execution host & runner",
          "Isolation & sandboxing",
          "Scoped permissions",
          "Schedules & triggers",
        ],
        routineLabel: "Host routines",
        routine: module.hostRoutines + " Configured and checked in the selected environment.",
      };
    case "foundation":
      return {
        ...shared,
        title: "Foundation",
        subtitle: "Project & host configuration",
        description:
          "Prepare data access, tools and the execution environment for each project, with configuration your team can maintain and adapt.",
        terms: ["Repo config", "Agent definitions", "Launch config", "Access & checks"],
        routineLabel: "Configuration you own",
        routine:
          "Keep instructions, skills and configuration under version control where supported. Use native agent tools directly or an optional workspace such as T3 Code, with setup your team can maintain.",
      };
    case "access":
      return {
        ...shared,
        title: "Communication & decisions",
        subtitle: "You / your AI agent",
        description:
          "Brief the work, make decisions, review results and receive notifications through your chosen workspace or communication channel.",
        terms: ["Human input", "Project workspace", "Scoped access", "Decision handoffs"],
        routineLabel: "Your way into the work",
        routine:
          "Connect your team's communication channels where supported by your selected tools. Access and decision ownership stay explicit.",
      };
  }
}

/** Short rotating examples. Full terminology remains in the permanent detail panels. */
export function factorySurfaceCue(layer: FactoryLayerId, module: FactoryModuleId, index: number) {
  const cues: Record<FactoryLayerId, readonly string[]> = {
    ops: ["Orchestration", "Communication", "Routines", "Human input", "Review gates"],
    work: [
      ...workTags[module],
      ...(module === "powerbi"
        ? ["Data quality", "Publish"]
        : module === "defence"
          ? ["Investigate", "Permissions"]
          : module === "research"
            ? ["Investigate", "Review"]
            : ["Scoped tasks", "Deploy"]),
    ],
    context: ["Business data", "Metadata", "Permissions", "MCP · tools"],
    inference: ["Model choice", "Local & cloud", "Model routing", "Cost"],
    compute: ["Host · runner", "Isolation", "Linux", "Sandbox"],
    foundation: ["Project config"],
    access: ["Human input"],
  };
  return cues[layer][index % cues[layer].length];
}
