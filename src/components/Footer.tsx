import type { CSSProperties } from "react";
import type { Scene } from "../scene";
import { scenePoster } from "../media";
import { siteData } from "../site-data";

export function Footer({ scene }: { scene: Scene }) {
  return (
    <footer
      className="site-footer"
      style={{ "--scene": `url("${scenePoster(scene)}")` } as CSSProperties}
    >
      <h2>
        Business first.
        <br />
        Security built in.
      </h2>
      <nav aria-label="External links">
        <a href={siteData.links.email}>Email ↗</a>
        <a href={siteData.links.onlinesourdough} target="_blank" rel="noopener noreferrer">
          onlinesourdough ↗
        </a>
        <a href="https://github.com/arcitai" target="_blank" rel="noopener noreferrer">
          GitHub ↗
        </a>
      </nav>
    </footer>
  );
}
