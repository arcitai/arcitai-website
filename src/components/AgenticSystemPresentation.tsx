import { AgenticSystemStack, type AgenticSystemPreviewDesign } from "./AgenticSystemStack";
import { AgenticSystemChannels, type AgenticSystemChannelLayout } from "./AgenticSystemChannels";
import { AgenticSystemAgents } from "./AgenticSystemAgents";
import "./agentic-system-variants.css";

export function AgenticSystemPresentation({
  layout = "bridge",
}: {
  layout?: AgenticSystemChannelLayout;
}) {
  const design: AgenticSystemPreviewDesign = {
    id: layout,
    facades: {
      ops: "Direction",
      work: "Delivery",
      context: "Business context",
      inference: "AI models",
      compute: "Execution",
    },
    Channels: AgenticSystemChannels,
    Agents: AgenticSystemAgents,
  };
  return <AgenticSystemStack design={design} />;
}
