# Delivery and recovery

## Release units

- Source: reviewed commit on `main`.
- Pages artifact: the exact `dist/` produced by `npm ci && npm run check`.
- Worker artifact: the reviewed `worker/index.ts` bundle produced by
  `npm run worker:build`; it is deployed separately as `arcitai-api`.
- Pages environment: Cloudflare Pages (`arcitai.com`, `www.arcitai.com`, and
  the `arcitai.pages.dev` deployment origin).
- Worker environments: intended custom domain `api.arcitai.com` and the
  Wrangler-provided `workers.dev` recovery hostname.
- Operator: repository owner through the credential-gated manual workflow or
  the equivalent pinned Wrangler command.
- Runtime configuration: the browser endpoint defaults to
  `https://api.arcitai.com/project-inquiry` and can be overridden with
  `VITE_INQUIRY_ENDPOINT`; there are no browser secrets.

## Required gates

```bash
npm ci
npm run check
npm run audit
npm run worker:build
```

The release review also requires workflow validation, an exact build-content
inventory, and browser QA at both canonical viewports with all forced scenes
and mocked inquiry outcomes.

## Automated delivery

The September 25 inquiry simplification removes revenue from the browser form.
Deploy and verify the backwards-compatible Worker update before releasing
that Pages artifact. The old Worker requires revenue and would reject the new
form. The updated Worker accepts both form versions and omits the Notion revenue
property when absent; no Notion schema migration or synthetic revenue value is
needed. Pages may be rolled back independently; roll back the Worker only after
restoring a compatible older form.

`.github/workflows/ci.yml` runs lockfile install, formatting, linting,
typechecking, tests, build, and audit on pull requests and `main`.

`.github/workflows/deploy-pages.yml` is a manual Cloudflare Pages release path.
It repeats the release gates, builds from the selected immutable ref, verifies
that `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` exist without printing
them, and uploads only `dist/` with the lockfile-pinned Wrangler. It accepts a `ref` for
recovery and does not deploy every push automatically.

The equivalent local release command, after the exact artifact has been built,
is:

```bash
npx --no-install wrangler pages deploy dist --project-name arcitai --branch main
```

`.github/workflows/deploy-worker.yml` is a separate manual `arcitai-api`
release and recovery path. It accepts the same kind of `ref` input, checks out
that immutable ref, runs the Pages and Worker gates, validates Cloudflare
credentials, and deploys only the Worker with the lockfile-pinned Wrangler
dependency.
The Worker workflow requires the `NOTION_TOKEN` secret to already exist on the
`arcitai-api` Worker; it never places that secret in Pages or the repository.

The local Worker commands are:

```bash
npm run worker:check
npm run worker:dry-run
npm run worker:deploy
```

`npm run worker:deploy:recovery` is the equivalent deploy after checking out a
reviewed known-good ref. Build and review do not run either deploy command.

The Pages project is deliberately separate from GitHub repository visibility;
the repository remains private and GitHub Pages is not used.

## Worker ownership and configuration

`arcitai-api` owns only `POST /project-inquiry` and its `OPTIONS` preflight.
Gustav Online remains the owner of newsletter/posts, and
`onlinesourdough-resources` remains the owner of Resources. Testimonials are a
future Arc'IT-owned data concern with no runtime endpoint until the page uses
them.

The Worker stores the current Notion data-source ID as the public Wrangler var
`NOTION_PROJECT_INQUIRIES_DATA_SOURCE_ID`:
`6dddc32e-df5a-4da8-8cfd-1b3dd68861f4`. The only secret is the dedicated
Cloudflare Worker secret `NOTION_TOKEN`, set interactively with
`npm run worker:secret:put`. Never copy the token into a config file, CI log,
Pages environment, or browser bundle.

Production CORS allows only `https://arcitai.com` and
`https://www.arcitai.com`. `http://127.0.0.1:4173` and `:4174` exist only for
documented local preview work. `https://arcitai.pages.dev`, Gustav Online
origins, and arbitrary origins are not inquiry origins. CORS is browser
isolation, not authentication; residual abuse and rate-limit risk remains a
known boundary until real traffic justifies a specific control.

Before an authorized deploy, the Cloudflare account must contain the delegated
`arcitai.com` zone with permission to attach the `api.arcitai.com` custom domain
and provision its managed TLS. The deploy operator needs the credential-gated
`CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` workflow secrets, scoped to
the Worker/account operation. The Notion integration behind `NOTION_TOKEN` must
be granted access to the current Project Inquiries data source. Build does not
inspect, create, or change any of these external resources.

## Cloudflare Pages and custom domain

The Pages project is `arcitai` and currently exposes these active domains:

- `https://arcitai.com` (production apex)
- `https://www.arcitai.com` (production alias)
- `https://arcitai.pages.dev` (deployment origin and fallback)

Cloudflare reports managed TLS for both custom domains. The parent `.com`
delegation is authoritative at `kara.ns.cloudflare.com` and
`lee.ns.cloudflare.com`. Simply remains the domain provider/account; do not add
a competing apex record or change DNS in Simply. Some recursive resolvers may continue to
serve the previous Simply delegation until their cache expires, so validate
with more than one public resolver after a DNS change.

The dedicated `arcitai-api` config allows `arcitai.com` and `www.arcitai.com`
through CORS once it is deployed. The `pages.dev` origin is intentionally not
an inquiry origin; use it for static and interaction smoke testing only and do
not submit a real inquiry there. See [Cloudflare custom
domains](https://developers.cloudflare.com/pages/configuration/custom-domains/).

Cloudflare deployment readback on 2026-09-24 identifies the current production
artifact as `https://838a5464.arcitai.pages.dev`, source `46cc260`.
`https://aaf4f039.arcitai.pages.dev` (`7e3e2d8`) remains the older deployment.
The September landing-page candidate is tracked in `release-2026-09-24.md`;
it is not deployed until that record says so. Use the current production
artifact/source as its recovery reference.

## Verification

After every deployment:

1. Read the Wrangler conclusion, Worker name, deployment URL, custom-domain
   result, and deployed artifact result for each deploy unit.
2. Load `https://arcitai.com` and `https://www.arcitai.com` in a real browser
   and confirm status 200, title, canonical URL, mark, fonts, all four
   landscapes, navigation, theme, and VSL. Keep `arcitai.pages.dev` as a
   separate static smoke-test origin.
3. Check console and failed network requests.
4. Send an OPTIONS preflight and only an intentionally invalid inquiry payload
   from each active site origin unless a real record has separate
   authorization. Exercise the Worker recovery hostname separately if needed.
5. Confirm the invalid request is rejected, CORS matches only the active site
   origin, and no request body appears in application logs.

Build has no live Worker proof: it does not deploy, set `NOTION_TOKEN`, change
DNS, or call either Worker with a valid inquiry. The first authorized release
must verify the Wrangler result, `api.arcitai.com` custom-domain attachment,
the actual `workers.dev` recovery URL, preflight, safe invalid-payload failure,
and a mocked browser success/error journey.

## Recovery

Preferred forward recovery is `git revert <bad-release>` followed by the normal
review and main deployment of both units. For an urgent Pages rebuild, run the
Pages workflow manually with its verified commit SHA as `ref`. For an urgent
Worker rebuild, run the Worker workflow manually with the same verified SHA as
`ref`, or check out that ref and run the pinned Wrangler command locally.

Cutover sequence for the inquiry boundary:

1. Confirm the dedicated Worker secret and Notion data-source permissions in
   Cloudflare, then deploy `arcitai-api` from reviewed `main`.
2. Verify the custom domain, recovery hostname, strict preflight, and an
   intentionally invalid payload. Do not create a real row for release proof.
3. Build and deploy Pages with the frontend default
   `https://api.arcitai.com/project-inquiry`, then complete the live browser
   journey from both active site origins.
4. If the Worker is unhealthy, switch the Pages build configuration back to the
   last known-good endpoint/ref and redeploy Pages; if the Worker code is bad,
   redeploy the Worker workflow from its known-good SHA. Keep the current shared
   Gustav Online Worker live until the cutover has independently passed.

The old shared endpoint is a rollback fallback only while it remains live and
authorized; it is not called with a valid inquiry during Build.

Recovery is proven when the workflow or local command can build the chosen
earlier commit and a local smoke test matches that commit. The documented
rollback anchor for this release is `f560b7e`. If Cloudflare or GitHub is down,
the same `dist/` can be served by any static host without code changes.

Do not delete deployment history, rewrite `main`, change DNS, or disable the
Worker as a rollback shortcut.
