import { useEffect, useRef, useState } from "react";
import type { Scene } from "../scene";
import { playbackVideo, scenePoster } from "../media";
import { siteData } from "../site-data";
import { SceneMedia } from "./SceneMedia";

export function ScenePlayer({ scene, epoch }: { scene: Scene; epoch: number }) {
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const playerRef = useRef<HTMLVideoElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef(false);
  const playback = playbackVideo(scene, siteData.video.walkthrough);

  useEffect(() => {
    if (!started && returnFocus.current) {
      buttonRef.current?.focus({ preventScroll: true });
      returnFocus.current = false;
    }
  }, [started]);

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
    const source = playback.source;
    if (!video) return;
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
        if (!video.isConnected) return;
        returnFocus.current = true;
        setFailed(true);
        setStarted(false);
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
        aria-label={playback.title}
        aria-hidden={!started}
        tabIndex={started ? 0 : -1}
        onError={() => {
          returnFocus.current = document.activeElement === playerRef.current;
          setFailed(true);
          setStarted(false);
        }}
        onEnded={(event) => {
          returnFocus.current = document.activeElement === event.currentTarget;
          event.currentTarget.currentTime = 0;
          setStarted(false);
        }}
      />
      {!started && (
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
