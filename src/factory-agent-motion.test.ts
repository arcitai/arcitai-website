import { describe, expect, it } from "vitest";
import {
  agentHomes,
  agentLift,
  agentSceneFrame,
  agentHelperFrames,
  agentParcel,
  codexFrame,
  createAgentScene,
  nextAgentScene,
} from "./factory-agent-motion";
import { factoryModules, factoryPanelIds } from "./factory-stack-data";
const names = ["codex", "claude"] as const;

// Exhaustive choreography sweeps must also complete on shared release runners.
describe("Factory team choreography", { timeout: 30000 }, () => {
  // Exhaustive scene sampling needs more time on shared CI runners.
  it("lets both identities work on both sides, crossing through roof doors without teleporting", () => {
    const helperSides = { codex: new Set<boolean>(), claude: new Set<boolean>() };
    for (let seed = 0; seed < 12; seed++) {
      let scene = createAgentScene("work", "software", agentHomes(seed), true, 0, seed);
      const sides = { codex: new Set<boolean>(), claude: new Set<boolean>() };
      for (let turn = 0; turn < 20; turn++) {
        scene.helpers.forEach((helper) => helperSides[helper.name].add(helper.left));
        let previous = agentSceneFrame(scene, 0);
        for (let t = 0; t < scene.duration; t += 0.1) {
          const current = agentSceneFrame(scene, t);
          for (const name of names) {
            const p = current[name],
              q = previous[name];
            expect([0, 1]).toContain(p.opacity);
            expect(Math.hypot(p.x - q.x, p.y - q.y)).toBeLessThan(20);
            if (!p.opacity) {
              expect(p.floor).toBe(0);
              expect(p.x).toBeGreaterThanOrEqual(232);
              expect(p.x).toBeLessThanOrEqual(340);
            }
            if (p.opacity && p.action === "work") sides[name].add(p.x < 280);
          }
          const { codex, claude } = current;
          if (codex.opacity && claude.opacity)
            expect(Math.abs(codex.x - claude.x) >= 29 || Math.abs(codex.y - claude.y) >= 29).toBe(
              true,
            );
          previous = current;
        }
        scene = nextAgentScene(scene, agentSceneFrame(scene, scene.duration), false);
      }
      for (const name of names) expect(sides[name].size).toBe(2);
    }
    for (const name of names) expect(helperSides[name].size).toBe(2);
  }, 30000);
  it("gives the two workers separate floors and work rhythms, with only occasional handoffs", () => {
    let ticks = 0,
      separate = 0,
      workingApart = 0,
      parcelTicks = 0,
      collaborations = 0,
      scenes = 0;
    for (let seed = 0; seed < 24; seed++) {
      let scene = createAgentScene("work", "software", agentHomes(seed), true, 0, seed);
      for (let turn = 0; turn < 18; turn++) {
        scenes++;
        if (scene.collaborative) collaborations++;
        expect(agentSceneFrame(scene, scene.arriveAt + 0.1)[scene.leader].action).toBe("work");
        expect(scene.installAt).toBeGreaterThan(scene.arriveAt + 6);
        for (let t = 0; t < scene.duration; t += 0.2) {
          const { codex, claude } = agentSceneFrame(scene, t);
          ticks++;
          if (Math.abs(codex.floor - claude.floor) > 0.5) {
            separate++;
            if (codex.action === "work" && claude.action === "work") workingApart++;
          }
          if (agentParcel(scene, t)) {
            parcelTicks++;
            expect(scene.collaborative).toBe(true);
            expect(codex.floor).toBe(claude.floor);
          }
        }
        expect(agentSceneFrame(scene, Infinity)).toEqual(agentSceneFrame(scene, scene.duration));
        scene = nextAgentScene(scene, agentSceneFrame(scene, scene.duration), false);
      }
    }
    // Guard the actual regression: a repeated, same-floor parcel exchange.
    expect(separate / ticks).toBeGreaterThan(0.7);
    expect(workingApart / ticks).toBeGreaterThan(0.18);
    expect(collaborations / scenes).toBeLessThan(0.2);
    expect(parcelTicks / ticks).toBeLessThan(0.04);
    expect(parcelTicks).toBeGreaterThan(0);
  });
  it("keeps walkers on their floor and riders on supporting platforms, including rapid retargets", () => {
    let poses = agentHomes();
    for (let i = 0; i < 50; i++) {
      const scene = createAgentScene(
        factoryPanelIds[i % factoryPanelIds.length],
        factoryModules[i % 4].id,
        poses,
      );
      const first = agentSceneFrame(scene, 0);
      for (const name of names) {
        expect(first[name].x).toBeCloseTo(poses[name].x, 8);
        expect(first[name].y).toBeCloseTo(poses[name].y, 8);
      }
      for (let t = 0; t <= scene.duration; t += 0.04)
        for (const p of Object.values(agentSceneFrame(scene, t))) {
          expect(p.x).toBeGreaterThanOrEqual(108);
          expect(p.x).toBeLessThanOrEqual(462);
          if (Math.abs(p.floor - Math.round(p.floor)) > 0.001) {
            expect(agentLift(p)).toEqual({ x: p.x, y: p.y });
            expect(p.action).toBe("ride");
          } else if (!agentLift(p) && p.x >= 128 && p.x <= 438) {
            // Feet remain on the isometric slab. Side platforms cover the two short landings.
            expect(
              Math.abs(p.x - 280) / 160 + Math.abs(p.y - (160 + p.floor * 96)) / 80,
            ).toBeLessThanOrEqual(1.001);
          }
        }
      poses = agentSceneFrame(scene, scene.duration * (i % 2 ? 0.21 : 0.47));
    }
  });
  it("varies reloads and continues unfinished routes without resetting both agents at the boundary", () => {
    const beginnings = new Set<string>(),
      counts = new Set<number>(),
      modules = new Set<string>();
    let carriedWork = 0;
    for (let seed = 0; seed < 12; seed++) {
      let scene = createAgentScene(
        "work",
        factoryModules[seed % 3].id,
        agentHomes(seed),
        true,
        0,
        seed,
      );
      beginnings.add(`${scene.module}:${scene.leader}`);
      for (let turn = 0; turn < 30; turn++) {
        modules.add(scene.module);
        for (let t = 0; t < scene.duration; t += 0.2)
          counts.add(
            2 + agentHelperFrames(scene, t).filter((helper) => helper.pose.opacity === 1).length,
          );
        expect(
          agentHelperFrames(scene, scene.duration).every((helper) => helper.pose.opacity === 0),
        ).toBe(true);
        const end = agentSceneFrame(scene, scene.duration),
          next = nextAgentScene(scene, end, false);
        const start = agentSceneFrame(next, 0);
        for (const name of names) {
          expect(start[name].x).toBe(end[name].x);
          expect(start[name].y).toBe(end[name].y);
          if (scene.tracks[name].at(-1)!.at > scene.duration)
            expect(start[name].action).toBe(end[name].action);
          if (end[name].action === "work") {
            carriedWork++;
            expect(start[name].phase).toBeCloseTo(end[name].phase, 8);
          }
        }
        expect(next.duration).toBeGreaterThan(10);
        expect(next.duration).toBeLessThan(60);
        scene = next;
      }
    }
    expect(carriedWork).toBeGreaterThan(50);
    expect(beginnings.size).toBe(6);
    expect([...counts].sort()).toEqual([2, 3, 4, 5, 6]);
    expect([...modules].sort()).toEqual(["defence", "powerbi", "software"]);
  });
  it("keeps the core pair solid and staggers their departures instead of restarting them in unison", () => {
    for (let seed = 0; seed < 6; seed++) {
      const scene = createAgentScene("work", "software", agentHomes(seed), true, 0, seed);
      const early = agentSceneFrame(scene, 0.6);
      const reviewer = scene.leader === "codex" ? "claude" : "codex";
      expect(early[scene.leader].action).not.toBe("idle");
      expect(early[reviewer].action).toBe("idle");
      for (let t = 0; t < scene.duration; t += 0.1)
        for (const p of Object.values(agentSceneFrame(scene, t))) expect(p.opacity).toBe(1);
      expect(scene.duration - scene.installAt).toBeGreaterThanOrEqual(3.4);
    }
  });
  it("dispatches helpers from roof doors and brings them home, without fades, collisions or unsupported rides", () => {
    expect(createAgentScene("work", "software", undefined, false, 1, 9).helpers).toHaveLength(0);
    const scene = createAgentScene("work", "software", undefined, false, 9, 1);
    expect(scene.helpers).toHaveLength(4);
    const appearances = new Map<number, number>();
    for (let t = 0; t < scene.duration; t += 0.04) {
      const helpers = agentHelperFrames(scene, t);
      helpers.forEach((helper, i) => {
        const p = helper.pose;
        expect([0, 1]).toContain(p.opacity);
        if (!p.opacity) return;
        if (!appearances.has(i)) {
          appearances.set(i, t);
          expect(p.floor).toBe(0);
          expect(p.y).toBeLessThan(161);
          expect(scene.helpers[i].dispatchAt).toBeLessThan(t);
          expect(helper.source).toBe(helper.left ? "factory" : "control");
        }
        if (Math.abs(p.floor - Math.round(p.floor)) > 0.001) {
          expect(p.action).toBe("ride");
          expect(agentLift(p)).not.toBeNull();
        }
        const others = [
          ...Object.values(agentSceneFrame(scene, t)),
          ...helpers.slice(0, i).map((h) => h.pose),
        ];
        for (const q of others)
          if (q.opacity) expect(Math.abs(p.x - q.x) >= 29 || Math.abs(p.y - q.y) >= 29).toBe(true);
      });
    }
    expect(appearances.size).toBe(4);
    for (const helper of scene.helpers) {
      const end = helper.stops.at(-1)!.pose;
      expect(end.opacity).toBe(0);
      expect(end.floor).toBe(0);
      expect(end.x).toBe(helper.stops[0].pose.x);
      expect(end.y).toBe(helper.stops[0].pose.y);
    }
    for (let i = 1; i < 4; i++)
      expect(appearances.get(i)! - appearances.get(i - 1)!).toBeGreaterThan(2);
  });
  it("keeps a manually selected module throughout the tour, including Research", () => {
    for (const module of factoryModules) {
      let scene = createAgentScene("work", module.id);
      for (let i = 0; i < 20; i++) {
        scene = nextAgentScene(scene, agentSceneFrame(scene, scene.duration), true);
        expect(scene.module).toBe(module.id);
      }
    }
  });
  it("uses only valid native Codex sprite cells for walking, blinking and work", () => {
    const seen = new Set<string>();
    for (const layer of factoryPanelIds) {
      const start = createAgentScene(layer, "software");
      const scene = nextAgentScene(start, agentSceneFrame(start, start.duration), false);
      for (let t = 0; t < scene.duration; t += 0.025) {
        const p = agentSceneFrame(scene, t).codex,
          f = codexFrame(p);
        seen.add(`${f.row}:${f.column}`);
        expect([0, 1, 2, 7]).toContain(f.row);
        expect(f.column).toBeGreaterThanOrEqual(0);
        expect(f.column).toBeLessThan(f.row === 0 || f.row === 7 ? 6 : 8);
        if (p.action === "walk") expect(f.row).toBe(p.facing < 0 ? 2 : 1);
      }
    }
    for (const key of ["0:1", "1:2", "2:2", "7:5"]) expect(seen.has(key)).toBe(true);
  });
});
