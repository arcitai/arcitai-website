# `arcitai-api` Cloudflare Worker

This Worker is the Arc'IT-owned write boundary for Project Inquiries. It is a
separate deploy unit in this repository and is source-only until a reviewed
cutover is authorized.

## Runtime surface

- `POST /project-inquiry`: validate one Arc'IT project inquiry and create one
  Notion page.
- `OPTIONS /project-inquiry`: browser preflight for the same route.

There is deliberately no newsletter, posts, Resources, or Testimonials route.
Gustav Online remains the owner of newsletter and posts. The
`onlinesourdough-resources` project remains the owner of Resources. Testimonials
are documented as Arc'IT-owned future data, but no runtime is justified while
the landing page does not use them.

The intended custom-domain endpoint is:

```text
https://api.arcitai.com/project-inquiry
```

`workers_dev` stays enabled as a recovery path. Wrangler reports the account's
actual `workers.dev` hostname after the first authorized deployment; do not
cut the frontend over to that recovery hostname as the primary endpoint.

## Configuration

Public vars are in [`../wrangler.jsonc`](../wrangler.jsonc):

- `ALLOWED_ORIGINS`: exactly the two Arc'IT production origins plus the two
  documented local preview origins.
- `NOTION_PROJECT_INQUIRIES_DATA_SOURCE_ID`:
  `6dddc32e-df5a-4da8-8cfd-1b3dd68861f4`.

The only secret is `NOTION_TOKEN`. Set it directly in the `arcitai-api` Worker
after reviewing the config; never commit it, place it in Pages, or put it in a
browser build:

```bash
npm run worker:secret:put
```

The command is interactive. Its value is not read, echoed, or stored by this
repository.

An authorized operator also needs the Cloudflare account ID and a scoped API
token for the Worker/account operation. The `arcitai.com` zone must already be
delegated to that Cloudflare account so `api.arcitai.com` can receive its
managed custom-domain certificate. The Notion integration represented by
`NOTION_TOKEN` must be shared with the current Project Inquiries data source.

## Local checks

```bash
npm run worker:typecheck
npm run worker:test
npm run worker:dry-run
```

For a local browser journey, run the Worker with Wrangler and use a Vite site
origin on one of the explicitly allowed ports:

```bash
npm run worker:dev
npm run dev -- --port 4173
```

Use `VITE_INQUIRY_ENDPOINT=http://127.0.0.1:8787/project-inquiry` only in a
local build or dev shell. Local CORS entries are not production authorization.

## Validation and safety

The Worker owns the authoritative contract: required fields, exact role,
company-size, and revenue allowlists, bounded strings and request body size,
email validation, HTTP(S)-only optional websites, and server-side
`Source = Website`. Responses contain fixed safe messages and the code does not
log inquiry content. CORS limits browser-readable origins but is not
authentication; abuse and rate-limit risk remains until real traffic justifies
a narrowly chosen control.

Tests inject the Notion adapter and use fake responses. They never call Notion
and never create a real row.

## Deployment and recovery

The manual workflow is
`.github/workflows/deploy-worker.yml`. It accepts a `ref`, repeats the Pages
and Worker gates, validates deployment credentials, and deploys only the
`arcitai-api` Worker with the exact Wrangler version pinned in `package.json`.
Use a reviewed `main` ref for a normal release and a
known-good commit SHA for recovery. The local equivalents are:

```bash
npm run worker:build
npm run worker:deploy
npm run worker:deploy:recovery
```

The recovery command assumes the worktree is already checked out at the
reviewed known-good ref. Deployment, secret setup, DNS, and frontend cutover
are intentionally not performed by Build.
