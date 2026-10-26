import { useEffect, useRef, useState } from "react";
import { siteData } from "../site-data";
import type { Theme } from "../theme";
import { ArcitBadge } from "./ArcitMark";
import { useNavigationOverlay } from "../use-navigation-overlay";

/** Matches the CSS breakpoint where the compact header and its menu panel take over. */
const mobileHeader = "(max-width: 760px)";

export function Header({ theme, onThemeChange }: { theme: Theme; onThemeChange: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  useNavigationOverlay(panelOpen, overlayRef);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const newsletterRef = useRef<HTMLAnchorElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const home = window.location.pathname === "/";
  const newsletter = window.location.pathname.startsWith("/newsletter");

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

  // The mobile overlay contains navigation and keeps the page behind it inactive.
  useEffect(() => {
    if (!panelOpen) return;
    const closeOutside = (event: MouseEvent | FocusEvent) => {
      if (!(event.target instanceof Node)) return;
      if (!overlayRef.current?.contains(event.target)) setPanelOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setPanelOpen(false);
      toggleRef.current?.focus();
    };
    const onPopState = () => setPanelOpen(false);
    window.addEventListener("popstate", onPopState);
    document.addEventListener("pointerdown", closeOutside, { passive: true });
    document.addEventListener("focusin", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("popstate", onPopState);
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("focusin", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [panelOpen]);

  // Each layout owns one navigation control; crossing the breakpoint closes both.
  useEffect(() => {
    const layout = matchMedia(mobileHeader);
    const close = () => {
      setMenuOpen(false);
      setPanelOpen(false);
    };
    layout.addEventListener("change", close);
    return () => layout.removeEventListener("change", close);
  }, []);

  return (
    <header className="site-header">
      <div
        className="navigation-overlay"
        ref={overlayRef}
        role={panelOpen ? "dialog" : undefined}
        aria-modal={panelOpen ? true : undefined}
        aria-label={panelOpen ? "Site navigation" : undefined}
      >
        <div className="header-inner">
          <a
            className="wordmark"
            href="/"
            aria-label="Arc’IT AI home"
            onClick={() => setPanelOpen(false)}
          >
            <ArcitBadge className="wordmark-icon" />
            <span>Arc’IT AI</span>
          </a>
          <nav className="header-nav" aria-label="Primary navigation">
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
              Offers
            </button>
          </nav>
          <div className="header-utilities">
            <a className="header-newsletter" ref={newsletterRef} href="/newsletter/">
              Newsletter
            </a>
            <button
              className="theme-toggle"
              type="button"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              onClick={onThemeChange}
            >
              <span className="theme-toggle-icon" aria-hidden="true" />
            </button>
            <button
              className="menu-toggle"
              type="button"
              aria-label={panelOpen ? "Close menu" : "Open menu"}
              aria-expanded={panelOpen}
              aria-controls="site-menu"
              ref={toggleRef}
              onClick={() => setPanelOpen((open) => !open)}
            >
              <span className="menu-toggle-icon" aria-hidden="true">
                <span />
              </span>
            </button>
          </div>
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
                newsletterRef.current?.focus();
              }
            }}
          >
            <a href="/#scope" aria-current={home ? "page" : undefined}>
              <span className="eyebrow">Mid-sized &amp; large organisations</span>
              <strong className="brand-arcitai">Arc’IT AI</strong>
              <span>One-off consultation and custom data &amp; AI projects.</span>
            </a>
            <a href={siteData.links.onlinesourdough} target="_blank" rel="noopener noreferrer">
              <span className="eyebrow">Solo businesses &amp; small teams</span>
              <strong className="brand-onlinesourdough">onlinesourdough</strong>
              <span>
                A hybrid programme combining 1:1 collaboration, practical work and resources.
              </span>
            </a>
          </div>
        </div>
        {/* Ordinary links in a disclosure panel; Offers routes are inline, not a nested popover. */}
        <nav
          className="site-menu"
          id="site-menu"
          aria-label="Site menu"
          hidden={!panelOpen}
          ref={panelRef}
          onClick={(event) => {
            const link =
              event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a") : null;
            if (!link) return;
            setPanelOpen(false);
            if (link.hash && link.pathname === window.location.pathname) {
              const target = document.getElementById(link.hash.slice(1));
              if (target) {
                requestAnimationFrame(() => {
                  target.tabIndex = -1;
                  target.focus({ preventScroll: true });
                });
              }
            }
          }}
        >
          <ul className="site-menu-links">
            <li>
              <span className="site-menu-label">Offers</span>
              <ul className="site-menu-offers" aria-label="Offer routes">
                <li>
                  <a href="/#scope" aria-current={home ? "page" : undefined}>
                    <span className="site-menu-brand">
                      <span className="brand-name-token" data-brand-name="arcitai">
                        Arc’IT AI
                      </span>
                    </span>
                    <span>Mid-sized &amp; large organisations</span>
                  </a>
                </li>
                <li>
                  <a
                    href={siteData.links.onlinesourdough}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="site-menu-brand">
                      <span className="brand-name-token" data-brand-name="onlinesourdough">
                        onlinesourdough
                      </span>{" "}
                      <span aria-hidden="true">↗</span>
                    </span>
                    <span>Solo businesses &amp; small teams</span>
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <a href="/#factory">Factory</a>
            </li>
            <li>
              <a href="/#current-work">Open-source work</a>
            </li>
            <li>
              <a href="/newsletter/" aria-current={newsletter ? "page" : undefined}>
                Newsletter
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
