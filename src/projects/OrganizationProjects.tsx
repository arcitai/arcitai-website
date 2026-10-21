import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import snapshot from "../../public/data/project-profile.json";
import organizationSnapshot from "../../public/data/organization-projects.json";
import {
  nextProjectTab,
  parseCatalogue,
  parseOrganization,
  preferCatalogue,
  type Organization,
} from "./project-data";
import { StoryParagraph } from "./StoryParagraph";
import "./projects.css";

type Props = {
  owner: Organization;
  title: string;
  description: string;
  productLinks?: Record<string, string>;
};

function ProjectIcon({ icon, name }: { icon?: string; name: string }) {
  const [failed, setFailed] = useState(false);
  return icon && !failed ? (
    <img src={icon} alt="" onError={() => setFailed(true)} />
  ) : (
    <span className="org-project-monogram" aria-hidden="true">
      {name.charAt(0)}
    </span>
  );
}

export function OrganizationProjects({ owner, title, description, productLinks = {} }: Props) {
  const [catalogue, setCatalogue] = useState(() => parseCatalogue(snapshot, owner));
  const [organization, setOrganization] = useState(() =>
    parseOrganization(organizationSnapshot, owner),
  );
  const [chosen, setChosen] = useState<string | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const focus = catalogue?.projects.slice(0, 3) ?? [];
  const focusIds = new Set(focus.map((p) => p.repo.toLowerCase()));
  const remaining = [...(catalogue?.projects.slice(3) ?? []), ...organization].filter(
    (p, i, all) =>
      !focusIds.has(p.repo.toLowerCase()) &&
      all.findIndex((x) => x.repo.toLowerCase() === p.repo.toLowerCase()) === i,
  );
  const ids = [...focus.map((p) => p.repo), "more"];
  const active = chosen && ids.includes(chosen) ? chosen : ids[0];

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);
    const read = async (url: string) => {
      const response = await fetch(url, { signal: controller.signal, credentials: "omit" });
      if (!response.ok) throw new Error("Project source unavailable");
      return response.json() as Promise<unknown>;
    };
    void Promise.allSettled([
      read(
        "https://raw.githubusercontent.com/gustavonline/gustavonline/main/data/github-profile.json",
      ).then((raw) => {
        if (!controller.signal.aborted)
          setCatalogue((current) => preferCatalogue(current, parseCatalogue(raw, owner)));
      }),
      read(`https://api.github.com/orgs/${owner}/repos?type=public&per_page=100`).then((raw) => {
        const next = parseOrganization(raw, owner);
        if (!controller.signal.aborted && next.length) setOrganization(next);
      }),
    ]).finally(() => window.clearTimeout(timeout));
    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [owner]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const next = nextProjectTab(ids.indexOf(active), event.key, ids.length);
    if (next === null) return;
    event.preventDefault();
    setChosen(ids[next]);
    tabs.current[next]?.focus();
  };

  return (
    <section
      className="organization-projects"
      id="current-work"
      aria-labelledby="current-work-title"
    >
      <header>
        <h2 id="current-work-title">{title}</h2>
        <p>{description}</p>
      </header>
      <div
        className="org-project-tabs"
        role="tablist"
        aria-label="Open-source projects"
        onKeyDown={onKeyDown}
      >
        {ids.map((id, index) => {
          const project = focus[index];
          return (
            <button
              key={id}
              ref={(el) => {
                tabs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`project-tab-${index}`}
              aria-controls={`project-panel-${index}`}
              aria-selected={active === id}
              tabIndex={active === id ? 0 : -1}
              onClick={() => setChosen(id)}
            >
              {project ? (
                <ProjectIcon icon={project.icon} name={project.name} />
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M3 4h18v16H3ZM3 9h18M9 9v11"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              )}
              <span>{project?.name ?? "More projects"}</span>
            </button>
          );
        })}
      </div>
      <div className="org-project-panels">
        {focus.map((project, index) => (
          <div
            key={project.repo}
            role="tabpanel"
            id={`project-panel-${index}`}
            aria-labelledby={`project-tab-${index}`}
            data-active={active === project.repo}
            aria-hidden={active !== project.repo}
            tabIndex={active === project.repo ? 0 : -1}
          >
            <div className="org-project-story">
              {project.paragraphs.slice(0, 1).map((p) => (
                <StoryParagraph key={p} text={p} />
              ))}
            </div>
            <a
              className="org-project-explore"
              href={productLinks[project.repo.toLowerCase()] ?? project.url}
            >
              Explore {project.name} <span aria-hidden="true">↗</span>
            </a>
          </div>
        ))}
        <div
          role="tabpanel"
          id={`project-panel-${focus.length}`}
          aria-labelledby={`project-tab-${focus.length}`}
          data-active={active === "more"}
          aria-hidden={active !== "more"}
          tabIndex={active === "more" ? 0 : -1}
        >
          <ul className="org-project-directory">
            {remaining.map((project) => (
              <li key={project.repo}>
                <a href={project.url}>
                  <span>{project.name}</span>
                  <span aria-hidden="true">↗</span>
                </a>
                {project.description && <p>{project.description}</p>}
              </li>
            ))}
          </ul>
          <a className="org-project-explore" href={`https://github.com/${owner}`}>
            All projects on GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
