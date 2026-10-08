---
name: Arc’IT AI — build on what works
version: 3.4.0
---

# Direction and scope

Started 21 September; current revision 24 September 2026. Gustav wants a calmer landing page about his expertise and practical delivery: review what a customer has already built, improve its security and foundations, and establish a useful way to continue the work. The current deliverable is revised English copy and the full local web preview. The saved OpenPencil R3.2 remains a preserved earlier companion, not a synchronized R3.3 source. No live page, Worker, AIOS, Notion, sibling project or dependency changes. Preserve previous revisions and the optional dashboard concept.

## Baseline and requested changes

R2.1 provides the green landscape identity, Geist family, original Cut Six hero logo, VSL-first rhythm and business-first responsibility. Retain those. Remove the pictorial offer icons, “Prototype to Production” and “AI Agent Factories” as front-page offer names, and the entire “Two systems / One delivery process” section. The earlier mascot is not reintroduced.

Use only the wordmark in the header; the actual mark stays centred in the hero. Footer has external links only and “Business first. Security built in.” instead of the rejected slogan. No large dashboard sales section or proprietary-platform claim. The earlier optional example link is removed in R3.3.

Owner correction, R3.1: this is primarily a copy, restrained animation and logo-placement revision of the existing Arc’IT direction, not a new visual identity. Restore the plain full-width header from R2.1: opaque paper/dark theme surface, a fine bottom rule, wordmark left, text navigation and theme control. No inset glass panel, backdrop blur or translucent navigation. The Cut Six logo is strictly black `#000000` on light surfaces and white `#FFFFFF` on dark surfaces. Never green or sage. Keep green in the landscape and supporting accents, not in the logo.

Owner correction, R3.2 (22 September): use more descriptive, less sales-oriented copy. Restore **Offers · Process · Scope · Start**, verified against `src/components/Header.tsx`. Offers is the existing Arc’IT/onlinesourdough selector, not a renamed service-section anchor. Process maps to the founder introduction; Scope to the services; Start to the inquiry. Mobile retains Offers and Start, with Process and Scope available through the page itself. Keep layout, assets, colors, body type and monochrome logo unchanged. Use “Project inquiry”, “AI consultation”, “Code and security review” and “Agent workflow setup” instead of catchy prompts. The hero states “From prototype to production-ready software”; the scoped-readiness qualification remains in the FAQ.

## Reference adaptation

Current owner clarification, R3.4 (24 September): keep the calm, customer-first R3.3 page, but make the third service explicitly about **done-for-you setup**, a central offer. Use **03 / Done-for-you setup**, **Agent factory setup.** and **Discuss a setup ↗**. Briefly name Agent Software Factory for development, testing and review, and Agent Defense Factory for assessing security findings after release. This supersedes R3.3’s blanket omission of their names. Do not add an architecture explanation, runtime/product pitch, dashboard section or monitoring guarantees. All other page copy and visual choices remain unchanged.

1. **Arc’IT R2.1**: [previous direction](../secure-agents-r2-2026-09-14/DESIGN.md), actual local panorama and Cut Six geometry. Highest visual precedence after the owner’s corrections. Reuse existing owned assets; no brand redesign.
2. **Kastanje, “Landing page redesign”**, task `01a0ab4c-458d-7f51-9893-a1e3e33ea4c1`. [Live reference](https://kastanje-demo.gustavonline.workers.dev/), previously inspected at 1440×1000 and 390×844. Historical hero inspiration only. Its translucent navigation is explicitly rejected by the owner in R3.1; it does not govern Arc’IT’s design direction. Keep the already useful scenic treatment and readable mobile separation without further redesign. Do not transfer its chestnut, orange palette, pricing, product UI or customer claims.
3. **[Agentic Engineer](https://agentic-engineer.ai/)**, live offers inspected 21 September. Transfer the small abstract moving marks, generous negative space and direct offer grouping. Create original green point/ring/line studies; no shields, gears, code windows, literal consulting icons or copied motion code. Do not inherit its pricing, scarcity or proprietary-platform claims.

The reference screenshots remain task proof in `output/playwright/`, not design assets or customer-facing images. “Codex Fred” was clarified as the Kastanje task, not another website.

## Page composition

The existing R3.2 native source has desktop and mobile frames and a notes frame. The current R3.4 companion is responsive HTML at `web/index.html`; its English copy is maintained separately. Both are durable files. Editor and preview servers are only ways to view their respective revisions.

Desktop: full-width opaque 72px header → centred white logo/headline/CTA over panorama → founder video → three airy offer columns → inquiry and practical questions → green landscape footer. No factory loop between offers and inquiry. Reading shell 1160–1200 px, generous section gaps and fine rules rather than nested cards. Use green to interrupt the warm reading surface, not black/beige throughout.

Mobile: opaque 62px header with the wordmark, Offers, Start and theme control; readable copy on warm paper before a shorter panorama strip. The black hero mark remains centred above the text. Stack the three offers; keep their abstract marks small. Inquiry uses one column. Footer external links may wrap. Do not shrink body copy or omit qualifications to fit.

## Identity and tokens

Paper `#f8f2e8`, cream `#fffaf1`, ink `#18211d`, muted `#615f56`, deep green `#14211d`, action green `#236b59`, pale sage `#b9d9c8`. Warm-white text over a darkened desktop panorama; strong dark text on mobile paper. Green buttons with warm-white text in reading sections. At least 16 px body on mobile, 17–18 px desktop; restrained mono labels no smaller than 11–12 px in the design. Contrast and spacing must be inspected in the actual native canvas.

Geist Pixel for the wordmark and primary headings, Geist Sans for prose, Geist Mono for navigation and labels. Use the real Cut Six geometry, black or white only, including small VSL marks; no eyes, shadow, limbs or perpetual character motion. Dark scene/video surfaces take the white mark even when the surrounding page is light. Light surfaces take the black mark. The notes include both light/dark logo specimens; the drawn theme controls are not working toggles. The landscape is the existing `public/assets/arcitai-panorama-day-v1.jpg`, not new AI-generated artwork. Its illustration remains raster; text, controls, logo geometry and abstract motifs remain editable.

## Abstract graphics and motion intent

Three original compositions: scattered points gathering into a quiet centre; offset rings finding alignment; a paced line of short strokes with one advancing accent. They suggest focus, examination and continuity without literal icons or an architectural diagram. The native document shows a still state and separate motion notes. Do not claim that OpenPencil demonstrates working web animation.

The local web companion uses a short, restrained settling motion; no auto-changing text; pause on reduced motion and offscreen/hidden state; a static first state remains complete. No canvas animation framework or additional runtime is authorised by this design.

## Copy, actions and honesty

[Website copy](../../content/practical-delivery-r3-2026-09-21/website-copy.md) owns the English editorial handoff. Header, hero, VSL, offers and inquiry point toward a conversation about the existing setup. Native drawings of controls are not working website controls. The VSL is unrecorded. The inquiry sends nothing. Any later web implementation must preserve the existing Worker contract and form behavior, including accessible errors and focus.

The path from a promising demo, MVP or prototype to production-ready software remains explicit, now also welcoming software already in use. Readiness is agreed for the actual use case and checked through the work, not guaranteed by the label. onlinesourdough supports the customer's own AI practice; Arc’IT takes care of agreed technical delivery and ongoing work. The implementation method informs the offer but is not itself the landing-page message. No automatic monitoring, guaranteed security or autonomous production operations are promised.

The [preserved dashboard concept](../agent-factories-r1-2026-09-14/index.html) and its web copy remain historical artifacts, not links from the current landing page. Current factory source and qualification are recorded in the copy document's internal source notes. Never relabel the earlier concept as the implemented factory.

## Review and limits

Same-task technical/editorial/native review by Codex; Gustav’s final copy/design choice remains pending. Inspect native desktop/mobile frames and notes, actual editable nodes, File → Save, persisted bytes, source preservation, and a reopen of the saved candidate. Verify fonts and embedded scene separately. Native exports must be visually inspected; disclose any native font-export limitation rather than presenting fallback typography as accepted.

- **Known limitations:** Local responsive preview only, not a production release, recorded VSL, sent inquiry, security audit or running factory. OpenPencil remains R3.2; the current copy is in the R3.4 HTML and editorial file. The exact lost Chrome variant was not located; earlier files and snapshots are preserved. Historical native runtime/export limitations remain recorded with their reviews.
