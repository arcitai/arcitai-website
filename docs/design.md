# Operative design

## Direction

Arc'IT AI is the technical sibling of onlinesourdough: warm paper, Geist
Sans/Mono/Pixel, fine rules, compact editorial rhythm, and direct writing. The
Danish landscape, Cut Six mark, deep green, and implementation scope keep it
distinct.

The canonical page journey is:

```text
Offers header → landscape hero → founder walkthrough → Scope ledger
→ project inquiry → landscape footer
```

## Composition

- Sticky header: 68 px desktop and 62 px mobile, with brand left, centered
  navigation, and theme control right.
- Desktop structural shell: 1240 px within a 1440 px viewport; narrower reading
  measures sit inside it.
- Hero: viewport minus header, one complete pixel-font headline, two compact
  actions, and a landscape selected from Copenhagen time.
- Process: one continuous 02:15 founder-film treatment with four timecoded
  chapters inside a compact landscape browser window.
- Scope: centered introduction and four full-width Spec, Build, Review, and
  Ship rows with exactly three inset dividers.
- Start: two-column introduction and inquiry form above 980 px, one column
  below it. The START kicker sits on the form axis.
- Footer: centered mark/wordmark, navigation, contact, metadata, and landscape
  horizon; approximately 500 px desktop and 440 px mobile.

## Content contract

- Status: `Q3 2026 / LIMITED BUILD CAPACITY`.
- Hero: `Better software begins with better business questions`.
- Process: `AI-first companies are built by people, not tool stacks`.
- Scope: `From first conversation to software that earns its place in the work`.
- Start: `Start with the problem. Not the prompt`.
- Rail: `BUSINESS > SOFTWARE`.

Use neutral, direct English. Start from the business problem, never a model,
tool, prompt, or stack. Do not add testimonials, logos, fake metrics, extra
sales sections, baking metaphors, or public links to private foundations.

## Visual tokens

| Role         | Light     | Dark      |
| ------------ | --------- | --------- |
| Paper        | `#f8f2e8` | `#171814` |
| Surface      | `#fffaf1` | `#20231e` |
| Soft surface | `#f1eadf` | `#292d26` |
| Text         | `#18211d` | `#fff6e7` |
| Muted        | `#6f6a61` | `#c4beb2` |
| Primary      | `#14211d` | `#fff6e7` |
| Accent/focus | `#236b59` | `#78cbb3` |

Hero and major headings use Geist Pixel; body and form use Geist Sans;
navigation, labels, timestamps, and metadata use Geist Mono. The mark is always
the real Cut Six SVG beside the literal `Arc'IT AI` wordmark.

## Interaction and accessibility

- Offers opens two offer cards only and closes on selection, outside click, or
  Escape; closed content is inert.
- Theme has an explicit accessible label and preserves unmistakable focus.
- Normal hash navigation and active section state remain intact. Reloading a
  section URL clears stale hash/scroll restoration and returns to the hero.
- `?scene=morning|day|evening|night` forces a review scene; otherwise the scene
  follows Europe/Copenhagen (05–10 morning, 10–18 day, 18–22 evening, else
  night).
- VSL state maintains `aria-expanded`/`aria-hidden` and returns focus.
- The form uses visible labels, native validation, `aria-busy`, a live status
  region, and a disabled pending button.
- Atmospheric imagery carries no information. Motion respects
  `prefers-reduced-motion`.

## Review viewports

The release gate is 1440×1000 and 390×844 in Chromium, plus all four forced
scenes. Review light/dark, Offers, anchors, VSL open/return, inquiry pending,
success/error, footer crop, overflow, console errors, and runtime asset loads.
