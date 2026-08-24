# Arc'IT AI

Production source for the Arc'IT AI landing page and its dedicated Project
Inquiries Worker at `arcitai.com`.

Arc'IT AI is the done-for-you implementation offer in the same business family
as [onlinesourdough](https://onlinesourdough.com). The page starts with the
business constraint, explains the Spec → Build → Review → Ship path, and sends
qualified project inquiries to the Arc'IT-owned `arcitai-api` Worker.

## Status

- Shape: static browser application
- Runtime: React 18, TypeScript, Vite
- Delivery target: Cloudflare Pages from reviewed `main`
- External write boundary: `arcitai-api` Cloudflare Worker → Notion
- Custom domains: `arcitai.com` and `www.arcitai.com`, active on Cloudflare Pages
  with managed TLS.
- DNS: the `arcitai.com` zone is delegated to Cloudflare (`kara.ns.cloudflare.com`
  and `lee.ns.cloudflare.com`); Simply remains the domain provider/account.

The deployable implementation in this repository is now the technical source
of truth. The approved design-workbench preview was migration input, not a
runtime dependency.

## Ownership

This repository owns:

- page content, layout, responsive behavior, theme, and interactions;
- Copenhagen time/scene selection and forced visual-review scenes;
- browser-side inquiry payload creation and honest UI states;
- the static build, quality gates, GitHub Actions, and Cloudflare Pages delivery.

It owns two separate deploy units: the static Pages site and `arcitai-api`, a
Cloudflare Worker limited to Project Inquiries. It consumes but does not own:

- the Notion service and `Arcitai Project Inquiries` data source;
- Gustav Online's newsletter and posts services;
- the `onlinesourdough-resources` Resources service;
- the Cloudflare account, Pages project, and DNS zone for `arcitai.com`.

See [architecture](docs/architecture.md), [design](docs/design.md),
[inquiry contract](docs/notion-arcade-ai-cms.md), and
[delivery/recovery](docs/delivery.md).

## Commands

```bash
npm ci
npm run dev
npm run format
npm run lint
npm run typecheck
npm test
npm run build
npm run audit
npm run preview
npm run worker:check
npm run worker:dry-run
```

`npm run check` runs format, lint, tests, and the production build.
`npm run worker:build` typechecks, tests, and validates the Worker bundle
without deploying it.

## Runtime assets

Only these assets are shipped from `public/assets/`:

- `arcitai-mark-final.svg`
- `arcitai-panorama-{morning,day,evening,night}-v1.jpg`
- Geist Sans, Mono, and Pixel WOFF2 files plus their license

The root `assets/`, `backups/`, and older documents preserve pre-release work
from the baseline commit. Nothing there is imported into the runtime build.

## Inquiry behavior

The browser submits JSON asynchronously. Native constraints protect ordinary
input, the Worker owns authoritative validation and the Notion write, and the
page resets only after `{ "ok": true }`. Pending, acknowledged success,
timeout, validation, network, and server failure remain visible to assistive
technology. Failure keeps the visitor's form values and never opens mail.

No production inquiry is required to verify a release: use the focused client
and Worker tests, the Worker dry-run, browser request interception, Worker
preflight, and an intentionally invalid payload. Build does not call the live
shared Gustav Online Worker with a valid inquiry.

## Delivery and recovery

Pull requests and `main` run the same lockfile-based quality checks. Reviewed
`main` deploys an immutable Cloudflare Pages artifact to `arcitai.pages.dev`.
The manual deployment workflow accepts a known-good ref for recovery, and
`git revert` remains the normal forward-recovery path. The active custom
domains are `arcitai.com` and `www.arcitai.com`; DNS is maintained in the
Cloudflare zone, while Simply remains the domain provider/account.
