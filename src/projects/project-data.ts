export type Organization = "arcitai" | "onlinesourdough";
export type Project = {
  repo: string;
  name: string;
  url: string;
  description: string;
  icon?: string;
  paragraphs: string[];
};
export type Catalogue = { generatedAt: string; projects: Project[] };

const record = (x: unknown): x is Record<string, unknown> =>
  typeof x === "object" && x !== null && !Array.isArray(x);
const text = (x: unknown, max: number): x is string =>
  typeof x === "string" && x.trim().length > 0 && x.length <= max;

/** Same public README projection used by Gustav Online, restricted to one owner. */
export function parseCatalogue(raw: unknown, owner: Organization): Catalogue | null {
  if (
    !record(raw) ||
    raw.schemaVersion !== 3 ||
    !text(raw.generatedAt, 40) ||
    !Number.isFinite(Date.parse(raw.generatedAt)) ||
    typeof raw.sourceReadme !== "string" ||
    !raw.sourceReadme.startsWith("https://github.com/gustavonline/gustavonline/") ||
    !Array.isArray(raw.projects)
  )
    return null;
  const result: Project[] = [];
  const seen = new Set<string>();
  const candidates = [
    ...raw.projects,
    ...(Array.isArray(raw.moreProjects) ? raw.moreProjects : []),
  ];
  for (const p of candidates) {
    if (
      !record(p) ||
      p.owner !== owner ||
      p.isPublic !== true ||
      !text(p.repo, 160) ||
      !new RegExp(`^${owner}/[A-Za-z0-9_.-]+$`).test(p.repo) ||
      p.url !== `https://github.com/${p.repo}` ||
      !text(p.name, 80) ||
      !text(p.description, 1000) ||
      seen.has(p.repo.toLowerCase())
    )
      continue;
    let paragraphs = [p.description];
    if (record(p.readme)) {
      const r = p.readme;
      const revision =
        typeof r.revision === "string" && /^[a-f0-9]{40}$/.test(r.revision) ? r.revision : null;
      if (
        revision &&
        r.section === "Why I built this" &&
        r.url === `https://github.com/${p.repo}/blob/${revision}/README.md#why-i-built-this` &&
        Array.isArray(r.paragraphs) &&
        r.paragraphs.length > 0 &&
        r.paragraphs.length <= 4 &&
        r.paragraphs.every((s) => text(s, 1000))
      )
        paragraphs = r.paragraphs as string[];
    }
    const icon =
      typeof p.icon === "string" && /^\/assets\/project-marks\/[a-z0-9-]+\.svg$/.test(p.icon)
        ? p.icon
        : undefined;
    seen.add(p.repo.toLowerCase());
    result.push({
      repo: p.repo,
      name: p.name,
      url: p.url as string,
      description: p.description,
      paragraphs,
      icon,
    });
  }
  return { generatedAt: raw.generatedAt, projects: result };
}

/** Public, active repositories only; website/profile scaffolding is not a product. */
export function parseOrganization(raw: unknown, owner: Organization): Project[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  return raw.flatMap((p): Project[] => {
    if (
      !record(p) ||
      p.private !== false ||
      p.archived !== false ||
      !text(p.name, 100) ||
      p.name === ".github" ||
      p.name === `${owner}-website` ||
      !/^[A-Za-z0-9_.-]+$/.test(p.name) ||
      p.full_name !== `${owner}/${p.name}` ||
      p.html_url !== `https://github.com/${p.full_name}` ||
      seen.has(p.full_name.toLowerCase())
    )
      return [];
    seen.add(p.full_name.toLowerCase());
    const description = text(p.description, 1000) ? p.description : "";
    return [
      {
        repo: p.full_name,
        name: p.name,
        url: p.html_url as string,
        description,
        paragraphs: description ? [description] : [],
      },
    ];
  });
}

export function preferCatalogue(current: Catalogue | null, next: Catalogue | null) {
  return next && (!current || Date.parse(next.generatedAt) >= Date.parse(current.generatedAt))
    ? next
    : current;
}

export function nextProjectTab(index: number, key: string, count: number) {
  if (key === "ArrowRight") return (index + 1) % count;
  if (key === "ArrowLeft") return (index - 1 + count) % count;
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  return null;
}
