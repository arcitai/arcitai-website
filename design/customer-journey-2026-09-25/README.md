# Kunderejse — reviewpakke

## Aktuel leverance: fælles design, newsletter og footers

Start i [OpenPencil](http://127.0.0.1:60864/) med
[brand-family-complete-owner-review.op](brand-family-complete-owner-review.op).
Det er den aktuelle, redigerbare kandidat: **861 noder, 11 boards**.
Tidligere filer er bevaringspunkter, ikke konkurrerende anbefalinger.

- Arc’IT: sort/hvid/grå, diskret hero-grid, kantede kontroller og monokromme
  animationstilstande. Ingen mintgrøn brandaccent.
- Online Sourdough: varme papirfarver, blødere kort og intet grid i previewet.
- Gustav Online: Founder, projekter inkl. Kastanje / AI inference, egne billeder
  og sociale links øverst. Ingen newsletter-blok på forsiden.
- Newsletter i alle headers. Tre brandede indgange til samme newsletter;
  bogreol kun hos Gustav Online. Tre takkesider og mobile formularstudier.
- Fælles footer: søstersider til venstre, samme fire social-profiler til højre.
  Ingen copyright eller selv-links. Portræt kun på de andre sites. Den senere
  footerinstruks erstatter det første forslag om ingen personlig footer.

Browserproof med faktisk Geist/Pixel:
`../../output/playwright/brand-family-review.png` og
`../../output/playwright/newsletter-review-browser.png`.
Native exports: `complete-exports/`, alle 11 boards. De bruger fallbackfont,
ikke præcis typografisk proof. En anden browserprofil kan kræve fontimport.
Bogreolen er en statisk kompositionsskitse af den eksisterende empty state,
ikke et fungerende WebGL-arkiv eller opdigtede udgaver.

### Kontrol af den aktuelle kandidat

Codex self-check: klar til Gustavs owner-review, ikke endelig ejeraccept.
Visuelt gennemgået: designfamilie, Arc’IT desktop/390px, Gustav-desktop,
newsletter-familie/390px, takkesider og fælles footer. Ingen observeret
tekstoverlap i de valgte renders. Arc’IT-tekst/knap: 15,61:1; sekundær tekst:
5,84:1. Dette er farvepar, ikke en fuld accessibility-test.

File → Open indlæste den præcise kandidat. Efter File → Save ændrede den
private working-fil hash fra
`274459b483270ff39dc52492e8502d405c8bb98ae6d3c82d92a0e98d94a37bb1`
til den aktuelle kandidats hash nedenfor. Original seed er uændret:
`d956e8497282a564dbe0cd672890f0975aae6fd7b9e419fd3644bab2c1be983f`.

Helperens native-export overskred sin hårde 2000ms-grænse. Samme native
`export_frames` blev derefter kørt via eksisterende lokal MCP med 30 sekunders
grænse: 11/11 filer, ingen fejl. PNG-signaturer, dimensioner og hashes blev
læst. Kilde/working-fil forblev uændret. Helpers efterfølgende dokument-,
861-node- og export-check bestod. Ingen skill eller runtime blev ændret.

| Aktuelt artefakt | SHA-256 |
| --- | --- |
| DESIGN.md | `24039f5a51e3aa88b0485a14e84bcb659c9468c8c7e08dedc393bbd11d811b32` |
| OPGAVE.md | `16faa43ded21265f4a7d9617f60b954e539712f84b86d78e7bb8f7dba517785d` |
| Native komplet dokument | `fe7f1952ccd47b8a8675a0b29134064097eab78316e071d337481b5742d4d594` |
| Native hovedcanvas | `f8abe087f3b41d1b6826715074f6880b09efdb33d04035cfb214c3dfa837dfb4` |
| Native newsletter-familie | `6968c29f8c9b4f1e2816cb38ba9bacbb900b3cca8c9f186766339ae9977ff9d6` |
| Native newsletter-mobil | `a190b572d44fc420762100edc3f4b1fa237515783e2790384d53beef7f9a01f4` |
| Native footer-system | `331e41341d570dcfb7e82ab2947ab713670f0f70ef23a79b1de42be1832a62c9` |

Kunderejsekortenes eksporthashes er uændrede; kun deres placering er flyttet.
Tidligere udkast og mislykkede kontrolforsøg er bevaret som historik.

Afgrænsning: Ingen app-kode eller live sites er ændret. Ingen nye live
mailtilmeldinger, udsendelser eller produktionsændringer. Links, theme,
formularer, thank-you-redirect, bogreol og video er design, ikke funktionstestet
UI. VSL er ikke optaget. 320px/dark mode, mailbekræftelse, afmelding, CORS og
idempotens er implementeringskontroller, ikke beståede tests. App-testpakken
er ikke genkørt for dette designarbejde.

## Historik: visuelt familiecanvas v3

Start i [OpenPencil](http://127.0.0.1:60864/) med
[brand-family-canvas-v3-owner-review.op](brand-family-canvas-v3-owner-review.op).
Dette var kandidaten før de monokrome farver, newsletter og fælles footers.
Der er 430 redigerbare noder fordelt på syv boards: fælles designoversigt,
tre rejsekort, Arc’IT desktop/mobil og Gustav Online desktop med egne billeder.

Gustavs seneste valg er med: Founder, fire sociale links samlet øverst,
Kastanje AI / AI inference, ingen newsletter-blok, kontakt-/repos-række eller
footer på den personlige forside. Headerens Newsletter-link og billeder er
bevaret. Arc’IT deler formsprog med Online Sourdough, med egen afdæmpet
mist/pine-palette og uændret sort/hvidt logo.

Seneste File → Open, faktisk canvas, File → Save og native eksport er
kontrolleret. UI-save gik fra v2-hash
`01e9fcebcf0dda9c1b4d0ed50911a16daef498967ba2889b09525bc84c834e95`
til v3-hash nedenfor, identisk med den holdbare kandidat. Original seed er
stadig uændret. Helpers hash/node/export-check bestod. Nyt hovedcanvas og
Gustav-desktop er visuelt læst, og Arc’ITs bevarede desktop/mobilgeometri
er kontrolleret. Foreground/background-par i Arc’IT er beregnet til 14,85:1
(tekst), 5,40:1 (sekundær tekst) og 7,87:1 (primærknap).

Browserproof med faktisk Geist/Pixel:
`../../output/playwright/family-v3-canvas-review.png` og
`../../output/playwright/brand-family-overview-final.png`.
Native PNG’er: `family-v3-exports/` (fallbackfont, ikke præcis typeproof).

| Aktuelt artefakt | SHA-256 |
| --- | --- |
| DESIGN.md | `0423fa1f4fd3ac72b7d4a71aa310a8350c34203f5289bbbee9f14a6ae618afa3` |
| OPGAVE.md | `107ff00c0be4ef1640558ad5b4f5c4c6d6a90959f421dc0194550ee684bd0cca` |
| v3 native dokument | `6868974bf4fafc5fbaad8c187d73794cf8e7976431e164917a18d043a1ab1a69` |
| v3 native hovedcanvas | `ae6ee50a7b662b63b7efbf074afaf434237b937a73b9cf0c93fe180845bc3bc5` |

Codex self-check: klar til Gustavs owner-review, ikke en ekstern design-
godkendelse. De live websites er uændrede. Theme-knapper, navigation,
formularer og video er design, ikke fungerende UI. Ingen VSL er optaget.
Kastanje-destinationen skal vælges før implementering; intet domæne er gættet.
Gustav Online-previewet er desktop; dets mobilvariant er ikke udført her.

## Historik: første kunderejse-udkast

Start med [opgaven](OPGAVE.md), derefter [research](RESEARCH.md) og
[designretningen](DESIGN.md).

Redigerbar fil: [customer-journey-owner-review.op](customer-journey-owner-review.op).
Fem native boards: Gustav, Frederik, Owain, Arc’IT desktop og Arc’IT mobil.
Live editor ved handback: http://127.0.0.1:60864/ — midlertidig lokal proces,
ikke et hosted link eller en production-deploy.

## Verificeret

- Eksisterende canvas set i den af Gustav godkendte separate Chrome-session
  før authoring. Ingen kontrol af Codex’ indbyggede browser var tilgængelig.
- Den tidligere R4-editor er bevaret i `previous-editor-preserved.op` og i
  dens oprindelige R4-reviewfil. Kun den private aktive editor blev erstattet.
- Native MCP-authoring oprettede 255 noder. Kandidaten blev åbnet med
  File → Open og browserens faktiske filvælger. Alle fem boards renderede.
- File → Save ændrede den kendte private working-fil fra R4-hash
  `6395beef34c28e8fef6ee802d731042849c9a360c3c9e5aa2af503916fb5fcba`
  til kandidatens hash nedenfor. Den holdbare kandidat blev derefter genåbnet.
- Native export af alle fem top-level frames er gennemført og visuelt læst.
  De ligger i `native-exports/`. Helperens `check` bestod med 255 noder,
  eksakt dokumenthash og det verificerede Gustav-map-export.
- Browseren blev også inspiceret tættere på læsestørrelse: kortet samt
  desktop/mobil. Ingen observeret overlap/clipping i den valgte komposition.
- Author-scriptets gentagelsesværn er testet: en ny kørsel afviste eksisterende
  kandidat før mutation. Det skal ikke genkøres for at redigere designet.
- Ingen ændring af React/Worker, produktion, ejercontext eller eksisterende
  localhost-side. App-testpakken er derfor ikke genkørt for denne designopgave.

## Review og begrænsninger

Reviewer: Codex, self-check af retning og artefakter. Teknisk artifact-check
PASS; endelig owner-review hos Gustav er stadig **pending**. Det er ikke
en godkendelse af ny forretningsmodel eller produktion.

AIOS’ interviewmetode førte til den afgørende målgruppeafklaring; design-
metoden begrænsede udkastet til én kort leveranceside og eksisterende menu.
De tre kort er interne beslutningsværktøjer, ikke public-facing design.

Skærmbilleder i `../../output/playwright/`:

- `journey-first-open.png`: alle fem boards genåbnet.
- `gustav-customer-journey.png`: faktisk browser-crop af eget kort.
- `arcitai-journey-page-browser.png`: faktisk desktop/mobil-canvas.

OpenPencil viser stilltilstande, ikke fungerende video, motion, links eller
formularer. Founder-VSL mangler. Ingen fast videolængde er lovet. Desktop
viser theme-placering; dark/mobile-theme-interaktion er ikke valideret her.
Native eksport bruger fallbackfont; den autoriserede Chrome-origin har de
importerede Geist-fonte. Eksporten er derfor ikke præcis typografisk proof.
En anden browserprofil kan kræve import af de eksisterende licenserede
fonte fra `../practical-delivery-r3-2026-09-21/openpencil/fonts/`.

Frederiks indbakke/confirmation/sekvenser er ikke verificeret. Model-formen
blev indsendt efter konkret tilladelse, og walkthrough-redirect blev set.
Den almindelige newsletter-form ramte CAPTCHA og er ikke fuldført. Ingen
CAPTCHA blev løst/omgået, og ingen venteliste/køb/booking blev gennemført.

## Identitet og runtime

OpenPencil 0.8.4, release commit
`c51d7ed41a96068a09127bbc096fee143fce0b22`. Genbrugt ekstern recovery-runtime;
ikke en ny release-byte-verifikation. Runtime, licenses og RECOVERY.md ligger
under `~/Library/Application Support/OpenPencil/runtimes/0.8.4-arcitai-recovery`.
Skillpakken er ikke ændret. Kilde-seed forblev 1 node og uændret.

| Artefakt | SHA-256 |
| --- | --- |
| DESIGN.md | `5441fe342a98b712d9d5f6d429ab9eda3babc38d866bb2d392736c10b8586a28` |
| OPGAVE.md | `d75d31743f663ba08978ca6bf88a6527d638adf08f3dca160a6867881de79634` |
| RESEARCH.md | `f81e2eb80d1e6411df571f016b0e82c6c3660eb356d41098556e31621c446e35` |
| customer-journey-owner-review.op | `46f5b88bbf6065e0b453f08e76e03e6e8b21c1604b420561102814e5d5383e2c` |
| native Gustav-map PNG | `519205358972cf71ad367b4491cf84a1e6b85f39bbb7ce79df01dd8fccdc8fc8` |
| oprindelig kilde-seed | `d956e8497282a564dbe0cd672890f0975aae6fd7b9e419fd3644bab2c1be983f` |

Næste relevante skridt er Gustavs valg af retning — ikke mere kosmetisk
iteration eller deployment uden en accepteret kunderejse.
