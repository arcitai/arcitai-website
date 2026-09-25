import { useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { Inquiry } from "../components/Inquiry";
import { NewsletterContent } from "../family/Family";
import { Scope } from "../components/Scope";
import { sceneForTheme } from "../scene";
import { useTheme } from "../theme";
import { usePageMotion } from "../page-motion";

export function App() {
  const { theme, toggleTheme } = useTheme();
  const [now, setNow] = useState(() => new Date());
  const [epoch] = useState(() => performance.now());
  const scene = sceneForTheme(now, window.location.search, theme);
  usePageMotion();
  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(interval);
  }, []);
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  const newsletter = path.startsWith("/newsletter");
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header theme={theme} onThemeChange={toggleTheme} />
      <main id="main-content" tabIndex={-1}>
        {newsletter ? (
          <NewsletterContent brand="arcitai" />
        ) : path === "/project" ? (
          <Inquiry />
        ) : (
          <>
            <Hero scene={scene} epoch={epoch} />
            <Scope />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
