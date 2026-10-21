# Arc'IT AI

Production source for the Arc'IT AI landing page and its dedicated Project
Inquiries Worker at `arcitai.com`.

Arc'IT AI provides data and AI consultancy for mid-sized and large organisations.
The two offers are a free 15-minute One-off consultation and Custom projects. Work starts with
the client's business, data and existing systems; scope follows the project.
Data and business context form the foundation; tools, workflows and reusable
skills make that information useful to agents working on software, BI, research
and other project tasks. Architecture, integration and modelling support this
work. The primary distinction from [onlinesourdough](https://onlinesourdough.com)
is audience: onlinesourdough serves solo business owners and small teams through
a hybrid programme with 1:1 collaboration.

Factory is Arc’IT’s open-source project and explains the agentic engineering
method behind the work. Start with its [adoption guide](https://github.com/arcitai/factory#start). Its common
foundation brings together business data, context, tools and access; agents,
routines and checks adapt to the project. It is not presented as a third offer
or a subscription product. Code, configuration and documentation support
handover, with further support optional. The page sends project inquiries to
the Arc'IT-owned `arcitai-api` Worker.

## Status

- Current design: compact intro without VSL, two service cards above a wide
  Factory method explainer with the selected Open bridge diagram, a shared team story with rotating examples, and organisation-
  filtered open-source work.
  See `docs/design.md` and the October 21 release record.
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
- Factory layers, module selection, unfolding and accessible animation controls;
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

The shipped inventory in `public/assets/` contains:

- `arcitai-mark-final.svg`
- `arcitai-panorama-{morning,day,evening,night}-v1.jpg`
- Received `arcitai-{morning,day,evening,night}-{loop,poster}-v6` MP4/JPEG pairs;
  all four scenes are present in `src/media.ts` and checked in the build.
- Geist Sans, Mono, and Pixel WOFF2 files plus their license
- Inter WOFF2 plus `Inter-LICENSE.txt` and `Inter-SOURCE.txt`
- `factory-tools/`: local tool/channel marks and the Codex sprite, with sources,
  checksums and licences recorded alongside them
- `project-marks/`: Factory and OpenPaperDesign marks
- `gustav-linkedin-portrait.jpg` (current) and the retained `gustav-portrait.jpg`

`public/data/` contains the checked-in organisation projects, project profile
and Factory module-source manifests. It contains public runtime data, not secrets.

The earlier hero and introduction-video cover shared the selected scene. They
are no longer rendered in the compact October 20 local revision; their modules
and media remain on disk for recovery. The earlier Play video
action plays the landscape clip with controls until a recorded founder VSL is
supplied. Set the public build variable `VITE_VSL_VIDEO_URL` to that MP4 URL
later; it replaces click playback, never the ambient cover. Reduced motion,
data saving and media errors retain a usable still image.

The September 2026 release candidate and retained media are tracked in
[the earlier release record](docs/release-2026-09-24.md). The current release
scope and verification are recorded in [the October release](docs/release-2026-10-21.md).

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

## License

Original code and documentation are available under the [MIT License](LICENSE).
Third-party code, fonts, copied reference material, and other third-party assets
retain their own licenses and attribution. Brand names, logos, portraits, and
editorial media are not licensed for reuse by this software license.
