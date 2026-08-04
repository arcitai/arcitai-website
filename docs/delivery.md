# Delivery and recovery

## Release unit

- Source: reviewed commit on `main`.
- Artifact: the exact `dist/` produced by `npm ci && npm run check`.
- Environment: Cloudflare Pages (`arcitai.pages.dev`).
- Operator: repository owner through the credential-gated manual workflow or
  the equivalent pinned Wrangler command.
- Runtime configuration: public inquiry endpoint compiled from the documented
  default or `VITE_INQUIRY_ENDPOINT`; there are no browser secrets.

## Required gates

```bash
npm ci
npm run check
npm run audit
```

The release review also requires workflow validation, an exact build-content
inventory, and browser QA at both canonical viewports with all forced scenes
and mocked inquiry outcomes.

## Automated delivery

`.github/workflows/ci.yml` runs lockfile install, formatting, linting,
typechecking, tests, build, and audit on pull requests and `main`.

`.github/workflows/deploy-pages.yml` is a manual Cloudflare Pages release path.
It repeats the release gates, builds from the selected immutable ref, verifies
that `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` exist without printing
them, and uploads only `dist/` with Wrangler `4.103.0`. It accepts a `ref` for
recovery and does not deploy every push automatically.

The equivalent local release command, after the exact artifact has been built,
is:

```bash
npx --yes wrangler@4.103.0 pages deploy dist --project-name arcitai --branch main
```

The Pages project is deliberately separate from GitHub repository visibility;
the repository remains private and GitHub Pages is not used.

## Cloudflare Pages and custom domain

The release deploys first to `https://arcitai.pages.dev`. This origin is for
static and interaction smoke testing only: the Worker does not currently
allowlist it for inquiry writes. Do not submit a real inquiry during pages.dev
QA.

The intended origin is `https://arcitai.com`, which the Worker already allows
through CORS. Do not attach or activate the custom domain until public DNS
resolves and Cloudflare reports the certificate ready. The owner must add
`arcitai.com` as a zone in the same Cloudflare account as the Pages project,
then replace the current Simply nameservers at Simply with the two exact
Cloudflare-assigned nameservers shown for that zone. A Simply CNAME at the
apex is not sufficient. After nameserver delegation has propagated, add
`arcitai.com` under the Pages project's Custom domains, wait for certificate
activation, and repeat the live form preflight. See [Cloudflare custom
domains](https://developers.cloudflare.com/pages/configuration/custom-domains/).

## Verification

After every deployment:

1. Read the Wrangler conclusion, deployment URL, project name, and deployed
   artifact result.
2. Load the live page in a real browser and confirm status 200, title, canonical
   URL, mark, fonts, all four landscapes, navigation, theme, and VSL.
3. Check console and failed network requests.
4. Send only an intentionally invalid inquiry payload unless a real record has
   separate authorization.
5. Confirm the invalid request is rejected and CORS matches the active origin.

## Recovery

Preferred forward recovery is `git revert <bad-release>` followed by the normal
review and main deployment. For urgent rebuild of a known-good artifact, run
the Cloudflare Pages workflow manually with its verified commit SHA as `ref`,
or rebuild that ref and run the pinned Wrangler command locally.

Recovery is proven when the workflow or local command can build the chosen
earlier commit and a local smoke test matches that commit. The documented
rollback anchor for this release is `f560b7e`. If Cloudflare or GitHub is down,
the same `dist/` can be served by any static host without code changes.

Do not delete deployment history, rewrite `main`, change DNS, or disable the
Worker as a rollback shortcut.
