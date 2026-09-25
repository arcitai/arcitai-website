# Operative design

## September 25 local-review candidate

The owner approved the three-brand canvas for **local implementation**, not
production release. This candidate supersedes the previous composition and
palette below. Canonical family brief: `design/customer-journey-2026-09-25/DESIGN.md`;
implementation/readback: `docs/local-review-2026-09-25.md`.

- Shared simple header: brand, Offers, Newsletter, crescent/sun theme control.
- September 25 follow-up: Offers is centered; Newsletter/theme are right-aligned.
  Theme hover has no background shape. A small steel-blue interaction accent
  (#4265a0 light / #93b4e9 dark) is under local owner review; the mark remains
  monochrome. Shared footer links now include each sibling’s own identity mark.
- Arc’IT is monochrome: #fafafa / #202020, dark #171717 / #f5f5f5.
  An 80px light grid belongs in the hero (40px mobile); no green brand wash.
- Hero: “AI and software, done for you”, without a terminal period.
  Heading and supporting text are centered over the video. Supporting text
  connects a promising demo to real team use and agreed delivery.
- One 16:9 scene with original animated monochrome mark; no separate landscape hero.
  The scene clip is honestly labelled as a landscape video, not a recorded walkthrough.
- Primary action “Discuss your project” leads to `/project`, retaining the existing
  form, FAQs and validation. The homepage keeps two offers plus the full-width
  **AI Agent Factory**, with the established reversible pipe animation.
- Footer: other two sites left, four personal social profiles right, small Gustav
  portrait only on sibling sites. No copyright, large scene or repeated slogan.
  Both sibling marks stay monochrome on hover; text uses the interaction accent.
  A viewport-height flex shell keeps the footer at the bottom on short routes,
  including `/project`, without fixed positioning or hard-coded content heights.
- Offers dropdown follows Sourdough’s compact scale and header spacing, with
  Arc’IT’s sharper corners and neutral surfaces. Keyboard order and Escape remain.
- `/newsletter` and `/newsletter/thank-you` share the family’s copy and controls.
  These are local mock flows pending real integration/release review. No bookshelf
  here: Gustav Online alone owns the bookshelf and newsletter service.
- Red/orange remains a semantic waiting signal in the pipe. Ready/brand forms
  use neutral graphite rather than mint. Keep scope and provider limits explicit.

The existing scene selection, reduced-motion behavior, media error fallback,
inquiry contract and pipeline interactions below remain applicable. Prior
composition text is retained as historical context, not current preview guidance.

## Previous September 24 direction

Arc’IT AI is the done-for-you sibling of onlinesourdough. Keep the Danish
landscapes, original monochrome Cut Six mark, Geist Sans/Mono/Pixel, warm paper,
charcoal and restrained green. Start with a working demo, MVP or prototype and
the work needed for production use. The factories are methods configured around
a client's software, not a claimed proprietary platform.

The September 2026 candidate replaces the old Spec/Build/Review/Ship ledger:
plain header → landscape hero → introduction and scene video → two compact
offers → full-width factory setup → inquiry and FAQs → landscape footer.

## Composition and copy

- Opaque navigation: Offers / Process / Scope / Start. Text-only wordmark left;
  moon/sun control right, matching Resources. No glass or mascot.
- Hero: “From prototype to production-ready software.” Original animated mark,
  direct supporting copy, Discuss a project and Meet Gustav actions.
- Introduction: “Start with what you’ve built.” One paragraph, then a 16:9
  landscape video with 8px corners. Play video appears on hover or keyboard
  focus and is always visible on touch. Activation plays the real scene clip
  with native controls. No fabricated founder film, timeline or recorded-VSL claim.
- Offers: One-off AI consultation and Software review & delivery side-by-side;
  AI agent factory setup spans the full width below them. Keep their distinct,
  abstract animations.
- Factory scope: Agent Software Factory, Agent Defense Factory, Local AI where
  it fits, Data access & retention. Keep access, review, provider limits and
  human release approvals explicit, without blanket security/compliance claims.
- Inquiry keeps honest pending/error/success states and the remaining required
  fields. It no longer asks for revenue; the API accepts older forms with it.
  Desktop aligns the introduction to the form top and places the FAQ group
  directly below it, without bottom pinning or a large empty spacer. All four
  answers start open and can be collapsed independently; compact disclosure
  spacing balances the fully expanded group against the form without fixed
  heights or filler copy.
  Mobile keeps introduction → form → FAQs. Give the privacy note its own
  readable space below the textarea.
- Footer: “Business first. Security built in.” External links only. Show the
  same scene poster as the hero through a restrained dark overlay, not a
  near-opaque green wash.

Remove redundant section kickers, numbered offer labels, placeholder status
and repeated taglines. Necessary explanatory/status text is readable, not tiny.
The live form must not retain the local mock's preview message or disabled CTA.

## Rhythm and color

A 1120px content shell at 1440px; 96px between major desktop sections, 72px on
mobile. Use 24px heading-to-copy gaps and 36–56px to the main visual. First two
offers use a 64px desktop gutter; mobile stacks them. Keep content-group spacing
smaller than section spacing. Kastanje's grouping and compact FAQs inform this
rhythm; its glass navigation, orange palette and identity are not adopted.

Light: paper #f8f2e8, ink #18211d, muted #615f56, green #236b59.
Dark: paper #171814, ink #f5f1e8, muted #bbb9ae, green #a1b99c.
The inquiry stays on the page surface, not a mint panel. Inputs have subtle
surfaces and explicit focus. The logo stays black/white.

## Media and motion

One shared scene selection drives hero, video cover and footer. A forced
?scene=morning|day|evening|night wins for review. Otherwise dark uses night;
light follows Copenhagen morning/day/evening, with day as the late-night
light-theme scene. The theme follows a saved choice or system preference;
?theme=light|dark is an explicit review override.

The received v6 clips are silent, 1280×720, 10-second scene loops, with matching
first-frame posters. They are not a spoken VSL. The runtime manifest names only
received exports; unavailable scenes retain the original JPEG and have no fake
play action. Current delivery status is recorded in release-2026-09-24.md.

Decorative videos load/play only when visible, stop offscreen/document-hidden
and stay as stills for reduced motion or data-saving mode. Visible ambient loops
use a shared clock. Explicit user video playback has native controls. The
owner requested removal of the separate global Pause motion controls.

The factory uses a continuous pipe squeezed at four stages: Scope & access,
Code & tests, Review & defence, Approval & handoff. Squares enter gradually
from outside the left edge. Closed stages hold them. Red-orange marks waiting,
amber opening and green readiness. Scroll position controls progress in both
directions: center at 55% of viewport starts opening; at 30% it is fully open.
Mouse movement temporarily previews progress; exit restores the scroll baseline.
Scrolling clears pointer/tap overrides. Enter/Space toggles preview, Escape or
blur clears it. Focus alone never opens it. Reduced motion shows a static
completed workflow. This is an illustration, not live project/security data.

## Review

Verify the built page at 1440×1000, 390×844 and a 320px overflow check in both
themes. Exercise forced scenes, poster/video failures, actual playback,
offscreen/reduced-motion behavior, reversible scroll/pointer controls, Offers
and FAQ keyboard access, anchors, form pending/error/success and safe error
text. Mock valid form requests; never create a real inquiry for release proof.
