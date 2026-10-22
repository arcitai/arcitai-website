import { useEffect, useRef, useState } from "react";
import "./hero-artwork.css";

const artwork = {
  mosaic: {
    poster: "/assets/hero-mosaic/data-mosaic-poster-v1.jpg",
    movie: "/assets/hero-mosaic/data-mosaic-loop-v1.mp4",
  },
  atelier: {
    poster: "/assets/hero-atelier/living-atelier-poster-v1.jpg",
    movie: "/assets/hero-atelier/living-atelier-loop-v1.mp4",
  },
};

/** Decorative, local-review artwork. The still remains usable if playback is unavailable. */
export function HeroArtwork({ variant = "mosaic" }: { variant?: keyof typeof artwork }) {
  const { poster, movie } = artwork[variant];
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const syncRef = useRef(() => {});

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (
      navigator as Navigator & { connection?: EventTarget & { saveData?: boolean } }
    ).connection;
    let visible = false;
    let disposed = false;
    let pending = false;
    let failed = false;

    const wanted = () =>
      !disposed &&
      visible &&
      !document.hidden &&
      !pausedRef.current &&
      !reduced.matches &&
      !connection?.saveData &&
      !failed;

    const sync = () => {
      if (!wanted()) {
        video.pause();
        return;
      }
      if (!video.getAttribute("src")) {
        video.src = movie;
        video.load();
      }
      if (pending || !video.paused) return;
      pending = true;
      void video
        .play()
        .catch(() => {
          if (!disposed && wanted()) {
            failed = true;
            container.classList.remove("is-ready");
          }
        })
        .finally(() => {
          pending = false;
          if (!wanted()) video.pause();
        });
    };
    const playing = () => {
      if (wanted()) container.classList.add("is-ready");
      else video.pause();
    };
    const error = () => {
      failed = true;
      container.classList.remove("is-ready");
    };
    const preference = () => {
      if (reduced.matches || connection?.saveData) {
        video.pause();
        video.removeAttribute("src");
        video.load();
        container.classList.remove("is-ready");
      }
      sync();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.08 },
    );
    syncRef.current = sync;
    observer.observe(container);
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", preference);
    connection?.addEventListener("change", preference);
    video.addEventListener("playing", playing);
    video.addEventListener("error", error);
    return () => {
      disposed = true;
      syncRef.current = () => {};
      observer.disconnect();
      video.pause();
      video.removeAttribute("src");
      video.load();
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", preference);
      connection?.removeEventListener("change", preference);
      video.removeEventListener("playing", playing);
      video.removeEventListener("error", error);
    };
  }, [movie]);

  const toggle = () => {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
    syncRef.current();
  };

  return (
    <div className="hero-artwork" ref={containerRef}>
      <div className="hero-artwork-picture" aria-hidden="true">
        <img src={poster} alt="" width="1376" height="768" />
        <video ref={videoRef} muted loop playsInline preload="none" tabIndex={-1} />
      </div>
      <button
        className="hero-artwork-toggle"
        type="button"
        aria-label={paused ? "Play background animation" : "Pause background animation"}
        onClick={toggle}
      >
        <svg viewBox="0 0 20 20" aria-hidden="true">
          {paused ? <path d="M6 4 16 10 6 16Z" /> : <path d="M6 4h3v12H6zM12 4h3v12h-3z" />}
        </svg>
      </button>
    </div>
  );
}
