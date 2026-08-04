import { useEffect, useRef, useState } from "react";

import { siteData } from "../site-data";
import { Brand } from "./Brand";

const sections = [
  { id: "process", label: "Process" },
  { id: "scope", label: "Scope" },
  { id: "project", label: "Start" },
] as const;

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const activeSection = useActiveSection();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", dark ? "#171814" : "#f8f2e8");
  }, [dark]);

  useEffect(() => {
    if (menuRef.current) menuRef.current.inert = !menuOpen;

    const syncBody = () => {
      document.body.classList.toggle("menu-open", menuOpen && window.innerWidth <= 820);
    };
    syncBody();
    window.addEventListener("resize", syncBody);

    return () => {
      window.removeEventListener("resize", syncBody);
      document.body.classList.remove("menu-open");
    };
  }, [menuOpen]);

  useEffect(() => {
    const closeOutside = (event: MouseEvent) => {
      if (!menuOpen || !(event.target instanceof Node)) return;
      if (menuRef.current?.contains(event.target) || triggerRef.current?.contains(event.target))
        return;
      setMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (!menuOpen || event.key !== "Escape") return;
      setMenuOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener("click", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("click", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  return (
    <header className="site-header">
      <Brand />

      <nav className="site-nav" aria-label="Primary navigation">
        <button
          className="studio-trigger"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="studio-menu"
          onClick={() => setMenuOpen((open) => !open)}
          ref={triggerRef}
        >
          Offers <span aria-hidden="true" />
        </button>
        {sections.map((section) => (
          <a
            href={`#${section.id}`}
            aria-current={activeSection === section.id ? "location" : undefined}
            key={section.id}
          >
            {section.label}
          </a>
        ))}
      </nav>

      <button
        className="theme-toggle"
        type="button"
        aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
        onClick={() => setDark((current) => !current)}
      >
        ◐
      </button>

      <div className="studio-menu" id="studio-menu" aria-hidden={!menuOpen} ref={menuRef}>
        <div className="studio-paths">
          <a
            className="studio-path current"
            href="#top"
            aria-current="page"
            onClick={() => setMenuOpen(false)}
          >
            <span className="path-number">DONE FOR YOU</span>
            <strong>Arc'IT AI</strong>
            <small>Business understanding carried into working software.</small>
            <span className="path-action">Current offer</span>
          </a>
          <a
            className="studio-path"
            href={siteData.links.onlinesourdough}
            onClick={() => setMenuOpen(false)}
          >
            <span className="path-number">DIY + DONE WITH YOU</span>
            <strong>onlinesourdough</strong>
            <small>Learn the method, use the resources, or build with direct guidance.</small>
            <span className="path-action">Explore offer ↗</span>
          </a>
        </div>
      </div>
    </header>
  );
}

function useActiveSection() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const update = () => {
      const marker = Math.min(window.innerHeight * 0.32, 260);
      let next = "";
      sections.forEach(({ id }) => {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= marker) next = id;
      });
      setActiveSection((current) => (current === next ? current : next));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return activeSection;
}
