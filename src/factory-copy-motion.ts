export type CopyPhase = "steady" | "out" | "in";
export const copyFadeOutMs = 650;
export const copyFadeInMs = 1600;

/** A replacement can only become visible after the old copy has reached zero.
 * Rapid changes replace the pending target, not the text currently fading out. */
export function createFactoryDissolve<T>(
  value: T,
  key: string,
  paint: (value: T, phase: CopyPhase) => void,
) {
  let current = { value, key },
    target = current;
  let phase: CopyPhase = "steady";
  let timer: ReturnType<typeof setTimeout> | undefined;
  let stopped = false;
  const clear = () => {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
  };
  return {
    update(value: T, key: string, animate: boolean) {
      if (stopped) return;
      target = { value, key };
      if (!animate) {
        clear();
        current = target;
        phase = "steady";
        paint(current.value, phase);
        return;
      }
      if (phase === "out" || current.key === key) return;
      clear();
      phase = "out";
      paint(current.value, phase);
      timer = setTimeout(() => {
        current = target;
        phase = "in";
        paint(current.value, phase);
        timer = setTimeout(() => {
          phase = "steady";
          timer = undefined;
        }, copyFadeInMs);
      }, copyFadeOutMs);
    },
    stop() {
      stopped = true;
      clear();
    },
  };
}
