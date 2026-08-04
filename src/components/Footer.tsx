import type { Scene } from "../scene";
import { siteData } from "../site-data";
import { Brand } from "./Brand";

export function Footer({ scene }: { scene: Scene }) {
  return (
    <footer className="site-footer" id="footer" data-scene={scene}>
      <div className="footer-content">
        <Brand footer />

        <nav aria-label="Footer navigation">
          <a href="#process">Process</a>
          <a href="#scope">Scope</a>
          <a href="#project">Start</a>
          <a href={siteData.links.onlinesourdough}>onlinesourdough ↗</a>
          <a href={siteData.links.gustavOnline}>gustavonline ↗</a>
        </nav>

        <p>Questions? Send the rough version.</p>
        <a className="footer-email" href={siteData.links.email}>
          hello@arcitai.com
        </a>

        <div className="footer-meta">
          <span>BUSINESS &gt; SOFTWARE</span>
          <span>DENMARK / 2026</span>
        </div>
      </div>
    </footer>
  );
}
