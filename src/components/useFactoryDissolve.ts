import { useEffect, useRef, useState, type RefObject } from "react";
import { createFactoryDissolve, type CopyPhase } from "../factory-copy-motion";

export function useFactoryDissolve<T>(
  element: RefObject<SVGSVGElement>,
  value: T,
  key: string,
  enabled: boolean,
) {
  const [frame, setFrame] = useState<{ value: T; phase: CopyPhase }>({ value, phase: "steady" });
  const latest = useRef({ value, key, enabled });
  const sync = useRef<() => void>();
  useEffect(() => {
    latest.current = { value, key, enabled };
    sync.current?.();
  }, [value, key, enabled]);
  useEffect(() => {
    const controller = createFactoryDissolve(
      latest.current.value,
      latest.current.key,
      (value, phase) => setFrame({ value, phase }),
    );

    const narrow = window.matchMedia("(max-width: 1040px)");
    let visible = true;
    const update = () => {
      const next = latest.current;
      controller.update(
        next.value,
        next.key,
        next.enabled && visible && !document.hidden && !narrow.matches,
      );
    };
    sync.current = update;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    if (element.current) observer.observe(element.current);

    narrow.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    update();
    return () => {
      controller.stop();
      observer.disconnect();
      sync.current = undefined;

      narrow.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, [element]);
  return frame;
}
