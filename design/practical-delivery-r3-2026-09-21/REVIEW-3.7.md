# R3.7 factory-motion review

24 September 2026. Same-task parent review, not an independent review or final owner acceptance.

## Result

PASS for this local animation iteration. The continuous squeezed pipeline is restored, with four stages grounded in the current factory contract. All 96 squares start at the left. Closed stages are red-orange, opening stages amber, and completed stages use the same green as the other two offer animations. Thin guides, square particles and the surrounding design remain consistent.

Scroll/pointer/focus reveals a one-way sequence. Bars fill once; pointer exit, moving left or scrolling back cannot drain them or re-close the channel. Closed stages hold the work. The intermediate bracket/portal design was rejected and is not the delivered geometry. No proprietary platform, automatic deployment or clean-security claim is introduced.

## Evidence

- Eight motion-model tests pass: left-only start, no leaks through closed gates, monotonically filling sequential bars, persistent completion, bounded particles and queues, four actual pipe constrictions, scroll mapping and motion suppression.
- Browser readback confirms empty red-orange start, sequential scroll reveal, no bar reversal over nine samples, all-green completion, persistent opening after pointer exit/back-scroll, pause/resume, offscreen stop and reduced-motion still.
- Separate pointer and keyboard checks pass. A first pause test incorrectly assumed zero initial progress after a reload that restored scroll position; corrected to compare the actual paused state. No product bypass or test weakening was required.
- Light/dark layouts have no overflow at 1440/768/390/320 widths. Closed and partial states were visually inspected; partial state readback is `ready,active,waiting,waiting`. No page errors observed.
- All 38 existing repository tests pass. Scoped source/design/copy formatting checks pass.
- Source reference was re-inspected in a real browser: Agentic Engineer's red closed constrictions, green opened segments and small moving squares. Its code, numerical claims and business copy are not copied.

Screenshots under `output/playwright/`: `arcit-r37-pipeline-closed-final.png`, `arcit-r37-pipeline-partial-final.png`, `arcit-r37-pipeline-partial-dark-final.png`, `arcit-r37-factory-light.png`, `arcit-r37-factory-dark.png`, `arcit-r37-factory-mobile.png`.

## Remaining scope

R3.6 is preserved under `history/r3.6/`. Production code, Worker, dependencies and deployment remain untouched. Hero video production is owned by the user's separate animation helper; no accepted clip is integrated here. The prepared, currently unused `web/hero-video.js` controller has seven mock-boundary checks, not real-media/browser integration proof. Keep rejected generated takes out of the page. VSL and non-sending inquiry limitations remain unchanged.

## Reviewed SHA-256

```text
c0798c38201ef9e84d57e11baf79f0d2a810c8661e04de9ef9e60ee39180e64e  DESIGN.md
7d4cb7564c3c6990c89c265558f17deda1a7138bc69714068190341f21e31aca  ../../content/practical-delivery-r3-2026-09-21/website-copy.md
e7a1d0d31bafb92268363fbb5e2c0b91f38f4fe53c29e508485099cec38b2333  web/index.html
d362161634cd811b813d20873a7135661cb8b12cb685e30bc90b8c5680becf04  web/style.css
828c1dede0fd39efdba1476a421475882d4e59a41299c244f31d9a1015ab5a64  web/preview.js
1ebf215baedc642c55ae7e89ebd8302506cc281c00ebb7ca2bda09e0c798db20  web/motion-model.js
```
