# R3.1 — bounded design and editorial review

21 September 2026. Reviewer: Codex, same-task technical/editorial/native review. Result: **PASS for this static draft**, with export limitations below. Gustav’s final design/copy choice remains pending. This does not certify production readiness or security of any software.

## Requested outcome

Restore the existing opaque Arc’IT header, wordmark only; black/white Cut Six logo. Add the promising-demo/MVP/prototype-to-production-ready story. Clarify onlinesourdough as an AI working method and the factories as two reusable AI-enabled systems Arc’IT implements through templates and existing tools. Do not restore the loop section, imply a proprietary platform, redesign the brand or change production.

## Bound source

- `DESIGN.md`, version 3.1.0: SHA-256 `2be85e234f786a588e8cf88a18577a9f160cac9c45e0730d5bf64fce7e3d609f`.
- `content/practical-delivery-r3-2026-09-21/website-copy.md` from repository root: SHA-256 `8e1888e22cddb22e568f4eab323b63966fb559ad5eb2a2937e879de327476664`.
- `openpencil/arcitai-r3.1.op`: SHA-256 `9bf5788e235e5440d266bb5aa404ab0b9ca8d7a8955bfab5dc0f09338e220a5f`.
- Native source contains 379 editable nodes, 136 text nodes, one embedded scene image, and the exact current DESIGN markdown. Frame sizes: desktop 1440×4342, mobile 390×6784, notes 1000×2500.

## Observed checks

- Inspected the existing live canvas before editing. Native MCP changes were not automatically visible in the browser, consistent with the existing oversized-document sync warning. Saved the native revision to an isolated preview file and opened it using **File → Open**; no reliance on a stale canvas.
- **File → Save** changed the known private working file from the original R3 hash `4e5194f8f9198e6462a5f58003ca43febf973ceb9addd06d47261b618d1198d3` to the R3.1 hash above. Preserved the saved bytes at the absent project candidate path, then explicitly reopened `arcitai-r3.1.op` through **File → Open**. Its title and new content were observed on the canvas.
- The original R3 `.op` remains at its hash above. Original project `seed.op` remains `d956e8497282a564dbe0cd672890f0975aae6fd7b9e419fd3644bab2c1be983f`. Earlier docs, native source, exports and review remain available.
- Corrected the small drawn theme control’s half-disc bounds after inspecting its first render; the final reopened canvas shows the half-disc. Controls remain static.
- Inspected actual canvas typography, opaque headers, both hero logos, VSL marks, desktop offers, mobile system explanation, practical questions and footer. Copy fits the selected desktop/mobile compositions without shrinking body text. Added height below longer offer copy. Black/white specimen pair is included in notes.
- `node openpencil/verify-r31.mjs`: PASS. Checks source hashes, source preservation, copy parity with markdown, bounds, IDs, frame sizes, opaque full-width headers, embedded direction, 36 strictly black/white logo pieces and absence of the rejected loop headings. This is structural evidence, not a browser accessibility test.
- Original `verify-artifact.mjs`: PASS for preserved R3.
- Workbench `check` with 379 nodes and the R3.1 hash: PASS. OpenPencil 0.8.4, isolated state `/private/tmp/arcitai-r3-openpencil-20260921`, editor `http://127.0.0.1:59403/`.
- Native `export_frames` exported the three top-level frames and preserved working/source hashes. Existing runtime provenance and imported Geist-family fonts are as documented in the R3 review.

## Visual proof

Canvas screenshots with imported Geist fonts:

- `previews/r31-hero-canvas.png`
- `previews/r31-offers-canvas.png`
- `previews/r31-systems-and-faq-canvas.png`
- `previews/r31-mobile-faq-canvas.png`
- `previews/r31-board-overview.png`

Native PNGs under `openpencil/native-exports-r31/`:

- Desktop, 2880×8684: `0130593939d78996d135eed5d73d7441fe2f7c49bd4bc5aebbca43633b4df9aa`.
- Mobile, 780×13568: `63adc05b4faa6bc2780b6126cbb5d57d2b6c79acdc921d7fda249aa9be589cf0`.
- Notes, 2000×5000: `0c382a3cb15136ca872f56a2c4b9a1d131ae280ae4b204769c52329dcbeb8087`.

## Limitations and unchanged scope

Native PNG exports use fallback typography, unlike the inspected canvas; they are not the typography reference. The editor’s oversized-document warning means future automatic multi-client sync is not proven. Use the saved `.op` and explicit File → Open.

This is an editable static design, not a responsive website, working theme toggle, motion implementation, recorded VSL, sent inquiry, deployed factory or security guarantee. Only 1440px and 390px compositions are drawn; 320px responsive behavior and real keyboard/form semantics belong to later implementation. No production code, Worker, dependency, Notion, AIOS, deployment or new GitHub write was needed. Runtime application checks were not rerun for this design-only revision.
