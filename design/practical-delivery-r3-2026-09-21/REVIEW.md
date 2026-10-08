# R3 draft review — 21 September 2026

**Result: PASS for the saved design draft, with explicit tool limitations.** Reviewer: Codex, same-task review, not an independent reviewer. Gustav’s final editorial/design choice remains open. This is not production acceptance, a responsive implementation, an accessibility certification or a security audit.

## Accepted brief and scope

The current request asks for practical expertise around a customer’s existing/vibe-coded build, a restrained revision of Arc’IT’s own identity, a Kastanje-inspired hero, abstract offer graphics, no software/defense loop section, an external-links-only footer and an editable OpenPencil source. The three X posts belong in a research issue; a future dashboard/template repository is a separate decision.

The draft satisfies that scope. All three offers and their qualifications occur in both desktop and mobile. The VSL and form are explicitly static placeholders. The optional dashboard is a small sample-data/template reference. No new proprietary-platform claim, mascot, invented customer proof, price, certification or security guarantee was added.

Only new draft material in `content/` and `design/`, plus authorized GitHub issue #6, was written. `src/`, `worker/`, production assets and existing R1/R2/dashboard artifacts were not changed. No deploy, new repository, agent run, Notion or AIOS mutation. `git diff --check` passed; production CI/build tests were not run because production code was untouched.

## Reference comparison

- **Arc’IT R2.1:** original panorama, Cut Six silhouette, Geist family and green/paper identity retained. Front-page factory product names and literal icons removed; VSL remains prominent.
- **Kastanje:** scenic full-bleed desktop hero, restrained translucent navigation and mobile text-before-scene structure adopted. The hero stays centred because Gustav explicitly asked for the logo there. No chestnut, eyes, orange identity, pricing or product UI copied.
- **Agentic Engineer:** airy offer grouping with original small points/rings/strokes, not copied assets/code or literal shields/gears. The document shows still states plus motion instructions, not functioning animation.
- **Recovery:** preserved R1, R2 and snapshots were inspected. The exact extra Chrome variation was not identified. No claim that this new revision is that lost version.

The X research records the supplied posts and a bounded follow-up, not an unperformed deep review of linked videos, the full Pragmatic Engineer article or Sandcastle’s code/licence. [Issue #6](https://github.com/arcitai/arcitai/issues/6) was created, read back and remains open.

## Native editing, saving and reopening

OpenPencil 0.8.4 external runtime: `/private/tmp/kastanje-product-r8-draft/runtime/extension`. Compatible version/layout checked. Historical release provenance: commit `c51d7ed41a96068a09127bbc096fee143fce0b22`, historical VSIX SHA-256 `7ce6cde22f7e8584de2faca0279f6d74438675291c2547a7d99230fc0e629342`. The original VSIX bytes were **not freshly verified**. Current server binary SHA-256: `aa44f68f56d333c465aa2852a4a47e2ebdae469521db0392f0cd9123a1479fa5`. Runtime remains external; no runtime copied into this repository.

Isolated workbench: `/private/tmp/arcitai-r3-openpencil-20260921`, [loopback editor](http://127.0.0.1:59403/). Started using the compatible workbench helper; later checks/export used its currently available AIOS 0.12.0 installation, also targeting OpenPencil 0.8.4. The original 0.11.0 package path became unavailable during this continuation.

1. Opened and inspected the live canvas before authoring. Tested the owned image fill and original font. Opened the known private seed through **File → Open**.
2. Authored three native root frames with editable descendants through the live native API. Imported the licensed Geist, Geist Mono and Geist Pixel TTF fonts through **Agents & MCP → Fonts**; the panel confirmed all document fonts available.
3. First inspection exposed native front-to-back sibling ordering. Corrected stacking, inspected the resulting logo/text/scene, then improved small labels and mobile spacing. The old attempts are not acceptance proof.
4. Used **File → Save**. The known private working file changed from the one-node seed hash `d956e8497282a564dbe0cd672890f0975aae6fd7b9e419fd3644bab2c1be983f` to 350 nodes at `3977148fcd11b460039042c349b518b337654dcdf718f795a8b895afe77fd21c`; the later readability save was `9fde049ecf0dea8e940cf287a4553105fb763b19f70a4e013339851f443fd3cb`. A final File → Save after embedding DESIGN produced the bound candidate hash below. The project seed stayed unchanged.
5. Verified the final project target was absent, then preserved it through native **save_document** as `openpencil/arcitai-r3.op`. Final candidate and private working file had identical bytes (1,094,852 bytes).
6. Reopened that saved candidate through the visible **File → Open** chooser. The UI showed `arcitai-r3.op`; desktop, mobile, notes, imagery and imported fonts rendered. Reopen proof: `output/playwright/r3-pencil-reopened.png` and the selected canvas previews.
7. Native `check` returned PASS for 350 nodes, the exact source SHA and a validated native export. Native exports were generated from the saved private working file; helper checks confirmed original seed/working bytes unchanged by export.

`verify-artifact.mjs` also passed: 350 unique editable nodes, including 132 text nodes; three correctly sized root frames; one deduplicated embedded panorama; no negative positions or child boxes beyond parent bounds; minimum text size 11; required offer/security/privacy copy on desktop and mobile; rejected headings absent. This structural check does not replace the visual review.

## Visual/editorial observations

Inspected the reopened canvas, complete board, desktop hero/VSL, offer section, inquiry/footer and the mobile composition. No observed overlapping text or obscured primary action remained. Mobile was tightened to reveal scenery earlier without shrinking body text. Copy leads with the existing working build and a useful next step; security qualifications and ongoing-responsibility wording remain explicit.

Solid-color contrast calculations: ink/paper 14.80:1; muted/paper 5.75:1; action/cream 6.09:1; muted/inquiry surface 5.40:1. Hero uses warm-white text over the darkened owned scene and was visually inspected. Static drawings do not prove keyboard navigation, focus, form errors, screen-reader semantics or responsive reflow. Those remain future implementation tests; the 390px frame is a designed composition, not evidence of every screen width.

## Limitations and rejected proof

- The imported font registry is browser-origin-local, not embedded in `.op`. Fonts and licence are bundled for reopening elsewhere. A new browser may need the explicit import steps in README.
- **Both native automatic PNG export and the tested GUI Export image download use fallback typography in this version.** Native PNGs prove dimensions/composition and successful export, not accepted Geist rendering. The actual canvas previews are the typography evidence.
- GUI PNG export produced a real local download, `arcitai-r3-01 · Desktop · 1440 · Practical delivery.png`; its retained 1× copy is labelled `desktop-ui-export-1x-fallback-fonts.png` under native exports. GUI export is not passed off as a correct-typeface canvas screenshot.
- Oversized canvas capture experiments produced incorrect crops. They were moved to `output/playwright/r3-unaccepted-crops/`, not delivered as full-page previews. The bounded board overview is composition evidence; normal viewport canvas screenshots provide detail.
- Browser console: favicon 404 and a native `mcp-sync` oversized-document-push warning (>2 MiB expanded payload) after reopen. Persisted source/hash and native readback remained verified; this does not establish reliable automatic browser-to-server multi-client sync for future edits. Save/retain a new candidate explicitly after further editing.
- Static stills plus motion notes only; no film, submission, working demo, installed factory or published open-source template. Existing code stays untouched.

## Bound artifacts

Paths are relative to this draft directory unless otherwise stated. All digests are SHA-256.

| Artifact | Digest |
| --- | --- |
| `DESIGN.md` v3.0.0 | `bfa148b977851d0633d806448536ecca05d3f5b2c302b78d92c60b697d34a935` |
| `../../content/practical-delivery-r3-2026-09-21/website-copy.md` | `044a3fb8c1ed5d656786fea3e65ec1f55fed7c385bd93ecd5e8d8eb64618d36b` |
| `openpencil/arcitai-r3.op` | `4e5194f8f9198e6462a5f58003ca43febf973ceb9addd06d47261b618d1198d3` |
| `previews/board-overview.png` | `7aab3498d726593a96900e9f6d2a503c15919d980b9fe5e1f36435b20464bcc7` |
| `previews/hero-canvas.png` | `0923c6f9e88c84d1544e5ae79dda094d47a4fa442800f3dd8e2ccd7f40d55c70` |
| `previews/offers-canvas.png` | `ddedd920e7ea4d649ef0f522c11e72c86b0d4bbe76e342f050de0bc785e38593` |
| `previews/inquiry-footer-canvas.png` | `0e41e043cf5d264a0c204355627ccc5e6af13f99221154569b1cdcf2a79447ac` |
| Native export: desktop 2880×8620 | `5286367ca642ded6bccf279a8622a190383cea8bca0a2a0445c6d85b7cd72d4a` |
| Native export: mobile 780×13440 | `fdd1013595768f20da706376943c432b6c105e75feda277950a0f30292d6b4ae` |
| Native export: notes 2000×4160 | `ccae14bd9d3f19ac2cec4b95f5fa42a9553bd4f9be4c0ef800352f12afdf71f1` |
| `openpencil/fonts/geist-sans-variable.ttf` | `a32fa5e2aa4cbdc58edf2321f773245a9b124f774c326a8a85b91edc7108d22c` |
| `openpencil/fonts/geist-mono-variable.ttf` | `d11707e97a939e1d1819c864e967fbece8381432bde026df8882c3ec141f2b98` |
| `openpencil/fonts/geist-pixel-square.ttf` | `fa4aa1bbd0ab2b282772869f1786cc61a18f978d9084b201eb8da5ada528d349` |
| `openpencil/fonts/LICENSE.txt` | `930853ee1daa68554d9e35c8a9175affb74f699fad9a5da6ee5ebe76379d9137` |

The authoring scripts passed Node syntax checks. Same-task visual, editorial and native checks are complete for this draft; workbench is left available for Gustav’s review. Future feedback should revise a preserved candidate, not overwrite prior accepted/recovered work without inspection.
