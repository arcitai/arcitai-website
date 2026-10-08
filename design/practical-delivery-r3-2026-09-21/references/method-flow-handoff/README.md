# Spec / Build / Review / Ship — Arcit AI handoff

Gustav requested this handoff on 24 September 2026 to task
`01a06708-31b3-7ca3-8ac9-3c823119f7bc` (Arcitai landing page + Planlæg VSL-videoer).
He removed this bottom animation from the onlinesourdough Main preview so that
Arcit AI can use it instead. The living sourdough logo and Resources graph are
different components and are not part of the handoff.

`MethodFlow.tsx` is a standalone React component. Keep `method-flow.css` beside
it, import `{ MethodFlow }`, and render `<MethodFlow />` in the chosen section.
No dependency besides React is needed. The host should supply `--text`,
`--muted`, `--line`, `--focus` and `--font-mono`, or replace those CSS variables
with Arcit AI's tokens. Review colors and spacing in Arcit AI's actual context.
`animation-preview.png` shows the component on the original light background.

The same 96 work particles move through Spec, Build, Review and Ship. Pointer
position opens the two bottlenecks; focus opens both; clicking pins/unpins.
Animation stops offscreen and when the document is hidden. Reduced motion
uses a static drawing and directly updates the opening state. Mobile labels
move above the SVG. Only mount one instance as supplied: its SVG gradient ID
is fixed and should be made unique if multiple instances are needed.

Source adopted from Gustav's preserved r5 Main 05 design and verified in the
onlinesourdough preview: particles move, wall paths change on interaction,
pin toggles aria-pressed, and keyboard/reduced-motion behavior works. No
Arcit AI integration or deployment is claimed. Continue using that task's
existing authority, design direction and review process; this handoff is
not a new instruction to publish.
