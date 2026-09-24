import { useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { Inquiry } from "../components/Inquiry";
import { Process } from "../components/Process";
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
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header theme={theme} onThemeChange={toggleTheme} />
      <main id="main-content" tabIndex={-1}>
        <Hero scene={scene} epoch={epoch} />
        <Process scene={scene} epoch={epoch} />
        <Scope />
        <Inquiry />
      </main>
      <Footer scene={scene} />
    </>
  );
}
