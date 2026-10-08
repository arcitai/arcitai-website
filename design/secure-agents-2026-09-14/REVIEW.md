# Review: Secure Agents direction and copy

14 September 2026. Reviewer: Codex, a separate inspection pass in the same task. This is not an independent security assessment or Gustav’s approval to publish.

**Result: PASS for the requested direction, copy and local preview.** Production release readiness is not claimed: the unchanged dependency audit fails, commercial commitments remain proposals, and no live implementation or publication was requested.

## Exact subject

The accepted brief is the current request plus the scope in `direction.md` and `DESIGN.md`: clarify Arc’IT’s business-first DFY direction with Secure Agents, explain onlinesourdough’s role, draft English copy and inspect it in the existing identity. VSL production, a live site change, Notion/AIOS truth changes and a security engagement are excluded.

| Artifact                                                               | SHA-256                                                            |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------ |
| [Direction](../../content/secure-agents-2026-09-14/direction.md)       | `a489a9c72f8773338be10a20a73652bfa6bf30266d7f557b61d667f5371e815e` |
| [Website copy](../../content/secure-agents-2026-09-14/website-copy.md) | `27259a65e8df1beb6153fd41ab33b9361fc9339b79b3d4f3d44b6b335543107f` |
| [Design direction](DESIGN.md)                                          | `d018e79eb33ed778566a51ff3d25c87303695cbd2f5732999d884fc248cfda73` |
| [HTML preview](index.html)                                             | `c77c86bf7692a2f193f237824f40df9c9cca947ebd782ccb16e9355c420faee6` |

## Requirement coverage

| Requirement                                          | Observed result                                                                                                                                                                                                                               |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Study LaterWork and Secure Agents                    | Owner note read; current IBM, MCP, Trail of Bits and official OpenAI evidence interpreted with source-specific limits in the direction document. Missing local files and missing spoken transcript are explicit.                              |
| Business-first DFY, not a conventional cyber company | Recommended entry names the business work, setup and maintenance. Security is expressed through permissions, data, actions, test and continued ownership. No SOC, 24/7, certification, guarantee or partner claim.                            |
| Relationship with onlinesourdough                    | Responsibility table separates DIY, DWY and DFY; preventive safe use is shared. Personal agent risk is not denied. AIOS is optional support, not a required new product.                                                                      |
| IBM trilemma and Defense Factory                     | Capability/speed/security tradeoffs are distinguished from the private-data/untrusted-content/external-communication trifecta. Defense Factory is a proposed internal method and pilot, not a proven service or public third offer.           |
| English copy drafts                                  | One complete recommended page plus two alternative openings, CTA/form states, metadata and implementation notes. The illustrative quote workflow is labelled, not represented as a client case.                                               |
| Existing design system                               | Local mark, four landscapes and Geist fonts reused. Same page journey and ledger treatment; no new dependencies or remote media. Small contrast corrections are documented.                                                                   |
| Draft-only boundary                                  | `git diff --exit-code` confirmed no changes to runtime, Worker, assets, operative docs, package files or workflows. The only new authoring is in `content/` and `design/`. No Git push, deployment, customer access or Notion write occurred. |

## Editorial and owner-context checks

Tone-of-voice evaluation: **PASS**, against the current owner `context/voice.md` and this task, not a claim of a fresh Slack corpus review.

- V1: English public copy uses first person, contractions and short explanatory paragraphs.
- V2: No hype, manufactured proof, rigid contrast formula, hedging stack or ornamental em dash in the public copy. Three-step workflow and metadata lists describe actual structure rather than filler.
- V3: Conversational passages are short; headings and form labels are intentionally tighter than speech.
- V4: Founder identity and responsibilities resolve to owner sources or are explicitly proposed service commitments. No fabricated prices, availability, results or accreditation.
- V5: The recommendation, practical reason and next step stay visible. Maintenance is part of the service story; handover caveats do not dominate it.

Principles evaluation: **PASS for the recommendation**, with the proposed operating commitment still subject to validation.

- P1: Starts from useful work and the responsibility gap, not tool adoption.
- P2: Proposes one bounded workflow pilot before new infrastructure or a broad ongoing service.
- P3: Supplies usable copy and a preview rather than an intake questionnaire or implementation homework.
- P4: Material technical claims are sourced; video/local-source gaps and partnership limits are retained.
- P5: Reuses the existing site identity, harnesses and workbench. No new scanner or dashboard.
- P6: Recommends the lowest reliable autonomy, enforced boundaries and a practical stop; no security operations are executed here.

## Rendered and behavioral checks

Preview served on loopback at `http://127.0.0.1:4175/design/secure-agents-2026-09-14/` through the existing Vite server. Leave this preview server running for Gustav’s inspection; restart instructions are in `DESIGN.md`. This is not public hosting.

- 1440×1000, 390×844 and 320×844: all four scene choices loaded. At each of the 12 combinations, document width matched viewport width and visible-element horizontal overflow was empty.
- Both themes at each width: correct theme state and accessible action label. Actual desktop/mobile/narrow screenshots inspected, including the explanation, ledger, inquiry, menu and dark hero.
- Offers: two visible entries; Escape closes and restores focus to the summary with a 3 px visible outline; outside click closes. Selection navigated to the local scope and closed the disclosure.
- Skip link: keyboard Tab reveals visible focus; Enter moves focus to `main`. Native question disclosures open. Reduced-motion changes computed scroll behavior to `auto`.
- Form: empty required fields focus `name`; invalid email focuses `email` with `typeMismatch`. A valid synthetic example displays “Preview only. Your message hasn’t been sent.” and retains its entries. Clicking the button and pressing Enter caused zero non-GET requests during the observed form journey. Editing clears the status. Labels and privacy descriptions are associated.
- Fonts and local mark loaded; final preview console reported zero errors and zero warnings. Request inspection showed static loading only; no production inquiry endpoint is present in the prototype.
- Contrast: body ink/paper 14.80:1 light and 16.64:1 dark; ordinary muted text/paper 4.82:1 light. Muted text on the light soft surface was corrected from 4.49:1 to 4.77:1. The light input border/surface ratio is 3.45:1. Focus is visible in both themes. This is selected-surface QA, not a full WCAG certification.

Visual-asset evaluation: **PASS**. I1: wording renders cleanly. I2: identity follows the selected local design. I3: readable at desktop/mobile/320 px. I4: required copy and illustrative labels are present without fake proof. I5: HTML and reviewed PNG dimensions match the selected surfaces.

Selected visual evidence, local and ignored by Git:

- [Desktop hero](../../output/playwright/secure-agents-2026-09-14/reviewed-hero-1440-day.png)
- [Founder explanation and example](../../output/playwright/secure-agents-2026-09-14/reviewed-desktop-approach.png)
- [Scope ledger](../../output/playwright/secure-agents-2026-09-14/reviewed-desktop-scope.png)
- [Inquiry](../../output/playwright/secure-agents-2026-09-14/reviewed-desktop-start.png)
- [Mobile hero](../../output/playwright/secure-agents-2026-09-14/reviewed-hero-390-day.png)
- [320 px hero](../../output/playwright/secure-agents-2026-09-14/reviewed-hero-320-day.png)
- [320 px Offers](../../output/playwright/secure-agents-2026-09-14/narrow-offers-reviewed.png)
- [Dark mobile](../../output/playwright/secure-agents-2026-09-14/reviewed-dark-390.png)

Initial screenshots and interrupted automation attempts are retained but do not establish the final pass. Recovered test issues included stale snapshot references, a click target covered by the open mobile menu, an unsupported CLI command and sandbox/library API differences. Recovery used fresh snapshots, reachable controls and supported commands; product behavior was not weakened to pass. The pale logo and marginal muted contrast were actual preview defects, corrected before the final screenshots.

## Repository checks and the separate existing issue

| Check                  | Result                                                                                                                                                                                                                        |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm ci`               | PASS; existing lockfile installed without a package-file change                                                                                                                                                               |
| `npm run check`        | PASS: formatting, lint, 38 tests across six files, TypeScript and production build                                                                                                                                            |
| `npm run worker:build` | PASS: Worker typecheck, 18 tests and Wrangler dry-run; no deploy                                                                                                                                                              |
| Workflows              | All three YAML files parsed; two SHA-pinned action references per workflow; scripts and manual deployment boundary inspected. `actionlint` was unavailable; no GitHub run or deployment is claimed.                           |
| Unchanged built page   | Browser 1440×1000 and 390×844, all four forced scenes with no horizontal overflow, theme, Offers/Escape, VSL open/return and scope anchor checked                                                                             |
| Built inquiry          | Four intercepted POSTs only, at both viewports: pending disables submit, mocked error retains values, mocked acknowledgement resets and reports receipt. No external request escaped the route; no actual record was created. |
| `npm run audit`        | FAIL on the unchanged dependency tree: seven advisory entries, three moderate and four high. No assertion of an exploitable production vulnerability follows from this alone.                                                 |

The audit names `@vitest/mocker`/Vitest, `baseline-browser-mapping`, `browserslist`, and `sharp` via Miniflare/Wrangler. Any eventual production release must resolve or explicitly assess that gate in its own implementation scope. No automatic audit fix, dependency upgrade or unrelated code change was made for a copy draft.

Improvement disposition: **SKIP external issue action**. A sanitized follow-up is to assess and update the pinned development/build dependency tree, then rerun the repository gates and browser checks. This repository owns that work. No remote issue-write authority was supplied; duplicate search was not performed or claimed. The local evidence here preserves the finding without starting another task.

## Handback boundary

Local links were checked to resolve. Design/content methods affected the result by retaining business-first language and responsibility, reusing the existing visual identity, and checking real rendered states. The offer method kept the operating scope and pilot explicit without inventing economics.

Delivery: local draft artifacts and inspectable preview. Recovery: existing runtime and canonical source files were never changed. Business outcome: unmeasured; Gustav decides whether to adopt the proposed direction, and a future pilot would measure delivery feasibility. No approval, security assurance or publication is inferred from this review.
