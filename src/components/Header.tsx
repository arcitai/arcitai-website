import { useEffect, useRef, useState } from "react";
import { siteData } from "../site-data";
import type { Theme } from "../theme";

const sections = [
  { id: "process", label: "Process" },
  { id: "scope", label: "Scope" },
  { id: "project", label: "Start" },
] as const;

export function Header({ theme, onThemeChange }: { theme: Theme; onThemeChange: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const update = () => {
      const marker = Math.min(innerHeight * 0.32, 260);
      let next = "";
      for (const { id } of sections) {
        if ((document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= marker)
          next = id;
      }
      setActiveSection(next);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOutside = (event: MouseEvent | FocusEvent) => {
      if (!(event.target instanceof Node)) return;
      if (!menuRef.current?.contains(event.target) && !triggerRef.current?.contains(event.target))
        setMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("click", closeOutside);
    document.addEventListener("focusin", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("click", closeOutside);
      document.removeEventListener("focusin", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="wordmark" href="#top" aria-label="Arc’IT AI home">
          Arc’IT AI
        </a>
        <nav aria-label="Primary navigation" ref={navRef}>
          <button
            className="offers-trigger"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="offers-menu"
            ref={triggerRef}
            onClick={() => setMenuOpen((open) => !open)}
            onKeyDown={(event) => {
              if (menuOpen && event.key === "Tab" && !event.shiftKey) {
                event.preventDefault();
                menuRef.current?.querySelector("a")?.focus();
              }
            }}
          >
            Offers <span aria-hidden="true">⌄</span>
          </button>
          {sections.map(({ id, label }) => (
            <a
              key={id}
              className={id === "project" ? undefined : "desktop-link"}
              href={`#${id}`}
              aria-current={activeSection === id ? "location" : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
        <button
          className="theme-toggle"
          type="button"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          aria-pressed={theme === "dark"}
          onClick={onThemeChange}
        >
          <span className="theme-toggle-icon" aria-hidden="true" />
        </button>
        <div
          className="offers-menu"
          id="offers-menu"
          hidden={!menuOpen}
          ref={menuRef}
          onClick={() => setMenuOpen(false)}
          onKeyDown={(event) => {
            const links = menuRef.current?.querySelectorAll("a");
            if (!links || event.key !== "Tab") return;
            if (event.shiftKey && event.target === links[0]) {
              event.preventDefault();
              triggerRef.current?.focus();
            } else if (!event.shiftKey && event.target === links[links.length - 1]) {
              event.preventDefault();
              [...(navRef.current?.querySelectorAll("a") ?? [])]
                .find((link) => link.getClientRects().length > 0)
                ?.focus();
            }
          }}
        >
          <a href="#scope" aria-current="page">
            <span className="eyebrow">Done for you</span>
            <strong>Arc’IT AI</strong>
            <span>Business understanding carried into working software.</span>
          </a>
          <a href={siteData.links.onlinesourdough} target="_blank" rel="noopener noreferrer">
            <span className="eyebrow">DIY + done with you</span>
            <strong>onlinesourdough</strong>
            <span>Learn the method, use the resources, or build with direct guidance.</span>
          </a>
        </div>
      </div>
    </header>
  );
}
