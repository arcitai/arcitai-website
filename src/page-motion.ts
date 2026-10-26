import { useEffect } from "react";

export function usePageMotion() {
  useEffect(() => {
    const root = document.documentElement;

    const sync = () => {
      root.classList.add("motion-enabled");
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
    document
      .querySelectorAll(".motif, .hero-mark, .stack-construction")
      .forEach((el) => observer.observe(el));
    sync();

    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();

      document.removeEventListener("visibilitychange", sync);
    };
  }, []);
}
