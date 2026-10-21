import { FactoryStack, type FactoryPreviewDesign } from "./FactoryStack";
import { FactoryChannels, type FactoryChannelLayout } from "./FactoryChannels";
import { FactoryAgents } from "./FactoryAgents";
import "./factory-variants.css";

export function FactoryPresentation({ layout = "bridge" }: { layout?: FactoryChannelLayout }) {
  const design: FactoryPreviewDesign = {
    id: layout,
    facades: {
      ops: "Direction",
      work: "Delivery",
      context: "Business context",
      inference: "AI models",
      compute: "Execution",
    },
    Channels: FactoryChannels,
    Agents: FactoryAgents,
  };
  return <FactoryStack design={design} />;
}
