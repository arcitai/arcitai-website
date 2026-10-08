---
name: Arc’IT AI — Factory overview
version: 1.0.0
---

# Job and scope

Show a customer what the agents are working on, the evidence behind progress,
and which decisions need a person. One original dashboard companion provides
Build and Security views. This is an interactive fixture-based design, not a
GitHub connection, running factory or authentication implementation.

Use the supplied [Warp Contributions board](https://build.warp.dev/) as the
information-architecture reference: persistent product navigation, grouped
stage counts, searchable issue rows and work details. Live rendering inspected
14 September 2026. Its backend and dashboard-source licence were not identified;
no code, logos, avatars, issue data or visual assets are copied. Original Arc’IT
type, colour and spacing distinguish the treatment.

# Composition and visual rules

Light work surface `#fafbf8`, white rows, dark green `#14211d` navigation, green
`#236b59` selected state, ink `#18211d`, muted `#606d64`, divider `#dce1da`.
Amber indicates a human decision or inconclusive check with a text label, never
colour alone. Existing local Geist Sans and Mono; Geist Pixel for product
wordmark. Existing Cut Six mark and retained font licence, no remote assets.

Desktop: 210 px application navigation, 225 px stage filter, remaining space
for task rows. Use compact but readable 14 px rows, 12 px metadata, and 32 px
page heading. Readability and operational status take priority over the scenic
marketing treatment. Mobile moves navigation above the content, stage filters
to two columns and row metadata below the task title. No horizontal page scroll
at 320 px. Details use a native dialog with bounded vertical scrolling.

# Working prototype interactions

- Build/Security changes the dataset and stage list and resets filters.
- Search and stage selection combine; reset returns the entire selected view.
- Row selection opens a detail dialog with source/evidence/timeline and, where
  relevant, a working link to the paired item in the other view.
- Escape/Close dismisses the dialog. All controls are keyboard operable with
  visible focus. Search results have a polite count/status announcement.
- Explicit _Data-state preview_ controls demonstrate a normal sample, stale
  sample, connection error retaining last sample, and empty state. These are
  not claims about actual sync. Unknown usage is “Not available”, never zero.
- Every view remains labelled Demo / synthetic data / no connected agents.
  Security’s notice describes required future access control and explicitly
  says this demo has no authentication. No fake login or approval control.

The dashboard is read-only. No dispatch, merge, finding closure, tokens, external
fetches, storage or analytics. CSP permits only same-origin/local Vite development
connections and forbids form actions.
Production needs server-side customer/repo/record authorisation and verified
adapters to GitHub, CI, runtime and private finding storage. Two subdomains may
share a frontend codebase; a route is not an access boundary.

# Review

Companion `index.html`, served by the existing local Vite server. Test desktop
1440×1000 and mobile 390×844/320, both views, filters, no-results, details,
cross-view link, Escape/focus return and all data states. Review source/data
handling and console/network. Same-task technical review by Codex; owner design
acceptance remains pending. See the joint R2 review for exact hashes/evidence.

- **Known limitations:** Only local synthetic fixtures; no authentication,
  GitHub/API adapter, worker telemetry, actual security finding, operational
  factory, verified cost, provider integration or deployment. Domain handbooks
  define required installation proof separately.
