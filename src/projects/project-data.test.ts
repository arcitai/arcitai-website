import { describe, expect, it } from "vitest";
import { nextProjectTab, parseCatalogue, parseOrganization, preferCatalogue } from "./project-data";
const project = (owner: string, name: string, extra = {}) => ({
  owner,
  repo: `${owner}/${name}`,
  name,
  url: `https://github.com/${owner}/${name}`,
  description: "A source description.",
  isPublic: true,
  ...extra,
});
const profile = (projects: unknown[]) => ({
  schemaVersion: 3,
  generatedAt: "2026-10-20T10:00:00Z",
  sourceReadme: "https://github.com/gustavonline/gustavonline/blob/main/README.md",
  projects,
});

describe("organisation project boundary", () => {
  it("keeps only the requested organisation, public entries and the first occurrence", () => {
    const input = profile([
      project("arcitai", "factory"),
      project("onlinesourdough", "AIOS"),
      project("arcitai", "secret", { isPublic: false }),
      project("arcitai", "factory"),
    ]);
    expect(parseCatalogue(input, "arcitai")?.projects.map((p) => p.repo)).toEqual([
      "arcitai/factory",
    ]);
    expect(parseCatalogue(input, "onlinesourdough")?.projects.map((p) => p.repo)).toEqual([
      "onlinesourdough/AIOS",
    ]);
  });
  it("rejects offsite destinations and external icons", () => {
    expect(
      parseCatalogue(
        profile([project("arcitai", "x", { url: "https://github.com.evil.test/arcitai/x" })]),
        "arcitai",
      )?.projects,
    ).toEqual([]);
    const safe = parseCatalogue(
      profile([project("arcitai", "x", { icon: "https://example.com/icon.svg" })]),
      "arcitai",
    );
    expect(safe?.projects[0].icon).toBeUndefined();
  });
  it("uses valid README prose, falling back to the description for invalid provenance", () => {
    const revision = "a".repeat(40);
    const readme = {
      revision,
      section: "Why I built this",
      url: `https://github.com/arcitai/x/blob/${revision}/README.md#why-i-built-this`,
      paragraphs: ["Why I made it."],
    };
    expect(
      parseCatalogue(profile([project("arcitai", "x", { readme })]), "arcitai")?.projects[0]
        .paragraphs,
    ).toEqual(readme.paragraphs);
    expect(
      parseCatalogue(
        profile([project("arcitai", "x", { readme: { ...readme, url: "https://example.com" } })]),
        "arcitai",
      )?.projects[0].paragraphs,
    ).toEqual(["A source description."]);
  });
  it("keeps the bundled catalogue on invalid or older refreshes", () => {
    const current = parseCatalogue(profile([project("arcitai", "x")]), "arcitai");
    expect(preferCatalogue(current, parseCatalogue({ schemaVersion: 0 }, "arcitai"))).toBe(current);
    expect(preferCatalogue(current, { ...current!, generatedAt: "2020-01-01" })).toBe(current);
  });
  it("never lists private, archived or foreign organization repositories", () => {
    const repo = {
      name: "tool",
      full_name: "arcitai/tool",
      html_url: "https://github.com/arcitai/tool",
      private: false,
      archived: false,
    };
    expect(
      parseOrganization(
        [
          repo,
          { ...repo, private: true },
          { ...repo, archived: true },
          { ...repo, full_name: "other/tool" },
        ],
        "arcitai",
      ).map((p) => p.repo),
    ).toEqual(["arcitai/tool"]);
  });
});
describe("project tab keyboard navigation", () => {
  it("wraps arrows and supports Home/End without capturing unrelated keys", () => {
    expect(nextProjectTab(0, "ArrowLeft", 4)).toBe(3);
    expect(nextProjectTab(3, "ArrowRight", 4)).toBe(0);
    expect(nextProjectTab(2, "Home", 4)).toBe(0);
    expect(nextProjectTab(0, "End", 4)).toBe(3);
    expect(nextProjectTab(0, "Tab", 4)).toBeNull();
  });
});
