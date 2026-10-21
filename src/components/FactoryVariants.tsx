import { useState } from "react";
import { FactoryPresentation } from "./FactoryPresentation";
import type { FactoryChannelLayout } from "./FactoryChannels";
import "./factory-variants.css";

const variations: { id: FactoryChannelLayout; name: string; note: string }[] = [
  {
    id: "dock",
    name: "Control-room dock",
    note: "En samlet kanalstation ved siden af control roomet.",
  },
  {
    id: "bridge",
    name: "Open bridge",
    note: "Kanaler på en åben bro med én fælles forbindelse ind.",
  },
  {
    id: "nodes",
    name: "Channel constellation",
    note: "Tre ligeværdige kanaler, som mødes uden for fabrikken.",
  },
  {
    id: "rail",
    name: "Access rail",
    note: "Kanaler langs fabrikkens yderside. Omarchy vises som Linux-eksempel i Compute.",
  },
  {
    id: "quiet",
    name: "Quiet connection",
    note: "En neutral kommunikationsindgang. Platformseksemplerne ligger i sidepanelet.",
  },
];

export default function FactoryVariants() {
  const [choice, setChoice] = useState(() => {
    const value = new URLSearchParams(window.location.search).get("factoryView");
    return variations.findIndex((item, index) => item.id === value || String(index + 1) === value) <
      0
      ? 1
      : variations.findIndex((item, index) => item.id === value || String(index + 1) === value);
  });
  const current = variations[choice];
  function choose(index: number) {
    setChoice(index);
    const url = new URL(window.location.href);
    url.searchParams.set("factoryView", String(index + 1));
    window.history.replaceState(null, "", url);
  }
  return (
    <>
      <div className="factory-variant-picker">
        <p>Fem lokale designvariationer</p>
        <div className="factory-variant-options" role="group" aria-label="Vælg Factory-design">
          {variations.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={choice === index}
              onClick={() => choose(index)}
            >
              <span>0{index + 1}</span>
              {item.name}
            </button>
          ))}
        </div>
        <div className="factory-variant-caption">
          <p aria-live="polite">{current.note}</p>
        </div>
      </div>
      <FactoryPresentation layout={current.id} />
    </>
  );
}
