export type FactoryChannelLayout = "dock" | "bridge" | "nodes" | "rail" | "quiet";

const channels = [
  { name: "Microsoft Teams", file: "teams.svg" },
  { name: "Slack", file: "slack.png" },
];

export type FactoryChannelProps = {
  layout: FactoryChannelLayout;
  select: () => void;
  controls: string;
  selected: boolean;
};

export function FactoryChannels({ layout, select, controls, selected }: FactoryChannelProps) {
  const routes: Record<FactoryChannelLayout, string> = {
    dock: "M480 66V86H390L346 108",
    bridge: "M470 38V48M428 60L346 101",
    nodes: "M442 30V86H390M486 52V86H390M530 30V86H390L346 108",
    rail: "M500 20V108H390L346 108",
    quiet: "M480 78V86H390L346 108",
  };
  return (
    <div className="factory-channels" data-layout={layout}>
      <svg
        className="factory-channel-routes"
        viewBox="0 0 560 700"
        aria-hidden="true"
        focusable="false"
      >
        <path d={routes[layout]} />
        {layout === "bridge" ? (
          <>
            <rect className="factory-channel-hub" x="428" y="48" width="84" height="24" rx="12" />
            <circle cx="346" cy="101" r="2.5" />
          </>
        ) : (
          <circle cx="390" cy={layout === "rail" ? 108 : 86} r="3" />
        )}
      </svg>
      <button
        className="factory-channel-entry"
        type="button"
        onClick={select}
        aria-controls={controls}
        aria-pressed={selected}
        aria-label={
          layout === "bridge"
            ? "You / your AI agent: brief, decide, review and get notified. Channel examples: Microsoft Teams and Slack."
            : "Your channels: Microsoft Teams and Slack"
        }
      >
        {layout === "bridge" ? (
          <span className="factory-bridge-person">
            <strong>You / your AI agent</strong>
            <span>
              Brief · decide · review
              <br />
              Get notified
            </span>
          </span>
        ) : (
          <span className="factory-channel-heading">Your channels</span>
        )}
        <span className="factory-channel-marks" aria-hidden="true">
          {layout === "quiet" ? (
            <svg className="factory-chat-mark" viewBox="0 0 24 24">
              <path d="M4 4H20V16H11L6 20V16H4Z" />
              <path d="M8 8H16M8 12H13" />
            </svg>
          ) : (
            channels.map((channel) => (
              <img
                key={channel.name}
                src={`/assets/factory-tools/${channel.file}`}
                alt=""
                title={channel.name}
                width="22"
                height="22"
              />
            ))
          )}
        </span>
      </button>
    </div>
  );
}
