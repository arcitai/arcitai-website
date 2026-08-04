import { useEffect, useState } from "react";

import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { Inquiry } from "../components/Inquiry";
import { Process } from "../components/Process";
import { Scope } from "../components/Scope";
import { copenhagenScene, formatCopenhagenClock } from "../scene";

function currentSceneState() {
  const now = new Date();
  return {
    clock: formatCopenhagenClock(now),
    scene: copenhagenScene(now, window.location.search),
  };
}

export function App() {
  const [sceneState, setSceneState] = useState(currentSceneState);

  useEffect(() => {
    const interval = window.setInterval(() => setSceneState(currentSceneState()), 30_000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header />
      <main id="main-content">
        <Hero clock={sceneState.clock} scene={sceneState.scene} />
        <Process scene={sceneState.scene} />
        <Scope />
        <Inquiry />
      </main>
      <Footer scene={sceneState.scene} />
    </>
  );
}
