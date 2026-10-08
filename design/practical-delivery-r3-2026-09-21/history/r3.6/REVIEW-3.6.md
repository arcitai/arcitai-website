# R3.6 local-preview review

24 September 2026. Same-task review by the parent; no independent-review claim.

## Outcome

PASS for the scoped localhost landing-page iteration. The two compact offers retain their animations; one full-width factory offer uses the transferred Spec → Build → Review → Ship animation, with slower motion, local-AI and data-retention copy. Both themes use restrained surfaces. This is not a production release and does not complete the requested Google Flow hero videos.

## Verified

- Five deterministic motion checks pass via `node --test design/practical-delivery-r3-2026-09-21/check-motion.mjs`.
- All 38 existing repository tests pass via `npm test`.
- Scoped formatting checks pass for the current design, copy and web sources.
- Browser checks: entry animation, gate opening on hover, click/keyboard pin, global pause, offscreen stop, reduced-motion static geometry and interaction, and no console errors.
- Light/dark overflow checks pass at 1440, 768, 390 and 320 px. Mobile logo stays monochrome. Dark hero loads the night illustration; inquiry uses neutral charcoal, not mint.
- Offers supports keyboard navigation and Escape; setup CTA reaches the inquiry section.
- The preview form sends/stores nothing. Enter and the preview handler caused no form, document or API transmission; an isolated repeat recorded no requests.
- Visual inspection covers the factory offer, mobile copy including data access/retention, inquiry and the decoded dark hero image. The 96-particle source geometry and four stages are preserved; the interaction remains an illustration, not live operational status.

Final browser evidence is under `output/playwright/`: `arcit-r36-factory-viewport-1440.png`, `arcit-r36-factory-viewport-390.png`, `arcit-r36-factory-details-mobile.png`, `arcit-r36-hero-final-dark.png`, plus the earlier interaction/inquiry captures. Element-only screenshots can include sticky navigation within their crop; use the viewport captures for layout evaluation.

## Scope and remaining work

Only draft `design/` and `content/` changed. Production source, Worker, dependencies and public deployment are untouched. Original references, R3.4/R3.5 history and the historical OpenPencil R3.2 remain intact. The VSL is unrecorded; the form is a non-sending preview. No public release gate is claimed; the earlier broad-check limitations remain documented in `history/README-3.2.md`.

Hero landscapes remain static JPGs. A local GPT-6 Luna/max worker performed capability checks only: empty browser inventories, explicit native Codex-app denial, then denied permission for a legitimate separate Zen route. All invocations exited without Flow generation or credit use. Gustav's separate helper task has taken over video coordination; `HERO-MOTION.md` records the handoff and prompts. The parent retains sole ownership of page integration; future generated media must be reviewed before use.

## Reviewed bytes (SHA-256)

```text
795053a448ba08258b5621a75a6faafe22918e7fda91875f6de178a4d09f8c52  DESIGN.md
6cf82e852235aa01f774ad70622d4f514746cb1ea56b55e065ee85d4e56d5c89  ../../content/practical-delivery-r3-2026-09-21/website-copy.md
0e0e5b83c15b3e7a3fc901ace7b8f63a8dbafae37b0a4958564e7da386038c95  web/index.html
16d93e1a5505ad914be7d95f0bdac7bb89466f8880856e4c81b461551de7ffca  web/style.css
00e656c2ba2776c79a39aa7f3c83f58c6741312cf7e2590f3a6bd2190ad4ec24  web/preview.js
859f33da9026682c4270c51dbcac0f0fca79751b6969031068765afd2e441f6c  web/motion-model.js
```
