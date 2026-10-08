# Kunderejser — undersøgt 25. september 2026

Senere visuelt input: [Kyzo](https://www.kyzo.io/) blev inspiceret på desktop
og mobil. Det nyttige signal er en kort personlig introduktion, profiler
øverst og en konkret projektliste — ikke hans projekter, statuslabels, tabs
eller meget svage tekstkontrast. Gustav valgte selv at flytte sin newsletter-
tilmelding væk fra forsiden og bevare header-linket. De eksisterende Gustav
Online- og Online Sourdough-sider er også visuelt sammenlignet. Fælles
typografi, tynde linjer og beslægtede papirflader styrer det nye canvas;
Arc’IT er efter Gustavs seneste valg monokromt med diskret grid; den tidligere
grønne hypotese er fravalgt. Det er designforslag,
ikke dokumenteret ændring i konvertering.

Statusord: **Observeret** = faktisk side/link/handling i browseren;
**konfigureret** = offentlig formularopsætning, ikke nødvendigvis faktisk
redirect; **selvbeskrevet** = personens egen forklaring, ikke målt effekt;
**ukendt** = ikke testet eller utilgængeligt. Ingen konverteringstal valideret.

## Senere eget input: newsletter og fælles footer

`https://gustavonline.com/newsletter` er faktisk inspiceret på desktop og
390px mobil. Live-siden viste en arkivoverskrift, derefter separat stor
signup-overskrift og empty-state-tekst; ingen publicerede issues. Ingen
formular blev indsendt. Den lokale eksisterende `NewsletterShelf` har en
bogstøtte til empty state og funktionalitet til publicerede issues. Canvas
genbruger denne idé som stillskitse, ikke som bevis for afviklet WebGL.

Den læste lokale `shared/contracts/content.ts` hos Gustav Online tillader
`gustavonline`, `onlinesourdough` og `arcitai` som tilmeldingskilde. Dette
understøtter et forslag om fælles newsletter med attribution, men beviser
ikke live CORS, samtykke, bekræftelsesmail, afmelding eller deduplikering.

Online Sourdoughs live footer blev genbesøgt: stor brun brand-signatur over
den nederste række, copyright venstre og portræt/Gustav/Arc’IT/GitHub højre.
Gustavs eksplicitte ændring er derfor konkret: behold afslutning/signatur,
men fælles divider og søstersider venstre, sociale profiler højre, ingen
copyright. Hans egne eksisterende sociale SVG-paths og portræt genbruges.
Ingen af de live sider er ændret.

## Frederik Pahuus — kortlægning

| Indgang | Observeret rolle og næste trin |
| --- | --- |
| [Personligt site](https://frederikpahuus.com/) | Offentligt mailarkiv og subscribe. [Links](https://frederikpahuus.com/profile/links) peger på 1:1-ventelisten. |
| [Nyhedsbrev](https://thedigitalcoffeeshop.com/) | Email-opt-in. Konfigureret til `/thank-you`. Det konkrete testforsøg udløste en CAPTCHA; derfor ingen verificeret redirect eller fuldført tilmelding fra denne indgang. |
| [Model](https://thedigitalcoffeeshop.com/model/) | Email til en walkthrough og løbende mails. Efter udtrykkelig tilladelse indsendt én gang med Gustavs valgte adresse. Faktisk destination: `/walkthrough/`. |
| [Walkthrough](https://thedigitalcoffeeshop.com/walkthrough/) | Video + én hovedknap til menuen. Også tilgængelig ved direkte besøg uden tilmelding. |
| [Thank you](https://thedigitalcoffeeshop.com/thank-you/) | Beder besøgende bekræfte på mail og har en vej videre til menuen. At se siden er ikke bevis på bekræftet abonnent. |
| [Menu](https://www.thedigitalmenucard.com/) | Fælles tilbudsoversigt; flere forskellige veje videre, ikke én checkout. |
| [Waitlist](https://thedigitalcoffeeshop.com/waitlist/) | Specifik 1:1-mentorship-kø. Email og bekræftelsesbesked. Ikke en generel indgang til hele forretningen; ikke indsendt i researchen. |

Vigtig forskel mellem kilde og adfærd: `/model/`s synlige Kit-konfiguration
angav `/thank-you`, men den gennemførte browserhandling landede på
`/walkthrough/`. Den faktiske handling er stærkere bevis. Root-formen og
model-formen har forskellige offentlige Kit-form-ID’er. Der er ikke adgang
til hans interne tags, segmenter eller automations.

Menuens grene:

- Tools → [Digital Coffee AI](https://digitalcoffee.ai/), som viser login/access.
- Inner Circle og Mentorship → samme offentligt linkede Google Doc
  ([invitation](https://docs.google.com/document/d/1RSHl7reo6ieQt3uk1FwL8BOr2KMOw6sS_lpW5EbJqH0/edit)).
- A Day with Fred → [anden invitation](https://docs.google.com/document/d/1uCYMuaHqWb6uYVaTZJS-FKBaCO1Dv5Orx51Q6MYqh4c/edit).
  Dokumenttitlerne blev verificeret i browseren; fuld checkout/kontrakt ikke.
- [Workshop](https://thedigitalcoffeeshop.com/menu-card-workshop/) er utilgængelig
  for køb i den observerede side.
- [Mastermind](https://thedigitalcoffeeshop.com/october-mastermind/) angiver et
  client-only-arrangement og 2025-datoer; behandles ikke som et aktuelt tilbud.
- DFY står uden ledige pladser; platformen står som kommende. Ingen aktiv
  købsknap observeret på de to kort.

I [sin egen beskrivelse](https://frederikpahuus.com/posts/my-2-hour-day-content-ecosystem)
skelner Frederik mellem den gamle lineære ads/VSL/call-model og et økosystem:
socialt indhold/annoncer skaber opmærksomhed, YouTube bygger tillid, og mail
fører til svar og samtaler om hjælp. Det understøtter at studere relationen
også, ikke kun længden på hans sider. Resultater og økonomi er hans egne
udsagn, ikke bevis for effekten hos Gustav.

Mailstatus: indbakken er ikke læst, intet bekræftelseslink er fulgt, og en
senere nurture-/salgssekvens er ukendt. Codex-værktøjet kunne kun anmode om
at åbne iCloud, ikke styre eller læse fanen. Ingen ny plugin installeret.

## Owain Lewis — den nærmeste strukturelle parallel

| Rolle | Kilde og faktisk næste handling |
| --- | --- |
| Person og indhold | [owainlewis.com](https://owainlewis.com/) knytter personligt nyhedsbrev og YouTube sammen og linker til AI Engineer. |
| DIY med støtte | [AI Engineer](https://aiengineer.co/): selvstændige kurser, community og live Q&A. Primær CTA går til Skool-medlemskab. Målgruppen er teknisk interesserede builders. |
| DWY | [BuildTogether](https://buildtogether.live/): den aktuelle side viser en 30-dages live challenge, gruppehjælp og code/no-code. Datoer/pris er endnu ikke annonceret; CTA er en Google Forms-venteliste. Ingen tilmelding foretaget. |
| DFY | [GradientWork](https://gradientwork.com/): virksomhedsspecifik software og leveranceansvar. Den faktiske browser viste “Fully booked until 2027” og ingen aktive discovery calls. Ingen booking foretaget. |

Der er indbyrdes kildedrift: AI Engineers FAQ beskriver stadig Build Together
som privat projekthjælp, mens BuildTogether-destinationen viser en gruppe-
challenge. Webværktøjets GradientWork-version viste Calendly-handlinger,
mens den aktuelle browser viste kapacitetslukning. Kortet bruger den faktiske
destinationsside for aktuelt format/tilgængelighed, ikke en påstået afklaret
checkout-rejse. YouTube-linket blev åbnet, men stop ved cookie-samtykke;
videoernes CTA’er eller indhold er ikke analyseret.

Læringen er ansvarsforskellen mellem at lære, få hjælp og få udført. Ikke at
Gustav skal kopiere hans developer-positionering, løfter, priser eller alle
hans domæner. Der er heller ikke belæg for en obligatorisk YouTube → AI
Engineer → GradientWork-rækkefølge.

## Gustav — eksisterende fundament

[Gustav Online](https://gustavonline.com/) har allerede newsletter, sociale
kanaler samt direkte links til både Online Sourdough og Arc’IT. [Online
Sourdough](https://onlinesourdough.com/) har allerede Content → YouTube,
Resources → ressourcessitet, The Fermentary → DWY og Complete Bake → Arc’IT.
Der skal derfor ikke bygges et nyt menudomæne for at efterligne Frederik.

Gustavs afklaring i denne samtale er grundlaget for anbefalingen: teams/
virksomheder køber DFY, founders/business leaders arbejder primært DWY.
Det er ikke en markedsundersøgelse eller bevist segmentering.

## Valgte designprincipper

Frederiks /walkthrough/ blev inspiceret på desktop og 390px: én overskrift,
én video og én hovedhandling. /model/ blev også inspiceret på begge størrelser.
Overfør enkelheden, ikke hans ord, kaffebilleder eller omsætningsclaims.
Owains sider er strukturel inspiration, ikke den visuelle skabelon.

Lokale beviser findes i `output/playwright/`: `funnel-reference-*.png`,
`funnel-extended-*.png`, `funnel-model-desktop-final.png`,
`funnel-walkthrough-mobile.png`, `funnel-newsletter-after-submit.png`,
`reference-gradientwork.png`, `reference-aiengineer.png` og
`reference-buildtogether.png`. Den første model-capture var en ufuldstændig
animationstilstand; brug den senere desktop-capture som visuelt bevis.
