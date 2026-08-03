# Arcade AI

Minimal Vite/React foundation for `arcitai.com`.

Arcade AI is the done-for-you agency lane in the Gustav Online / onlinesourdough ecosystem. The site is intentionally simple: a compact agency intake page with a project inquiry flow and testimonial-ready proof section.

## Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- lucide-react icons

## Commands

```bash
npm install
npm run dev
npm run build
```

## Structure

- `src/site-data.ts` is the source of truth for page copy, inquiry fields, Notion IDs, testimonial fallback cards, links, and footer data.
- `src/routes/App.tsx` renders the single agency/inquiry page.
- `src/components/` contains the reusable header and Arcitai wordmark.
- `src/styles.css` contains Tailwind directives and the global layout/theme CSS.
- `assets/arcitai-mark.svg` is the favicon and small logo mark.
- `docs/notion-arcade-ai-cms.md` documents the Notion inquiry/testimonial databases.

## Form workflow

The Notion database and form view have been created. The first public version still uses a native fallback form that opens a prefilled email to `hello@arcitai.com`, because the public Notion form URL/iframe must be copied after sharing the form in Notion.

When a Notion Form is ready, add its URL to `siteData.inquiry.formUrl` and switch the inquiry section to an embed or external link.
