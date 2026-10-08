---
name: Arc’IT AI — Secure Agents copy direction
version: 1.0.0
---

# Candidate direction

This is a local review candidate, not a replacement for [the operative design](../../docs/design.md) or approval to publish. Accepted task: clarify Secure Agents under the existing done-for-you business, write English copy, and make it inspectable in the current visual identity. [Direction and sources](../../content/secure-agents-2026-09-14/direction.md) own the reasoning; [website copy](../../content/secure-agents-2026-09-14/website-copy.md) owns the wording.

## Visual idea

Keep the open Danish landscape and warm editorial page. Make technical responsibility understandable through a small quote-preparation example and the existing full-width scope ledger. Security should appear in the work and decisions, without replacing the brand with a conventional cyber aesthetic.

The page remains header → landscape hero → founder explanation → scope ledger → inquiry → landscape footer. The example sits inside the explanation area. Three practical questions sit beside the inquiry rather than creating another sales section. No testimonial grid, invented proof or extra offer tier.

## Typography and hierarchy

- Use the existing local Geist Pixel Square for the main headline and major section headings. Hero has two complete clauses, on separate lines when space allows.
- Geist Sans owns body copy, form labels and most explanatory text. Default body 17 px with a comfortable 1.6 line height; form inputs are at least 16 px.
- Geist Mono owns labels, navigation and metadata. Keep these legible; no dense all-caps paragraphs.
- One h1. Section headings are h2; the example and ledger entries use h3. Keep body measure near 60–65 characters, with a narrower hero paragraph.

## Color and surface

Reuse the current light palette: paper `#f8f2e8`, surface `#fffaf1`, soft surface `#f1eadf`, ink `#18211d`, muted `#6f6a61`, primary `#14211d`, accent/focus `#236b59`.

Reuse the current dark roles: paper `#171814`, surface `#20231e`, soft surface `#292d26`, ink `#fff6e7`, muted `#c4beb2`, primary `#fff6e7`, accent/focus `#78cbb3`.

One local accessibility refinement: muted text on the light soft surface uses `#6b665e`. The original `#6f6a61` on `#f1eadf` measured 4.49:1, just below 4.5:1 for normal text. The existing pale mark is rendered dark on light surfaces and pale on dark surfaces; its SVG is unchanged.

Hero text sits on an opaque paper area fading into the decorative landscape below. The image is atmosphere, never a legibility dependency. Controls use visible text and contrast, not color alone. The review-only banner is distinct and explains that nothing is sent.

## Composition

- Desktop shell: 1240 px within 1440 px, shrinking with 24 px gutters, 18 px at the narrowest widths.
- Sticky brand/navigation header. The preview-only notice and scene selector are separate from public page copy.
- Hero: centered headline, short lead and two compact actions, with generous scenery below. No date-based scarcity or fabricated availability.
- Explanation: a reading column, then a compact browser-like example. Three dependent stages, followed by plain-language constraints. Clearly label the example as illustrative.
- Scope: four ledger rows, each with number/step, heading, body and evidence topic. Exactly three inset dividers between entries. No equal-card service wall.
- Inquiry: introduction and native question disclosures left; form right. Collapse to one column below 980 px.
- Footer: actual Cut Six mark, wordmark and landscape horizon. Reuse the selected scene.

## Responsive and interaction behavior

At 390 px and 320 px, retain all copy and actions. Stack hero actions, workflow stages, ledger columns and form fields when needed. The header keeps the brand, Offers and theme control; section links remain available in page/footer navigation. Avoid fixed-width cards or clipped type.

The two-entry Offers disclosure supports keyboard operation, Escape and outside-click closing. Closed content is not focusable. Theme has a clear action label and updates its state. Native question disclosures work with keyboard and pointer. Visible focus is a solid, offset accent outline; a skip link moves to main content.

No essential motion is used. Reduced-motion disables smooth scrolling. Anchors account for the header. The preview scene selector explicitly chooses morning, day, evening or night; it is a review tool, not a new product feature. The existing production Copenhagen scene logic is unchanged.

The proposed form uses visible labels, required-field indicators, native validation and an associated privacy note. It is local-only: the button validates the fields and announces that nothing was sent. It has no fetch, storage or production endpoint; a preview CSP forbids form submission and external connections. Do not enter real confidential information. No fake sent/loading state.

## Sources, assets and rights

Direct reuse route. No new visual reference discovery is necessary.

- [Current live page](https://arcitai.com), inspected 14 September 2026; layout and brand reference.
- [Operative design](../../docs/design.md) at repo baseline `74dc67adf0a97072e0afd8e92876e9bd18f693cd`; visual constraints retained, copy changes explicitly proposed.
- Existing owner-provided `public/assets/arcitai-mark-final.svg` and the four `arcitai-panorama-*-v1.jpg` images. Reused by path, not copied or claimed as newly licensed third-party assets.
- Existing Geist WOFF2 files under `public/assets/fonts/` and their retained `LICENSE.txt`. No external font request.
- The IBM/Trail of Bits references inform the service explanation, not the visual identity. Their assets, brands and proof are not reused.

## Preview and review scope

Selected companion: `index.html`, a static editorial prototype served through the repository’s existing Vite dev server. Asset URLs reuse `/assets/` from `public/`. Open through that local server; a bare file URL does not resolve the root-relative assets.

Run from the repository root with `npm run dev -- --port 4175 --strictPort`, then open `/design/secure-agents-2026-09-14/`. The review records the actual port used. No custom server, dependency, backend or deployment is introduced.

Review is a same-task editorial/design check, not an independent security assessment or an invented owner approval. Inspect desktop 1440×1000, mobile 390×844 and 320 px; both themes, all four landscapes, Offers, anchors, focus, disclosures and local-only form validation. Retain observations and selected screenshots in the review record. Receiving production behavior remains a future implementation check.

- **Known limitations:** This is a copy/layout draft. It is not the React production implementation, a recorded VSL, a customer case, a proven service or a live inquiry form. The scene selector is preview-only; runtime time-of-day behavior and the production inquiry contract are unchanged. The new service scope and commercial commitments still need Gustav’s decision and delivery validation.
