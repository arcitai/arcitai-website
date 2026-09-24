import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

export function initialTheme(): Theme {
  const requested = new URLSearchParams(window.location.search).get("theme");
  if (requested === "light" || requested === "dark") return requested;
  try {
    const stored = localStorage.getItem("arcitai-theme");
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* A blocked preference store must not prevent use of the page. */
  }
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#171814" : "#f8f2e8");
    try {
      localStorage.setItem("arcitai-theme", theme);
    } catch {
      /* Preference remains usable for this visit. */
    }
  }, [theme]);
  return {
    theme,
    toggleTheme: () => setTheme((current) => (current === "light" ? "dark" : "light")),
  };
}
