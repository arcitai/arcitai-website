import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./routes/App";
import "./styles.css";
import "./family/family.css";
import "./family/site.css";

// Preserve links shared before the Agentic Systems rebrand.
const legacyAnchors: Record<string, string> = {
  "#factory": "#agentic-system",
  "#factory-visual": "#agentic-system-visual",
};
const currentAnchor = legacyAnchors[window.location.hash];
if (currentAnchor) window.history.replaceState(null, "", currentAnchor);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
