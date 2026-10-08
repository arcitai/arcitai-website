# R3.2 — copy and navigation

22 September 2026. Codex same-task editorial/native review: PASS for this static draft. Owner approval remains pending.

Requested change: reduce sales-oriented/catchy phrasing and restore the original navigation. Source for original labels and the two-path Offers selector: `src/components/Header.tsx`. The resulting desktop labels are Offers / Process / Scope / Start; mobile shows Offers / Start. No new loop section or software-product claim.

## Exact candidate

- `openpencil/arcitai-r3.2.op`: SHA-256 `8c4c518bacb764b03a9ad2f3116ee8541f5d1d889750782fd08465bc26669c06`; 381 nodes, including 138 text nodes.
- `DESIGN.md` 3.2.0: `683b42623be7b8b0beb7b6a5a60fe5b56bd5b394c75318b36c72b1f5b481f83a`.
- Repository `content/practical-delivery-r3-2026-09-21/website-copy.md`: `9225946b36a229cc97d0c3ec7c84dc8ac3ebdac897631fad179870b976f60edf`.

## Observed proof

Inspected the live R3.1 canvas before editing. Changed 49 text nodes and added two navigation labels. Existing image, colors, type settings, logo geometry and non-navigation positions/sizes are unchanged. The new labels initially painted behind the header surface; corrected the native frontmost-first order and preserved the initial candidate in `history/arcitai-r3.2-initial.op`.

Opened the corrected project candidate through File → Open. File → Save changed the isolated working file from R3.1 hash `9bf5788e235e5440d266bb5aa404ab0b9ca8d7a8955bfab5dc0f09338e220a5f` to the R3.2 hash above, matching the preserved candidate. The original project R3.1 file retains its original hash. Its previous docs and review remain available. The working copy retains an R3.1 filename; its bytes are R3.2, so File → Save can show the older basename. The project candidate is named R3.2 and was reopened explicitly after the save check.

Actual canvas inspected at the desktop and mobile layouts, with imported Geist fonts: header labels, hero and video wording, all three service titles, and the project inquiry. No text overlap observed in the changed areas. Screenshots: `previews/r32-hero-canvas.png`, `previews/r32-scope-canvas.png`, `previews/r32-inquiry-canvas.png`.

`node openpencil/verify-r32.mjs` passes copy/nav assertions, expected hashes, preservation of R3.1 and unchanged visual properties. Workbench `check` passes with 381 nodes and the R3.2 hash. The canonical DESIGN markdown is embedded verbatim. Updated README points to the recovered editor on port 59191 and the R3.2 source.

## Scope and limitations

This is still a static native design. Offers dropdown behavior is specified, not implemented or tested as a real website interaction. VSL unrecorded; theme, form and motion are drawings. The factory explanation and scoped-production-readiness caveat remain intact. No new native PNG export was requested; use the current canvas screenshots, not previous R3.1 exports.

The known favicon 404 and oversized-document sync warning remain editor limitations; explicit reopen was used. The permanent recovered runtime is OpenPencil 0.8.4 at `~/Library/Application Support/OpenPencil/runtimes/0.8.4-arcitai-recovery`; workbench state is `~/Library/Application Support/OpenPencil/workbenches/arcitai-r31-20260922`. No production code, Worker, dependencies, deployment, Notion or AIOS changes. Application/Worker build checks are not rerun for this design-only change.
