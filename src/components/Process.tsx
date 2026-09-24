import { useEffect, useRef, useState } from "react";
import type { Scene } from "../scene";
import { scenePoster, sceneVideo } from "../media";
import { SceneMedia } from "./SceneMedia";

function ScenePlayer({ scene, epoch }: { scene: Scene; epoch: number }) {
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const playerRef = useRef<HTMLVideoElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const video = playerRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) video.pause();
    });
    observer.observe(video);
    const hidden = () => {
      if (document.hidden) video.pause();
    };
    document.addEventListener("visibilitychange", hidden);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", hidden);
      video.pause();
    };
  }, []);

  const play = () => {
    const video = playerRef.current;
    const source = sceneVideo(scene);
    if (!video || !source) return;
    setFailed(false);
    setStarted(true);
    if (!video.getAttribute("src") || failed) {
      video.src = source;
      video.load();
    }
    video.currentTime = 0;
    video.controls = true;
    void video
      .play()
      .then(() => video.focus())
      .catch(() => {
        setFailed(true);
        setStarted(false);
        buttonRef.current?.focus();
      });
  };

  return (
    <figure className="scene-player" data-started={started}>
      <SceneMedia scene={scene} epoch={epoch} suspended={started} />
      <video
        className="scene-player-video"
        ref={playerRef}
        playsInline
        preload="none"
        poster={scenePoster(scene)}
        controls={started}
        aria-label="Arc’IT AI landscape video"
        aria-hidden={!started}
        tabIndex={started ? 0 : -1}
        onError={() => {
          setFailed(true);
          setStarted(false);
        }}
      />
      {!started && sceneVideo(scene) && (
        <button
          ref={buttonRef}
          className="scene-play"
          type="button"
          aria-label={failed ? "Retry video" : "Play video"}
          onClick={play}
        >
          <span className="scene-play-badge" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7Z" />
            </svg>
            {failed ? "Retry video" : "Play video"}
          </span>
        </button>
      )}
      {failed && <figcaption role="status">The video couldn’t load. Please try again.</figcaption>}
    </figure>
  );
}

export function Process({ scene, epoch }: { scene: Scene; epoch: number }) {
  return (
    <section className="process section-shell" id="process" aria-labelledby="process-title">
      <div className="process-intro">
        <h2 id="process-title">Start with what you’ve built.</h2>
        <p>
          Maybe you’ve vibe-coded a promising demo. Maybe a developer built your MVP. I’m Gustav. I
          look at what it needs to do for your business, work through the gaps, and take care of the
          implementation — from the first review to the way it’s maintained.
        </p>
      </div>
      <ScenePlayer key={scene} scene={scene} epoch={epoch} />
    </section>
  );
}
