# Arcitai

This repository owns the public Arc'IT AI landing page and its static delivery.
It consumes the existing project-inquiry Worker; it does not own the Worker or
Notion.

## Start

1. Read `README.md`, `docs/architecture.md`, `docs/design.md`, and
   `docs/delivery.md`.
2. Inspect the current branch and working tree before changing files.
3. Keep implementation, Git, and delivery work inside this repository.
4. Preserve the root `backups/`, legacy `docs/`, and legacy root `assets/`
   unless a task explicitly authorizes removing them. They are not runtime
   inputs.

## Product truth

- `src/` owns the page structure, interaction, inquiry client, and tests.
- `docs/design.md` owns the operative design and content constraints.
- `public/assets/` contains the complete runtime asset allowlist.
- `docs/notion-arcade-ai-cms.md` records the external inquiry contract.
- `docs/delivery.md` owns CI, deployment, verification, and rollback.

Do not restore old mailto submission, testimonial placeholders, archived logo
variants, cross-project runtime paths, or additional service layers.

## Engineering baseline

- Keep one React/Vite/TypeScript deployable unit.
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
```

Also validate GitHub workflows and exercise the real built page in a browser at
1440×1000 and 390×844, including all four forced `?scene=` states, theme,
Offers, VSL, anchors, and mocked form success/error paths.

## Shipping

Production ships from reviewed `main` through Cloudflare Pages. A deploy is not
complete until the Wrangler result and live browser journey have been read.
Use the manual workflow's `ref` input to rebuild a known-good commit for
rollback. Keep the `pages.dev` origin separate from the custom domain until its
owner completes the documented Simply DNS action.
External DNS or Worker changes require their own explicit authority.
