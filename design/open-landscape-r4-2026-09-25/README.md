# Arc’IT AI — Open landscape / R4

25 September 2026. Composition proposal, **waiting for Gustav’s review**.
This is not a production release or an approved replacement for `docs/design.md`.

## Open the proposal

- Editor: http://127.0.0.1:60864/ — left running in the explicitly authorised separate Chrome window.
- Editable source: [arcitai-open-landscape-r4-owner-review.op](arcitai-open-landscape-r4-owner-review.op).
- Direction and brief: [DESIGN.md](DESIGN.md).
- Correct-font hero capture: [preview](../../output/playwright/arcitai-r4-hero-preview-v2.png).
- Native board exports: [exports-owner-review](exports-owner-review/).

The editor contains a desktop composition through the factory offer, a dark
hero, a 390px mobile composition through the first two offers, and motion notes.
The accepted inquiry/footer remain in the implementation and are not redrawn.
Native boards show static motion states, not working animations or controls.

## Design and checks

One’s scenery and tactile primary action informed the visual anchor. Agentic
Engineer informed the separation of message and graphic. The result retains
Arc’IT’s copy, licensed Geist fonts, monochrome Cut Six geometry and existing
landscape assets. No third-party media was adopted. `DESIGN.md` records the
reference-to-design decisions and the sources inspected at desktop and mobile.

Self-review: Codex inspected the actual editor canvas, light/dark hero, player
composition, offers, factory and mobile. Corrected mobile motif clipping,
hero/body wrapping, missing mobile theme control and factory action-label
layering. The source has 291 editable nodes in four boards. No claim of
responsive behavior, accessibility interactions or playback is made from a
static OpenPencil document. Owner approval is still pending.

The factory label is intentionally a separate foreground text layer to avoid
the observed nested text rendering issue. Hero line breaks and mobile paragraph
breaks are explicit because imported-font wrapping differed from native export.

Inspected browser proof in `output/playwright/`:

- `openpencil-r4-owner-review-reopened.png`: exact final candidate opened through File → Open.
- `openpencil-r4-owner-review-factory.png`: repaired action label visible.
- `openpencil-r4-owner-review-handoff.png`: current editor left open.
- `openpencil-r4-final-hero-v2.png`, `openpencil-r4-final-dark-v2.png`,
  `openpencil-r4-final-desktop-offers-v2.png`: unchanged regions inspected with Geist.
- `openpencil-r4-final-mobile.png`: mobile hero, including theme control and corrected wrapping.

Earlier candidates, exports and failed/zoomed-out captures remain as history;
only `owner-review.op` is the selected candidate. The native exports use fallback
typefaces, unlike the imported-font editor, so they are not exact typography proof.

## Save, reopen and provenance

File → Save changed the known private working file from the one-node seed
(`d956e8497282a564dbe0cd672890f0975aae6fd7b9e419fd3644bab2c1be983f`)
to the first 290-node candidate, then to the selected 291-node candidate.
The final working file and saved project candidate both hash to
`6395beef34c28e8fef6ee802d731042849c9a360c3c9e5aa2af503916fb5fcba`.
The original seed remains unchanged. The final candidate was reopened through
the visible File → Open chooser, and its canvas inspected. Native `export_frames`
produced four PNGs without changing the source or working file; helper check
validates the selected source and export. DESIGN hash:
`6923d5f1dea684c357b70977066445390b31442d66291282529b325378324f62`.

Runtime: externally recovered OpenPencil 0.8.4, release revision
`c51d7ed41a96068a09127bbc096fee143fce0b22`; local reuse, not newly verified VSIX
release bytes. Its `RECOVERY.md` and license remain in the existing runtime.
Private task state: `/private/tmp/arcitai-r4-QyVIad/editor`.

Geist imports persist in the browser origin, not inside `.op`. In another
browser, select a text layer → font dropdown → scroll to **Import font**.
Use the three licensed TTF files in
`../practical-delivery-r3-2026-09-21/openpencil/fonts/`. The existing Fonts panel
incorrectly reported all fonts available before these imports.

No React, Worker, operative documentation, dependencies, production, existing
localhost service or prior design source was changed by this composition task.
