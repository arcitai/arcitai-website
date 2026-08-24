# Architecture

## Decision

Arcitai is one static browser application plus one narrowly scoped Cloudflare
Worker. React retains the useful existing component-based foundation; TypeScript
owns deterministic browser and Worker contracts; Vite builds one portable
directory for Cloudflare Pages. The Worker owns only Project Inquiries and the
Notion write behind that route. There is no router, database, authentication
layer, container, or analytics vendor in the browser application.

The repository has an independent lifecycle because the public offer must be
built, deployed, recovered, and handed over without the design workbench or
AIOS.

## Responsibility map

| Responsibility                       | Owner                                       | Model  |
| ------------------------------------ | ------------------------------------------- | ------ |
| Landing-page UI and browser behavior | this repository                             | build  |
| Static CI and hosting                | GitHub Actions + Cloudflare Pages           | rent   |
| Inquiry validation and durable write | this repository's `arcitai-api` Worker      | build  |
| Inquiry records and workflow         | Arc'IT Project Inquiries Notion data source | reuse  |
| Newsletter and posts                 | Gustav Online                               | reuse  |
| Resources                            | `onlinesourdough-resources`                 | reuse  |
| Future testimonials data             | Arc'IT, when an active use exists           | future |
| Domain records                       | Cloudflare DNS zone (Simply account)        | reuse  |

No self-hosted responsibility is needed. Cloudflare Pages is replaceable by
any static host because `dist/` contains the complete artifact and uses
portable build paths.

## Boundaries

The browser is untrusted. HTML constraints and local types improve the visitor
experience but are not authoritative validation. `arcitai-api` validates JSON,
owns its dedicated `NOTION_TOKEN` secret, creates the record, and returns a
small JSON acknowledgement. CORS provides browser isolation, not
authentication; the Worker still documents residual abuse and rate-limit risk.
The browser sends no secrets and stores no inquiry data.

The runtime request is:

```text
visitor form
  → typed JSON over HTTPS
  → Arc'IT `arcitai-api` Cloudflare Worker
  → server validation
  → Arc'IT Project Inquiries Notion data source
  → { "ok": true } or a safe error
```

Only `{ "ok": true }` is accepted as success. Timeouts, invalid JSON,
non-success status codes, and network errors remain failures. The UI preserves
the form on failure and resets only after acknowledgement.

## Modules

- `src/routes/App.tsx`: page composition only.
- `src/components/`: cohesive visual/interaction sections.
- `src/scene.ts`: scene selection and Copenhagen clock formatting.
- `src/inquiry.ts`: payload and HTTP response contract.
- `src/site-data.ts`: stable public copy, links, choices, and endpoint.
- `src/styles.css`: approved responsive visual system.
- `worker/index.ts`: the only Worker route and safe response handling.
- `worker/validation.ts`: authoritative inquiry limits and allowlists.
- `worker/adapters/notion.ts`: Project Inquiries page mapping and write adapter.

## Operational properties

- One immutable static artifact per deployment.
- No runtime secret or state in the repository or Pages; `NOTION_TOKEN` remains
  a Cloudflare Worker secret.
- Build inputs are pinned by `package-lock.json` and immutable action SHAs.
- The previous Git commit is the recovery point; a known-good ref can be rebuilt
  and uploaded with the manual Cloudflare Pages workflow.
- Worker/Notion availability is visible through the form's error state; the
  footer email remains a separate, explicit contact path.

## Non-goals

- Adding newsletter, posts, Resources, or Testimonials runtime endpoints to this
  Worker.
- Treating CORS as authentication or adding speculative abuse infrastructure.
- Publishing fabricated case studies, testimonials, or metrics.
- Adding a CMS, analytics, scheduling, authentication, or a full-stack host.
- Shipping archived photography, logo labs, or design-process artifacts.
