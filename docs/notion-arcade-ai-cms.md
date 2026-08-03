# Arcade AI Notion CMS

This file records the Notion setup for `arcitai.com`.

## Project inquiries

Database: `Arcitai Project Inquiries`

URL:
`https://app.notion.com/p/145c4bea0b134057abf57fcc03d4545a`

Data source:
`a156e7e9-8a3a-47bb-93ef-734bfa24361d`

Form view:
`3852e04d-50d1-81ef-9757-000c2aa62940`

Fields:

- `Project` title
- `Name` text
- `Email` email
- `Company` text
- `Website` URL
- `Project Type` select: Internal tool, Automation or agent, Prototype, Architecture review, Not sure yet
- `Timeline` text
- `Role` select: Founder / owner, Leadership, Operations, Product / technology, Other
- `Company Size` select: 1–5, 6–15, 16–50, 51–150, 150+
- `Business Revenue` select: Pre-revenue, Under DKK 50k / month, DKK 50–100k / month, DKK 100–500k / month, DKK 500k–1m / month, DKK 1m+ / month
- `Context` text
- `Status` select: New, Reviewing, Qualified, Archived
- `Source` select: Website, Referral, Manual
- `Created` created time

## Website submission

The form view accepts anonymous submissions. The Arc’It landing preview keeps the branded native form and posts validated JSON to:

`https://gustavonline-api.gustavonline.workers.dev/project-inquiry`

The existing `gustavonline-api` Cloudflare Worker writes the inquiry into this data source using its Notion integration secret. `Email`, `Role`, `Company Size`, `Business Revenue`, and project context are required at the website boundary. Status defaults to `New` and Source to `Website`.

`siteData.inquiry.formUrl` remains available only if a hosted Notion form should replace the branded form later.

## Project testimonials

Database: `Arcitai Project Testimonials`

URL:
`https://app.notion.com/p/fa36f9886cf7421fb2b10c429aba5797`

Data source:
`03dc0cc0-a390-4b3a-8158-21646b7794d0`

Fields:

- `Project` title
- `Client` text
- `Quote` text
- `Outcome` text
- `Type` select: Internal tool, Automation, Prototype, Architecture
- `Published` checkbox
- `Display Order` number
- `Source URL` URL
- `Created` created time

## Future CMS path

For the first public version, testimonials are static fallback copy in `src/site-data.ts`.

When there are approved quotes, the clean next step is a tiny API route or Cloudflare Worker that queries `Arcitai Project Testimonials` where `Published = true`, sorts by `Display Order`, and returns cards to the React page.
