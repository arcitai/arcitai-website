# Arcitai

This repository owns the public Arc'IT AI landing page, its static delivery,
and the separate `arcitai-api` Project Inquiries Worker. It does not own
Gustav Online's newsletter/posts boundary, Resources, or Notion itself.

## Start

1. Read `README.md`, `docs/architecture.md`, `docs/design.md`, and
   `docs/delivery.md`.
2. Inspect the current branch and working tree before changing files.
3. Keep implementation, Git, and delivery work inside this repository.
4. Preserve the root `backups/`, legacy `docs/`, and legacy root `assets/`
   unless a task explicitly authorizes removing them. They are not runtime
   inputs.

## Product truth

- `src/` owns the page structure, interaction, inquiry client, and browser tests.
- `worker/` owns the dedicated `arcitai-api` Project Inquiries route, validation,
  Notion adapter, and Worker tests.
- `docs/design.md` owns the operative design and content constraints.
- `public/assets/` contains the complete runtime asset allowlist.
- `docs/notion-arcade-ai-cms.md` records the external inquiry contract.
- `docs/delivery.md` owns CI, deployment, verification, and rollback.

Do not restore old mailto submission, testimonial placeholders, archived logo
variants, cross-project runtime paths, newsletter/posts/Resources endpoints, or
additional service layers.

## Engineering baseline

- Keep one React/Vite/TypeScript static deployable unit plus the separately
  configured TypeScript Cloudflare Worker deploy unit.
- Keep deterministic scene and inquiry behavior outside presentation markup and
  cover it with focused tests.
- Validate external responses; never render arbitrary server errors.
- Keep form values on failure and reset only after an acknowledged success.
- Keep secrets and Notion writes outside the browser.
- Add infrastructure or dependencies only for a demonstrated responsibility.

## Required checks

Run before review or release:

```bash
npm ci
npm run check
npm run audit
npm run worker:build
```

Also validate GitHub workflows and exercise the real built page in a browser at
1440×1000 and 390×844, including all four forced `?scene=` states, theme,
Offers, VSL, anchors, and mocked form success/error paths.

## Shipping

The static site ships from reviewed `main` through Cloudflare Pages, and the
inquiry boundary ships separately as `arcitai-api` through its manual Worker
workflow. A deploy is not complete until the relevant Wrangler result and live
browser journey have been read.
Use the manual workflow's `ref` input to rebuild a known-good commit for
rollback. The production custom domains are `https://arcitai.com` and
`https://www.arcitai.com`; the `arcitai.com` zone is now delegated to Cloudflare
with `kara.ns.cloudflare.com` and `lee.ns.cloudflare.com` as authoritative
nameservers. DNS changes are made in Cloudflare, not in Simply's DNS editor.
External DNS or Worker changes require their own explicit authority.
