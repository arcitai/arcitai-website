# Brand-family production release — 2026-09-25

## Outcome

The owner approved the v4.2 local previews and explicitly authorized deployment
of all three sites. All three production releases completed and were read back.
The newsletter is connected to the shared Worker, but **live signup remains
blocked by the existing Kit credential returning HTTP 401**. Do not describe
the complete newsletter journey as working.

This report supersedes the production-not-authorized/unchanged statements in
the historical local review. No new hosting platform, plan, campaign, DNS
configuration or customer inquiry record was created.

## Exact releases

| Surface                  | Released commit/version                    | Delivery/readback                                                                                                                                                                                                                                                            |
| ------------------------ | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| gustavonline.com         | `ac06cc530f10ea424ae5d1cf3e0c17ad64ae1cdd` | Feature PR [7](https://github.com/gustavonline/gustavonline-website/pull/7) → dev; release PR [8](https://github.com/gustavonline/gustavonline-website/pull/8) → main. [Pages run](https://github.com/gustavonline/gustavonline-website/actions/runs/36184164811) succeeded. |
| onlinesourdough.com      | `f91607ec9a1192c1b37354e930f07d8d586d2602` | [PR 10](https://github.com/gustavonline/onlinesourdough/pull/10). [Pages run](https://github.com/gustavonline/onlinesourdough/actions/runs/36183967678) succeeded.                                                                                                           |
| arcitai.com              | `d9196d93e47fda38532f85caa3de6ec564ef8cb3` | [PR 7](https://github.com/arcitai/arcitai/pull/7). Cloudflare Pages production deployment `62342018-492e-48c9-b13c-b3317b15808c`, [immutable preview](https://62342018.arcitai.pages.dev).                                                                                   |
| Arc’IT inquiry Worker    | `eb2addf7-6f5b-4362-ab7c-94ea651f6230`     | Built from the Arc’IT main commit above; deployed before the static page. Custom domain `api.arcitai.com` verified.                                                                                                                                                          |
| Shared newsletter Worker | `5e3900a8-4fa0-4123-a65b-750f10e736e2`     | Scoped source commit `6bc7b44`, now included in gustavonline main. Exact branded origins allowed; Kit timeout, sanitized status logging and acknowledgement validation.                                                                                                      |

OSD's newer About content and living-bread implementation were integrated with
the accepted family composition before release. Unrelated legacy design files
were preserved and excluded. Each local task branch was subsequently
fast-forwarded to its released main commit; no reset or force push was used.

## Verification against the frozen release

- Clean, isolated worktrees installed from lockfiles. Gustav: typecheck, 21 tests,
  build and audit passed. OSD: typecheck, 28 tests, build including 19 static
  artifact checks and audit passed. Arc’IT: full format/lint/test/build check,
  66 tests and audit passed; Worker typecheck, 21 tests (a subset of the 66)
  and dry-run bundle passed. All three dependency audits reported zero findings.
- PR CI passed before merging; both GitHub Pages delivery jobs subsequently
  reported success. Cloudflare deployment listing confirmed the new Arc’IT
  deployment as Production/main with the expected source SHA.
- Public browser readback covered 11 routes at desktop 1440×1100 and mobile
  390×844: each homepage, newsletter, direct thank-you, OSD About and Arc’IT
  project inquiry. HTTP 200, no horizontal overflow, no localhost sibling links
  and no review-only notice. Short-page footers reach the viewport bottom.
- Offers open and Escape-close, theme toggles and production sibling links were
  exercised. All four OSD book illustrations decoded successfully. Portrait,
  collage, bread, monochrome logo and accepted layout were visually inspected.
- Arc’IT day ambient video and click-to-play video both reached readyState 4,
  actively playing. Both day/evening MP4 endpoints support HTTP 206 range reads.
  Morning/night remain the accepted still-image fallback; no missing clip was
  invented. The player is an ambient landscape clip, not a recorded VSL.
- All thank-you HTML routes return `noindex, follow` and their own canonical URL.
  Direct navigation without a receipt does not claim a successful subscription.
- Newsletter form proof on actual production builds with **intercepted** API
  responses passed for all three brands: failed submission retains the email,
  acknowledged success reaches the receipt, and each brand sends its own source.
  This synthetic success is not evidence of a live Kit subscription.
- Live newsletter CORS preflight passed for all three origins (the existing
  Worker returns HTTP 200 for OPTIONS, which is valid). Live API testing with
  the previously authorized owner address returned 502; scoped Worker logging
  established upstream Kit 401 without printing the email or API key.
- Arc’IT inquiry live invalid-input test returned 400 and the correct CORS
  origin. No real lead was submitted to Notion. Backward compatibility with old
  revenue-bearing forms and the new form is covered by Worker tests.
- Gustav's writing endpoint returns 200 with an empty archive. No published
  issue or welcome-email automation is claimed.

An existing test-browser cache initially served Gustav's old newsletter redirect
and old asset names after release. Independent HTTP reads and a fresh browser
verified the new direct routes and current assets. GitHub Pages HTML advertises
`max-age=600`; a previously open tab can require reload/cache expiry.

Final inspected screenshots are local evidence, not runtime dependencies:

- `output/playwright/verified-live-gustavonline-home.png`
- `output/playwright/verified-live-gustavonline-newsletter.png`
- `output/playwright/verified-live-gustavonline-thanks.png`
- `output/playwright/verified-live-onlinesourdough.png`
- `output/playwright/verified-live-arcitai-hero.png`

## Required next action: Kit credential

1. Obtain a valid Kit **v4 API key** from the owner's Kit account. The connector
   could not list forms because its API access requires a paid plan; no upgrade
   was authorized or purchased. Do not infer that replacing the key alone proves
   that the account has the required access.
2. Replace only `KIT_API_KEY` on the existing `gustavonline-api` Worker, privately
   through Cloudflare or `npx wrangler secret put KIT_API_KEY` from the
   gustavonline repository. Never paste the key into chat or commit it.
3. Repeat an owner-authorized live signup from each branded newsletter page;
   verify Kit acknowledgement, source attribution and receipt navigation.
   Inspect subscriber state and any expected confirmation/welcome automation
   separately. No campaign is authorized by this release.
4. Only then mark newsletter delivery complete. Until then all three forms
   display the real failure instead of falsely claiming that someone joined.

## Recovery points

- Gustav previous main: `9ade3a22127834d7c73eeff9857bec2bf2270715`.
- OSD previous main: `43238db5d2b9232d92f462cd9131931a6732518f`.
- Arc’IT previous Pages: `838a5464-838d-418c-9a8c-b886f13ce254`.
- Arc’IT previous Worker: `a6099ce3-42c0-48b4-b851-bc0b351ffa52`.
- Shared newsletter previous Worker: `897af259-667a-4354-aa24-ae269ecb450c`.

GitHub Pages recovery uses a normal revert PR and a successful Pages deployment,
not history rewriting. Arc’IT can restore the prior Pages deployment and Worker
version together. The newsletter's 401 predates this release; restoring its
previous code does not repair that credential.

## Completion and publishing evaluation

**PASS — approved site delivery:** exact owner-approved scope, existing
destinations and identities; final artifacts and CI bound to the commits above;
live readback and recovery identities recorded. Published static assets contain
no provider credentials or customer information. No new commercial claims,
campaigns, purchases or commitments were introduced.

**OPEN — functional live newsletter:** Kit authentication blocks the remaining
operational acceptance. This report and the final handoff explicitly retain that
requirement for tomorrow; synthetic form tests do not close it.
