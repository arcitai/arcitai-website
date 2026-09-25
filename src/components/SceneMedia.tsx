import { useEffect, useRef } from "react";
import { ambientPhase, scenePoster, sceneVideo } from "../media";
import type { Scene } from "../scene";

export function SceneMedia({
  scene,
  epoch,
  className = "",
  suspended = false,
}: {
  scene: Scene;
  epoch: number;
  className?: string;
  suspended?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    let visible = false,
      disposed = false,
      pending = false,
      failed = false;
    const source = sceneVideo(scene);
    video.classList.remove("is-ready");
    if (!source) return;
    const wanted = () =>
      !disposed &&
      visible &&
      !document.hidden &&
      !reduced.matches &&
      !connection?.saveData &&
      !suspended &&
      !failed;
    const sync = () => {
      if (!wanted()) {
        video.pause();
        return;
      }
      if (video.getAttribute("src") !== source) {
        video.src = source;
        video.load();
      }
      if (pending || !video.paused) return;
      if (Number.isFinite(video.duration))
        video.currentTime = ambientPhase(performance.now(), epoch, video.duration);
      pending = true;
      void video
        .play()
        .catch(() => {
          if (!disposed && wanted()) {
            failed = true;
            video.classList.remove("is-ready");
          }
        })
        .finally(() => {
          pending = false;
        });
    };
    const playing = () => {
      if (wanted()) video.classList.add("is-ready");
      else video.pause();
    };
    const metadata = () => {
      if (wanted()) video.currentTime = ambientPhase(performance.now(), epoch, video.duration);
    };
    const error = () => {
      failed = true;
      video.classList.remove("is-ready");
    };
    const preference = () => {
      if (reduced.matches) {
        video.pause();
        video.removeAttribute("src");
        video.load();
        video.classList.remove("is-ready");
      }
      sync();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.05 },
    );
    observer.observe(container);
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", preference);
    video.addEventListener("playing", playing);
    video.addEventListener("loadedmetadata", metadata);
    video.addEventListener("error", error);
    return () => {
      disposed = true;
      observer.disconnect();
      video.pause();
      video.removeAttribute("src");
      video.load();
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", preference);
      video.removeEventListener("playing", playing);
      video.removeEventListener("loadedmetadata", metadata);
      video.removeEventListener("error", error);
    };
  }, [scene, epoch, suspended]);

  return (
    <div
      className={`scene-media ${className}`}
      data-scene={scene}
      ref={containerRef}
      aria-hidden="true"
    >
      <img src={scenePoster(scene)} alt="" width="1280" height="720" />
      <video ref={videoRef} muted loop playsInline preload="none" tabIndex={-1} />
    </div>
  );
}
