# Factory illustration: third-party assets

Retrieved 21 October 2026 for the local Arc’IT website design preview.
These identify example tools in an architecture illustration. They are not
Arc’IT marks, partnership badges, a deployed inventory or a compatibility promise.
They retain their respective owners’ rights; the repository MIT licence does not
relicense product trademarks, mascots or logo artwork.

## Selected sources

- `slack.png`: unmodified 32px favicon linked by Slack's official media kit,
  https://slack.com/media-kit. Asset:
  https://a.slack-edge.com/9cc0056/img/icons/favicon-32.png.
  Shown as one communication-channel example beside the human entry point,
  equally alongside Teams and Google Chat in the five local candidates,
  not as the control room or an implemented Factory integration. Slack's brand
  terms apply: https://slack.com/terms-of-service/slack-brand.
- `teams.svg`: unmodified Microsoft Teams product icon from Microsoft's
  Fabric brand-icon CDN (48 × 48 original viewBox):
  https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/svg/teams_48x1.svg.
  It identifies an example communication channel; Microsoft retains its artwork
  and trademark rights. No Microsoft partnership or active connector is implied.
- `google-chat.svg`: Simple Icons' CC0 rendition with its path unchanged and
  catalogue colour `#34A853` applied as a fill:
  https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/googlechat.svg.
  Catalogue source: https://support.google.com/chat/answer/9455386.
  `SimpleIcons-LICENSE.txt` preserves the source licence; Google retains its
  trademark rights. This is another communication-channel example.
- `codex-spritesheet-v4.webp`: OpenAI’s original Codex companion. Exact public
  asset: https://persistent.oaistatic.com/codex/pets/v1/codex-spritesheet-v4.webp.
  Catalog and frame geometry are documented in
  https://github.com/openai/codex/blob/main/codex-rs/tui/src/pets/catalog.rs
  and `asset_pack.rs` alongside it. The unmodified sheet is displayed through a
  192 × 208 SVG viewport. The selected bridge uses the native idle/blink,
  running-left, running-right and laptop-work frames (rows 0, 2, 1 and 7).
  Frame counts and timings follow `codex-rs/tui/src/pets/model.rs` in the same
  public repository. Frames are selected at runtime from the unchanged sheet;
  the image file is not edited. Static/mobile tool marks retain the first frame.
  The source repository’s Apache licence does not establish a separate mascot
  licence for this CDN asset. Public redistribution remains a release-review item.
- `claudecode.svg`, `azure.svg`: Lobe Icons’ MIT-licensed vector renditions,
  from https://github.com/lobehub/lobe-icons/tree/master/packages/static-svg/icons
  (`claudecode-color.svg`, `azure-color.svg`). `LobeIcons-LICENSE.txt` preserves
  its licence. These are third-party vectors of product marks, not claimed to
  be vendor-provided brand downloads. Claude Code’s role is verified at
  https://code.claude.com/docs/en/overview.
  `FactoryAgents.tsx` segments the same Lobe Icons Claude silhouette into body,
  eyes, arms and legs for original blink/walk/tool-use motion. This motion is
  an Arc’IT illustration, not an official Anthropic animation asset.
- `cursor-light.svg`, `cursor-dark.svg`: unmodified 2D cube SVGs from
  https://cursor.com/brand, `cursor-brand-assets.zip`,
  `General Logos/Cube/SVG/CUBE_2D_LIGHT.svg` and `CUBE_2D_DARK.svg`.
  Source: https://ptht05hbb1ssoooe.public.blob.vercel-storage.com/assets/brand/cursor-brand-assets.zip.
  Cursor is an illustrative tool choice, not a qualified Factory adapter claim.
- `github.svg`: GitHub’s official Primer Octicons `mark-github-16.svg`,
  https://github.com/primer/octicons/blob/main/icons/mark-github-16.svg.
  `Octicons-LICENSE.txt` preserves its MIT licence. Dark mode displays the same
  silhouette in white; no geometric distortion.
- `powerbi.svg`, `lakehouse.svg`: Microsoft Fabric icon pack, unmodified
  `v6.1.0/package/dist/svg/power_bi_48_color.svg` and `lakehouse_48_item.svg`.
  https://learn.microsoft.com/en-us/fabric/fundamentals/icons links to
  https://github.com/microsoft/fabric-samples/blob/main/docs-samples/Icons.zip.
- `databricks.svg`: Simple Icons’ CC0 rendition, with its path unchanged and
  the catalogue’s official `#FF3621` colour applied as a fill.
  https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/databricks.svg.
  Brand guide: https://brand.databricks.com/Styleguide/Guide/.
  `SimpleIcons-LICENSE.txt` preserves the source licence; trademark rights remain
  with Databricks. This is an example data platform, not an experience claim.
- `mcp.svg`: official protocol favicon, unmodified, from
  https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/favicon.svg.
  The source repository licence is preserved in `MCP-LICENSE.txt`.
- `codex-security.png`: exact asset from the installed OpenAI Codex Security
  plugin 0.1.32, `assets/logo.png`. It is not an invented shield or a generated
  logo. The plugin copy does not establish public redistribution rights;
  retain this as a local preview asset pending the eventual release review.

## Generic symbols

The seven generic symbols in `src/components/FactoryToolMarks.tsx` adapt the
Phosphor duotone family: `cube`, `cpu`, `tree-structure`, `hard-drives`,
`magnifying-glass`, `files` and `shield-check`. Source files follow
`https://raw.githubusercontent.com/phosphor-icons/core/main/assets/duotone/{name}-duotone.svg`.
Paths retain their 256-unit geometry; the secondary fill uses the shared Arc’IT
blue duotone tokens instead of source opacity. Light and dark themes have
separate tokens. `Phosphor-LICENSE.txt` preserves the MIT licence from
https://github.com/phosphor-icons/core/blob/main/LICENSE.

## What the security example means

https://learn.chatgpt.com/docs/security documents Codex Security as application
code scanning, investigation and reviewed fixes, including commit monitoring.
It does not establish runtime monitoring of deployed infrastructure.
The second defence symbol is a generic security shield. It does not identify
a runtime monitoring product or promise an installed, connected or continuously
staffed service. Microsoft Sentinel was removed at the owner's request.

All assets are local, with no third-party requests from the page. The existing
Arc’IT roof and slabs are original SVG artwork. The full Codex sprite is
887,954 bytes and shared
through browser caching across desktop and mobile markup. Its retrieval cost
is recorded rather than described as a tiny vector asset.

Only Codex and Claude Code appear as moving identities. The earlier original
neutral mechanic has been removed at the owner's request. A core pair and
occasional copies (up to six workers total) perform coordinated illustrative
jobs on separate floors, with occasional collaboration. Helpers enter and return
through the roof/control room. Native Codex frames and original playback timings
are retained. Claude's movement is authored here. The shared visible-time clock
keeps independent routes, occasional handoffs and installations consistent; it is not a live agent execution display. Omarchy is mentioned as an optional Linux host example
only; no Omarchy asset is used.
Reference: https://omarchy.org/.

Animation research also inspected `KebeliSamet0/clawd` at
`ba50a8053e2c6e46211fcf4433ba224af0fa95ad`. Its separate `assets/LICENSE-clawd`
reserves artwork rights and disallows commercial use; none of that repository's
artwork or animation code is included in this site's source or runtime assets.

## October 22 composition studies: source and platform marks

The following vectors identify illustrative data sources and destinations, not
installed integrations or partnerships. Product marks remain upright, retain
their proportions and use unmodified paths. Surrounding tiles borrow a few brand
colours; the ordered field always becomes Arc’IT blue.

- `slack-vector.svg`: official Slack mark from Salesforce's Slack product page,
  https://wp.sfdcdigital.com/en-us/wp-content/uploads/sites/4/2024/06/icon-slack.svg?w=1024.
  This vector replaces the small favicon in the new hero only.
- `salesforce.svg`: official Salesforce website logo,
  https://wp.sfdcdigital.com/en-us/wp-content/uploads/sites/4/2024/11/logo-salesforce.svg?w=1024.
- `hubspot.svg`: Simple Icons CC0 path, with catalogue orange #FF7A59,
  https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/hubspot.svg.
  The existing SimpleIcons licence applies to the rendition; trademark rights
  remain with HubSpot.
- `notion.svg`: unmodified MIT Lobe Icons rendition,
  https://raw.githubusercontent.com/lobehub/lobe-icons/master/packages/static-svg/icons/notion.svg.
  The existing LobeIcons licence is retained.
- `fabric.svg`: Microsoft's unmodified `fabric_48_color.svg` from
  `v6.1.0/package/dist/svg/` in the official Fabric icon archive:
  https://github.com/microsoft/fabric-samples/blob/main/docs-samples/Icons.zip.
  Brand guidance: https://learn.microsoft.com/en-us/fabric/fundamentals/icons.
- `delta-lake.svg`: unmodified official Delta Lake favicon, https://delta.io/favicon.svg.

The source clusters use Slack, HubSpot, Teams, Salesforce, Notion and GitHub.
Databricks, Azure, Microsoft Fabric and Delta Lake sit beside the Arc’IT mark.
The two familiar Factory workers and all existing Factory marks are retained.
