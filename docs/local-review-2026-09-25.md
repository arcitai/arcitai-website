# Three-brand functional review — 25 September 2026

Status: local previews implemented; awaiting Gustav’s visual approval.
**No production deployment, push, newsletter signup or real inquiry was made.**
The approved OpenPencil file remains unchanged. The new source lives in each
existing application, reusing its own React stack, media, motion and components.

## Latest follow-up: v4.2 composition and footer placement

Local-only refinement after Gustav’s next review:

- Arc’IT hero text is centered; its Offers dropdown is now compact and positioned
  10px below the header, keeping sharper corners and the existing keyboard behavior.
- Sourdough’s hero uses the same .9fr/1.1fr columns and 70px gutter as the method
  section. The existing living bread has a 360px desktop / 170px mobile stage.
- gustavonline puts socials directly under the portrait, aligned to its left edge.
  The Projects heading is removed; the three projects and a real Newsletter link
  make four rows. No unpublished issue is described as “latest”.
- All short routes have viewport-height shells and natural-flow footers. The
  previous Gustav home-only min-height override is removed; Arc’IT uses one flex
  shell for home, project and newsletter instead of a newsletter-only height hack.
- Both footer identity marks stay monochrome; link text retains the brand accent.

Refreshed browser proof: 33 route/viewport combinations (1440×1600, 390×844,
320×740; every home, newsletter, thank-you, plus Arc’IT project and Sourdough
About) have no horizontal overflow, no empty region after the footer and no
premature footer on short pages. Zero page errors in that sweep. At 1440×1000,
Gustav’s footer now ends at 1000px, previously 865.625px. At 1440×1600, Arc’IT
project now ends at 1600px. All three desktop/mobile home captures were inspected.

Offers open/Escape/focus and fit passed at 1440/390/320 on both offer sites;
Arc’IT Tab order reaches both offers then Newsletter. Light/dark hover inspection
confirmed unchanged logo colors and brand-accent text on all footer SVG links.
Gustav’s first social SVG is within 0.5px of the portrait’s left edge. Sourdough
hero/method columns both measure 400.5px/489.5px at desktop. Arc’IT heading and
paragraph are centered, with paragraph midpoint exactly 720px at 1440px width.

The new Gustav Newsletter row and both sibling header links complete the mock
signup → thank-you flow with zero POSTs. Actual day video playback and the
Discuss your project route passed. Pipeline keyboard preview, scroll-up close
and reduced-motion open state passed after the shell change. The first combined
journey check timed out because its heading lookup expected a removed period
(“Project inquiry.”); the corrected lookup/readback passed. No product change
was needed for that automation mismatch.

Typechecks, unit tests (11 / 21 / 59) and normal builds passed for all three;
review bundles were rebuilt separately. Arc’IT lint/audit, 21 Worker tests and
dry-run passed. Sourdough retains two moderate Vitest advisories; prior Gustav
dependency and repository-format release limitations below remain open.

Evidence: `output/playwright/refine42-*`. Owner design approval is still pending;
this is local-preview review, not production acceptance. Earlier sections and
hashes below describe prior candidates, not v4.2.

Codex lead local review, 25 September 2026, v4.2 binding:

- DESIGN.md SHA-256: `dfceb9a05082102352663bf416b16bce5c957e2c61605a250fbefa444c18812a`
- Gustav review HTML: `531bd24fb90ed954b128dd0ca22b2c4b1da511ea4329d13de647eab3742f54e2`
- Sourdough review HTML: `f97921788b3d19c36ce87f6d47eb38b053a68335936d7edd62ec02070b727337`
- Arc’IT review HTML: `6d9d4d45f3f277f9ef403015c642b27312e6d49ffc864640ceee7436ab96f242`

Entrypoints bind the current content-addressed application bundles. Media and
native OpenPencil sources are unchanged. Local implementation review passed;
owner visual acceptance and production release remain separate.

## Previous follow-up: identity, navigation and production parity

Gustav’s follow-up has been implemented locally:

- gustavonline is lowercase; social icons sit under Founder. A Projects heading,
  tighter rows and a content-sized page replace the stretched lower whitespace.
  The original collage remains; no filler projects or destinations were added.
- All three headers/footers share the 1120px outer shell. Desktop Offers is
  centered, with Menu/About on Sourdough and Newsletter/theme at the right.
  Smaller screens adapt without overlap; portrait/collage reading width stays personal.
- Theme hover changes only icon color, with no background, border or shadow.
  Orange identifies Gustav, brown Sourdough, and restrained steel-blue Arc’IT.
  Keyboard focus remains visible. Arc’IT’s original mark remains monochrome.
- Footer sibling links carry the real portrait, pixel boule and Cut Six mark.
  Bread pixel gaps are regular at small sizes. No copyright restored.
- Sourdough’s homepage and About text match current production, except the
  approved period-free hero and lowercase brand name. Its existing LivingMark
  and About renderer were imported from the read-only production-source checkout
  onlinesourdough-preview at 4514634. No cross-repository runtime dependency.
  The copy tests were updated to that production contract, not removed.
- Arc’IT has a visible offers heading and more space between offers. Video,
  reversible factory motion, three-offer structure and inquiry route remain.

Refreshed proof: 18 homepage viewport/theme captures (1440, 390, 320; both
themes), additional 768/1000 overflow checks, theme hover computed styles,
actual theme switching, Offers/Escape, Arc’IT menu keyboard order, three local
newsletter→thank-you paths, /project CTA and 320px About. LivingMark canvas
frames change normally and stay identical under reduced motion. Direct browser
text comparisons verified production homepage and About parity. These browser
runs recorded zero page errors and zero POST requests. Evidence is
`output/playwright/refine-*`; prior flat-card captures are not current proof.

TypeScript, unit tests and builds passed for all three: 11 Gustav, 21 Sourdough,
59 Arc’IT. Arc’IT lint/audit and 21 Worker tests plus dry-run passed. Sourdough’s
high-severity gate passed with the two pre-existing moderate Vitest entries.
Prior repository-format and Gustav dependency limitations below remain open;
this is not a production-green claim. No dependencies or lockfiles changed.

Codex lead local review passed; Gustav’s design approval remains pending.
This binding supersedes the earlier book-only binding below:

- DESIGN.md SHA-256: `0582192892382c7b218ee7b45a57f057f0334982cac1ddc8436863def6392634`
- Gustav review HTML: `360e14545231e7bc1c652c31bc99117520cf13040f33f81d79fbc256365ab11e`
- Sourdough review HTML: `70b345b4531db2535a9c102575121fdc08e822d56303fc9ee7f7f276444bc5aa`
- Arc’IT review HTML: `16cfac8dfbcc07cf7f2f66d08cfdf0888008fb181600af7b8d6e2a6bd7c9c6b9`

Entrypoints reference their newly built content-addressed JS/CSS. The original
OpenPencil file and all three production sites are unchanged.

## Open

- Gustav Online: http://127.0.0.1:4181/
- Online Sourdough: http://127.0.0.1:4182/
- Arc’IT AI: http://127.0.0.1:4183/

Every site has /newsletter and /newsletter/thank-you. Arc’IT’s primary action
opens /project. Footer/project/offer links between the three brands stay local;
YouTube, Resources, The Fermentary and Kastanje retain their existing external
destinations. The supplied Kastanje demo URL is used, not an invented domain.

Each repository contains the built HTML in output/family-preview/index.html.
Serve it over localhost; opening index.html with file:// is not supported.
From each repository:

    npm ci
    npm run review:build
    npm run review:preview

The scripts use fixed ports 4181/4182/4183 and bind to loopback only.
Existing dependencies and lockfiles were preserved, with no new runtime packages.
Shared-family source is a small independent copy in each src/family directory:
the sites do not depend on a sibling checkout or this design directory at runtime.

## Included

- Gustav: Founder; personal portrait and animated/clickable collage; social links
  above the three projects; no homepage signup, open-source or collaborations row.
- Arc’IT: “AI and software, done for you”; monochrome/grid composition; original
  mark and scene player; two offers and full-width “AI Agent Factory”; retained
  reversible pointer/scroll/keyboard pipeline. Gustav’s Arc’IT project line is
  “Done-for-you AI and secure software”.
- Online Sourdough: warm paper without the grid; the original physical book menu,
  spines, translucent sleeves, owned lo-fi cover art and hover lift are retained.
  Gustav explicitly corrected the initial flat-card interpretation: shared shell
  does not mean removing each brand’s character. Typography is made readable at
  narrow widths; business-first copy and Complete Bake → Arc’IT remain.
- Matching Newsletter/theme controls and footer logic on all three. Other brands
  left, personal social profiles right; portrait on siblings; no copyright.
- Three branded newsletter/signup/thank-you flows. The real existing Three.js
  bookshelf is reused only on Gustav Online, with an honest empty archive.
- Hero terminal periods removed. Mobile retains the content/actions, stacking
  cards and form fields. At 320px Sourdough uses its mark to keep navigation usable.

## Preview boundaries

VITE_REVIEW_PREVIEW=true plus an exact localhost/127.0.0.1 hostname enables mock
submissions and local sibling links. Forms visibly disclose that they do not
send data. No email is stored; only a session-local demo acknowledgement is kept.
Direct thank-you navigation without that acknowledgement does not claim signup.
Use /newsletter?form=error or /project?form=error to inspect failure behavior.
Newsletter is deliberately disabled outside this local review mode pending
provider/integration review. A non-review loopback Arc’IT inquiry is also blocked.

Arc’IT’s received day/evening clips are ambient landscape loops, not a recorded
founder VSL. Morning/night use the existing stills. There is no invented
walkthrough or fake playback for missing clips.

## Verification

- Lockfile installs and TypeScript checks completed for all three.
- Unit tests: Arc’IT 59; Gustav 11; Online Sourdough 21, all passed.
- All three built into independent static review directories.
- Arc’IT lint passed; Worker 21 tests, typecheck and dry-run bundle passed.
  No Worker source was changed by this three-brand iteration.
- Arc’IT audit: zero findings. Sourdough high-severity gate passed, with two
  existing moderate Vitest findings. Gustav’s existing dependency tree reports
  six high and two moderate advisory entries; these have not been repaired here
  and must be reviewed before release. Do not call the release security-green.
- Arc’IT’s repository-wide check stops at formatting in 31 pre-existing design
  study/history files. Changed application files pass scoped formatting; lint,
  tests and build were therefore also run separately. Those historical files
  were not reformatted to manufacture an all-green check.
- Separate Chrome visual review: 1440×1000, 390×844 and 320px; light and dark;
  no horizontal overflow. Final narrow header hit areas inspected for overlap.
- 45 shared browser checks passed: newsletter pending/error/success/return,
  retained email on failure, theme persistence, image loading, local siblings,
  four footer socials, offers/Escape, no copyright, zero signup POSTs/page errors.
- 17 media/motion checks passed: actual ambient and controlled video playback,
  both abstract motifs, all four scene posters, reversible pipeline scroll and
  pointer override, keyboard preview/Escape and reduced motion.
- 9 additional checks passed: inquiry mock success/failure, mobile fit, photo
  modal opening/closing, menu hover/reduced motion, zero writes/page errors.
  The later restoration of the physical book menu supersedes the flat-card
  screenshots. Final evidence is sourdough-books-{1440,390,320}.png,
  sourdough-books-dark.png and sourdough-book-hover.png.
  The initial automation raced a queued scroll reset; waiting for layout frames
  and moving the pointer across the pipe verified the actual intended behavior.
  The form test was rerun with native select selectors after an overly exact
  label lookup. Neither timeout is presented as a passed run.

Evidence: output/playwright/family-_-desktop.png, family-_-dark-_.png,
newsletter-_-_.png, thanks-_-mobile.png, factory-open-review.png,
final-_-320.png, final-arcit-mobile.png and final-project-_.png in this repository.
Full-page screenshots can precede below-fold lazy images; actual image load
checks and visible scroll journeys are separate evidence.

## Release remains separate

### Final local review binding

Codex lead review, 25 September 2026: local-preview checks passed for the
accepted three-site brief plus Gustav’s correction to retain the physical
Online Sourdough books. Owner design approval remains pending; this is not
production acceptance. Final dark and 320px book screenshots were also inspected.
All three review servers returned HTTP 200 at handoff.

SHA-256 of the selected direction and review entrypoints:

- DESIGN.md: `0e90af6f0c1bceb1ee7f8c5bd548d5f88735150094e87d7f08bb0d59c548a6e3`
- Gustav HTML: `07e4c800cd017348b65dfc02f13997ff96915797e7fae5d65fbe510a9f427ce1`
- Sourdough HTML: `705023a188549e89be48268ced7fa4cf75896872b629ec3e32d594e0c9413d56`
- Arc’IT HTML: `c4586d196a0c38b101dfb37d7096f6759c60df609a00d1fdd80085ac51c5872f`

These HTML files select the reviewed content-addressed bundles. The final
Sourdough book correction is in `index-4Pm1gjlC.js` (SHA-256
`08719888b8a5a78376010e4f12a106efb18bf8f421a10dc9c4fd0e75a4e6fb94`)
and `index--_o2-CkH.css` (SHA-256
`8b6b6c07ff857c5934561515f1fc0f9a24f1ae124ebad2b9aa22d0aa0333d283`).

### Before publishing

Gustav must approve the previews and any final personal-site correction first.
Before publishing: connect all three branded forms to Gustav’s existing
newsletter boundary (including source, consent, idempotence, error handling,
CORS and opt-in semantics); prepare static direct routes/metadata; resolve the
dependency/format gates; retain the backwards-compatible Arc’IT inquiry Worker
cutover requirement and decide the missing media. Never deploy output/family-preview
or enable the review flag on a public origin. Production builds must omit it.

No source files, old design versions, assets or user edits were deleted.
