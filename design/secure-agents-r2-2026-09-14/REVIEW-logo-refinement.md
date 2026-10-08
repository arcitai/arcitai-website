# R2.1 — original logo, no character

Reviewer: Codex, same-task review, 14 September 2026.

Result: PASS for the local visual revision. Gustav’s choice between the hero logo and no hero logo remains open; no owner acceptance or production release is claimed.

## Exact scope

The owner rejected the A with eyes and asked to try the existing Arc’IT logo or remove the hero character. Revision `2.1.0` removes the character’s SVG, styles, gaze, greeting, timer and live announcement. It uses the original Cut Six geometry with one short assembly animation, followed by a static logo. A keyboard-operable “Hide hero logo” / “Show hero logo” preview control allows the no-logo comparison. Hero spacing is reduced. Copy, VSL, offers, factory explanation, dashboard, runtime assets and production source remain unchanged.

Reviewed SHA-256 subjects, relative to the repository:

```text
5079add3627715f2236f998c24fd8864aee20876be1fe23530cf4444544872d0  design/secure-agents-r2-2026-09-14/DESIGN.md
8593ab1eb41c02d71f8a4827a85f7e945eae922280d4d7e9ce5743ce05ef88f0  design/secure-agents-r2-2026-09-14/index.html
e2e7db4b96105e5b2f7a87d4295adbe788a9af6577faa03aac980c239306cd93  public/assets/arcitai-mark-final.svg
```

## Observed proof

- Chromium at 1440×1000, 390×844 and 320×844: both compositions inspected; no horizontal overflow, clipped preview controls or overlap between actions and the bottom rail. Header/footer identity remains when the hero logo is hidden.
- Browser comparison against the actual SVG file confirms identical three path geometries and three rectangle geometries. No new image asset or logo redesign.
- The six modules visibly move, finish their animations and stay still. The pause control freezes all six transforms; resume completes the assembly. The first immediate-after-click sample raced the animation frame; a repeat waited for the applied state and confirmed identical paused transforms over 250 ms.
- Reduced motion produces zero logo animations, fully visible static modules and the correctly disabled motion control. Show/hide works with Enter while retaining focus on the control.
- Light/dark composition checked. VSL outline still exposes five points, and the Defense loop’s final stage still reads “A person decides what goes live.” No page errors were observed.
- `npm run check` passed: formatting, lint, 38 tests, typecheck and Vite build. `npm run worker:build` passed: 18 tests, typecheck and dry run; no deployment. The unchanged lockfile installation from the preceding iteration was reused.
- `npm run audit` still reports the same seven existing dependency advisories (three moderate, four high). No dependency changes or audit fix were made. `git diff --check` passed; tracked source/assets remain unchanged.

Selected visual evidence: [desktop with logo](../../output/playwright/arcit-r21-logo-1440.png), [desktop without](../../output/playwright/arcit-r21-no-logo-1440.png), [390 px](../../output/playwright/arcit-r21-logo-390.png), [320 px](../../output/playwright/arcit-r21-logo-320.png), [320 px without](../../output/playwright/arcit-r21-no-logo-320.png).

Visual-asset evaluation: PASS at handback. I1: clean unchanged labels; I2: actual brand geometry and palette; I3: readable at all inspected widths; I4: no face/pet or invented brand elements; I5: viewport PNG evidence and responsive HTML at intended dimensions. The design method favoured direct brand reuse and a compact two-state comparison, without unrelated reference research or another mascot.

The [original R2 review](REVIEW.md) remains historical proof for unchanged surfaces, not acceptance of this revised hero. Its background-tab limitation remains: offscreen/pause/reduced-motion behavior has evidence, but the earlier headless hidden-tab attempt did not independently prove real background-tab pausing. No live/public changes were made.
