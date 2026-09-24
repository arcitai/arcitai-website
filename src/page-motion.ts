import { useEffect } from "react";

export function usePageMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      root.classList.toggle("motion-enabled", !reduced.matches);
      root.classList.toggle("page-hidden", document.hidden);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
          if (entry.isIntersecting) entry.target.classList.add("has-entered");
        }
      },
      { threshold: 0.15 },
    );
    document.querySelectorAll(".motif, .hero-mark").forEach((el) => observer.observe(el));
    sync();
    reduced.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      reduced.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);
}
