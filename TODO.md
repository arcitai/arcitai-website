# Arcade AI reset todo

## Direction

Arcade AI should now be the done-for-you agency side of the Gustav Online / onlinesourdough ecosystem.

The page should explain one clear offer: AI-native software development for internal tools, automations, prototypes, integrations, and systems that need to be shipped, understood, handed over, and safely extended.

## Role in the ecosystem

- `gustavonline.com`: personal brand, content, notes, public learning, and portfolio.
- `onlinesourdough.com`: the method and language around AI, software, architecture, resources, and direct access.
- `arcitai.com`: the compact project inquiry page for done-for-you builds.

## Page structure

- Keep the existing Arcade AI logo mark, teal/green/black/white palette, and light/dark mode.
- Avoid the warm sourdough cream/brown color direction.
- Replace the old menu-card system with a compact agency intake page.
- Use `src/site-data.ts` as the source of truth for copy, Notion IDs, links, inquiry fields, testimonial fallback cards, and footer data.
- Build the page as a short request inquiry flow:
  - hero with Arcade AI mark
  - project inquiry card
  - project testimonials / proof cards
  - short method anchor
  - links to Gustav Online and onlinesourdough

## Form recommendation

Start with a Notion Form, not Typeform.

Reason: this first version is mostly qualification and internal workflow. Notion Forms connect directly to a database, so every inquiry becomes operational data instead of another tool to sync. Typeform is better later if the form becomes a conversion asset with advanced branching, analytics, payments, or polished marketing flows.

Implementation now:

- Ship a native inquiry card that opens a prefilled email.
- Keep `siteData.inquiry.formUrl` ready for the public Notion Form embed/link.
- Avoid embedding a fake form URL.

## Implementation checklist

- [x] Read the current Arcitai repo.
- [x] Read Gustav Online and onlinesourdough structure/copy.
- [x] Preserve Arcitai brand assets and palette.
- [x] Rewrite `src/site-data.ts` for agency/inquiry content.
- [x] Replace the menu-card React UI with a focused inquiry landing page.
- [x] Rework CSS for a minimal, responsive agency page.
- [x] Update metadata and README.
- [x] Run build.
- [x] Start dev server and verify the page locally.
- [x] Create Notion `Arcitai Project Inquiries` database.
- [x] Create Notion `Project Inquiry Form` view.
- [x] Create Notion `Arcitai Project Testimonials` database.
- [x] Document Notion database IDs and next embed step in `docs/notion-arcade-ai-cms.md`.
- [x] Rebuild and verify the reduced Arcade AI version.
