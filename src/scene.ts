export const sceneNames = ["morning", "day", "evening", "night"] as const;

export type Scene = (typeof sceneNames)[number];

const copenhagenClock = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Copenhagen",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const copenhagenHour = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Copenhagen",
  hour: "2-digit",
  hour12: false,
});

export function sceneForHour(hour: number): Scene {
  if (hour >= 5 && hour < 10) return "morning";
  if (hour >= 10 && hour < 18) return "day";
  if (hour >= 18 && hour < 22) return "evening";
  return "night";
}

export function forcedScene(search: string): Scene | null {
  const requested = new URLSearchParams(search).get("scene");
  return sceneNames.find((scene) => scene === requested) ?? null;
}

export function copenhagenScene(now: Date, search = "") {
  const hour = Number(copenhagenHour.format(now));
  return forcedScene(search) ?? sceneForHour(hour);
}

export function formatCopenhagenClock(now: Date) {
  return `DENMARK / ${copenhagenClock.format(now)}`;
}
