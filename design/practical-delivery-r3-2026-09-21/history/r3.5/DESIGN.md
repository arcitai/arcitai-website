---
name: Arc’IT AI — build on what works
version: 3.5.0
---

# Direction and scope

24 September 2026. Current deliverable: revised English copy and working motion in the complete local web landing page. Gustav explicitly selected the browser over OpenPencil for this iteration. Retain Arc’IT’s established identity and familiar navigation; make the offer language more concrete and replace the minimal settling motifs with useful, visible animation.

Only this design preview and its editorial documentation change. No live site, production `src/`, Worker, dependencies, AIOS, Notion or sibling repository changes. Preserve past revisions, the original assets and the historical dashboard concept. OpenPencil R3.2 is preserved, not synchronized.

## Accepted constraints

- Opaque full-width header, wordmark only: **Offers · Process · Scope · Start**. No glass navigation. Offers retains Arc’IT DFY / onlinesourdough DIY + DWY.
- Original Cut Six mark centred in the hero. Strictly black on light surfaces, white on dark. No green logo, pet, eyes, limbs or substituted geometry.
- Existing panorama, green accents and warm paper. Geist Pixel headings/wordmark, Geist Sans body, Geist Mono utility labels.
- Outcome: take promising demos, MVPs and prototypes toward production-ready software for their actual business use. Do not imply every AI-built tool is unsafe.
- Service three explicitly offers an **Agent Software Factory** and **Agent Defense Factory** setup. Explain their purpose briefly. This is Gustav’s implementation service, not a proprietary SaaS claim.
- No “Two systems / One delivery process” architecture section, dashboard pitch, fake metrics, invented customer results, vendor relationship or security guarantees.
- First-person, direct English. Avoid the previously rejected “Show me what you’ve got” tone. Keep done-for-you responsibility and explicit business decisions/approvals.
- Footer contains external links only and **Business first. Security built in.**

R3.4’s “all other copy and visual choices unchanged” restriction was local to that iteration. This request explicitly revises copy and motion; the identity constraints above still apply.

## Inspected references and adaptation

1. **Existing Arc’IT direction:** R2.1 and preserved R3.4 at `history/r3.4/`. Highest visual precedence. Reuse the owned panorama, fonts and Cut Six geometry.
2. **[Agentic Engineer](https://agentic-engineer.ai/):** inspected in a real browser on 24 September. Its offer columns pair a descriptive service name with a short outcome and concrete details. Small abstract animations leave generous space. The Impact section shows loading bars and particles moving through Plan, Code, Review, Test and Deploy, with constrictions illustrating bottlenecks. Multiple timed screenshots establish changing states. Adapt the explanatory mechanism and directness, not its pricing, scarcity, performance numbers, customer proof, palette, identity or source code.
3. **onlinesourdough combined draft:** linked task `01a08aaa-9997-7e81-a2bd-dd53103f3aea`, preserved at the sibling’s `design/legacy-ads/onlinesourdough-web-exploration-r1/prototype/`. Inspected the actual combined living-logo/method preview and its local source, read-only. Transfer identity-specific movement, work queues and readable stage labels. Do not transfer the bread character or modify that project.
4. **Kastanje:** historical scenic-hero inspiration only. Its glass navigation was explicitly rejected in earlier iterations and is not used here.

Inspection proof is under repository-local `output/playwright/`: `agentic-reference-impact-a.png`, `agentic-reference-impact-b.png`, `agentic-reference-offers.png`, `sourdough-reference-method.png`. Screenshots are private task evidence, not bundled page assets.

The original reference implementation is not copied. New SVG, CSS and deterministic JavaScript are authored locally without an animation framework.

## Page composition

Desktop: opaque 72px header → centred monochrome logo and prototype-to-production headline over panorama → founder introduction / VSL placeholder → three airy service columns → one compact workflow illustration inside Scope → inquiry and four practical FAQs → landscape footer.

The workflow supports the services; it is not a separate product architecture or two-factory loop. Its heading is **Connect the work, from plan to release.** It shows how work passes between stages while review and approval remain present.

Mobile: 62px header; black logo and copy on warm paper (white on dark theme), followed by landscape strip. Stack offers. Transform the five-column stage legend into a readable five-row list with full-size labels, loading bars and explanations. The particle channel is supplementary, not the only way to understand the sequence. Keep the inquiry form local-only and readable.

Reading shell: 1200px maximum, generous whitespace and fine dividers. Hero remains the primary scenic brand moment. The workflow uses a pale green field rather than another dark product dashboard.

## Identity and typography

Paper `#f8f2e8`, cream `#fffaf1`, ink `#18211d`, muted `#615f56`, dark green `#14211d`, action green `#236b59`, sage `#b9d9c8`, inquiry field `#e6eee5`.

Use locally hosted Geist Sans/Mono/Pixel and their existing licenses. Body is 17–20px, offer details 16px; small diagram annotations are supporting labels, not essential long-form content.

Original panorama: `public/assets/arcitai-panorama-day-v1.jpg`, reused by the preview. Original mark: `arcitai-mark-final.svg`. The hero now inlines its exact six paths/rectangles for per-piece animation; its geometry is unchanged.

## Motion and interaction

- **Logo:** six original pieces gently spread by 3–5 SVG units and return over nine seconds, with rest periods. No rotation, mascot or logo recoloring.
- **Consultation:** scattered square marks gather into a centre and spread back out.
- **Review/delivery:** a scanning line crosses two rows of tiles; one tile resolves as it passes.
- **Factory setup:** packets move along three lanes and pause briefly at shared gates.
- **Workflow:** 48 deterministic particles move across five stages. The **Disconnected / Connected** control changes illustrative queue buildup and stage bars. Connected is the initial state; human review and release approval are never removed. Captions explain the concept.
- Bars are decorative illustration, not semantic progress bars or measured completion. No percentages, simulated customer metrics or live-status claims.
- Global **Pause motion / Play motion** controls are provided at the hero and the workflow. CSS and JavaScript both stop offscreen, when paused and when the page is hidden.
- Reduced motion is honored initially and on preference changes. All informational copy remains static and readable; comparison controls still update the static diagram. With JavaScript unavailable the core page, stage descriptions, links and local-only form boundary remain usable; motion/comparison controls stay hidden.
- No autoplaying video or fake playable film. **Meet Gustav** scrolls to the introduction marked **Film to be recorded**.
- Offers disclosure keyboard/Escape behavior, theme controls, anchors and skip link are preserved.

## Content and product truth

[English copy](../../content/practical-delivery-r3-2026-09-21/website-copy.md), draft 03.5, is the editorial companion. The third offer names both factories and describes scoped tasks, checks, review, assessment of findings and agreed fixes. The shared responsibility note covers setup, implementation and agreed ongoing work.

The factory repository informs the method but is not presented as a qualified autonomous customer runtime. Current defence tooling is manual private triage; do not promise automatic monitoring, recovery or autonomous production operations. “Production-ready” remains an agreed, tested outcome for the use case, qualified in the FAQ.

The previous dashboard concept remains historical and unlinked from this page. No claims that it is the implemented factory.

## Verification boundary

Review the actual running R3.5 HTML, not the preserved OpenPencil canvas. Check motion over time; pause/resume; offscreen and visibility handlers; reduced motion; comparison states; light/dark; 1440, 768, 390 and 320px layouts; keyboard navigation; static asset loading and zero form transmission.

[README](README.md) records the actual checks and review. Same-task Codex review is not owner approval. Live deployment, a recorded VSL and production inquiry integration are out of scope. Earlier review evidence remains attached to its historical revision.
