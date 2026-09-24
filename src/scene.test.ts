import { describe, expect, it } from "vitest";

import {
  copenhagenScene,
  forcedScene,
  formatCopenhagenClock,
  sceneForHour,
  sceneForTheme,
} from "./scene";

describe("scene selection", () => {
  it("uses night in dark theme and a daylight scene in light theme", () => {
    const morning = new Date("2026-09-24T05:00:00Z");
    expect(sceneForTheme(morning, "", "light")).toBe("morning");
    expect(sceneForTheme(morning, "", "dark")).toBe("night");
    expect(sceneForTheme(new Date("2026-09-24T22:00:00Z"), "", "light")).toBe("day");
  });

  it("keeps explicit review scenes independent of theme", () => {
    for (const scene of ["morning", "day", "evening", "night"] as const) {
      expect(sceneForTheme(new Date(), `?scene=${scene}`, "dark")).toBe(scene);
    }
  });
  it.each([
    [0, "night"],
    [4, "night"],
    [5, "morning"],
    [9, "morning"],
    [10, "day"],
    [17, "day"],
    [18, "evening"],
    [21, "evening"],
    [22, "night"],
    [23, "night"],
  ] as const)("maps hour %s to %s", (hour, expected) => {
    expect(sceneForHour(hour)).toBe(expected);
  });

  it("accepts only the four forced review scenes", () => {
    expect(forcedScene("?scene=morning")).toBe("morning");
    expect(forcedScene("?scene=day")).toBe("day");
    expect(forcedScene("?scene=evening")).toBe("evening");
    expect(forcedScene("?scene=night")).toBe("night");
    expect(forcedScene("?scene=archive")).toBeNull();
  });

  it("lets a valid review scene override Copenhagen time", () => {
    const middayInCopenhagen = new Date("2026-08-03T10:00:00Z");
    expect(copenhagenScene(middayInCopenhagen, "?scene=night")).toBe("night");
  });

  it("formats the clock in Europe/Copenhagen", () => {
    expect(formatCopenhagenClock(new Date("2026-01-15T10:05:00Z"))).toBe("DENMARK / 11:05");
    expect(formatCopenhagenClock(new Date("2026-07-15T10:05:00Z"))).toBe("DENMARK / 12:05");
  });
});
