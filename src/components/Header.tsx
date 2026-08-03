import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { siteData } from "../site-data";
import { Wordmark } from "./Wordmark";

type Theme = "dark" | "light";

function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    return (window.localStorage.getItem(siteData.themeStorageKey) as Theme | null) ?? "light";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(siteData.themeStorageKey, theme);
  }, [theme]);

  return { theme, setTheme };
}

export function Header() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="logo-link" href="#top" aria-label={`${siteData.brand} home`}>
          <Wordmark compact />
        </a>
        <a className="brand-link" href="#top" aria-label={`${siteData.brand} home`}>
          {siteData.brand}
        </a>
        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="theme-toggle"
          aria-label="Toggle color theme"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
