# Organisation project section

The homepage closes with public Arc’IT projects, not client references.
`src/projects/` adapts Gustav Online's existing tabs and safe README paragraph
renderer. It is mirrored into the independently deployed onlinesourdough site;
there is no runtime cross-checkout import or additional backend.

Sources:

- `https://raw.githubusercontent.com/gustavonline/gustavonline/main/data/github-profile.json`
  supplies curated names/order, local icon paths and project README stories.
- `https://api.github.com/orgs/arcitai/repos?type=public&per_page=100` supplies
  the More projects directory. Only public, active repositories belonging to
  exactly this owner are accepted; website/profile scaffolding is excluded.
- `public/data/project-profile.json` and `organization-projects.json` are
  bundled source snapshots for first render and network/rate-limit failures.

The client validates both responses, ignores older profile refreshes, limits
README paragraphs and keeps unrecognised markup as escaped text. It sends no
tokens, credentials, email addresses or form data. GitHub attribution links are
the only interpreted Markdown. Missing icons fall back to a monogram.

Snapshot icons are reused unchanged from Gustav Online. New projection icons
need copying into the site's public asset allowlist at the next refresh; until
then the fallback works. Names/story text are not duplicated in JSX. Change the
canonical README/profile projection to update them.

Focused tests cover organisation isolation, private/archive exclusion, unsafe
links, README provenance, old/failed refreshes, safe attribution and keyboard
navigation. Browser visual/interaction evidence remains pending because of the
existing localhost URL-security denial. No production release is authorised.
