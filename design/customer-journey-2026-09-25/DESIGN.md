# Én sammenhængende forretning, to forskellige købsbehov

Status: Godkendt til lokal implementering af Gustav, 25. september 2026.
Tre funktionelle lokale previews er næste review; produktion kræver Gustavs
separate godkendelse. OpenPencil-filen bevares som godkendt designgrundlag.
Seneste copyrettelser i HTML: “AI and software, done for you”, “Done-for-you
AI and secure software” på Gustav Online og “AI Agent Factory”. Ingen punktum
sidst i hero-overskrifter. Implementering og bevis: ../../docs/local-review-2026-09-25.md.
Resten nedenfor dokumenterer designbeslutningerne, herunder tidligere ordlyd.

## Seneste præcisering: canvas og fælles designfamilie

### HTML-review: fælles shell, produktionscopy og egne accenter

Seneste ejerrettelser gælder foran de ældre kompositionsforslag nedenfor:

- `gustavonline` skrives med småt i ét ord. Socialikoner står under portrættet,
  med samme venstrekant, og beholdes i footeren. De tre faktiske projekter
  og en fjerde række til det eksisterende newsletter står i en kompakt liste
  uden “Projects”-overskrift. Intet opfundet “latest”-issue eller ekstra projekt.
  Alle sider er mindst viewport-høje: footeren følger bunden på korte sider
  og det naturlige indhold på lange sider. Ingen fixed footer eller blankt felt
  efter footeren. Dette erstatter det tidligere content-height-only-forslag.
- Kyzo er genbesøgt i den rigtige browser: den kompakte todelte projektrække
  og socialikonerne er relevante; hans antal projekter, statusser, årstal og
  svage tekstkontrast overtages ikke.
- Fælles header/footer-yderkant er 1120px og mindst 40px desktop/20px mobil.
  Den personlige læsespalte forbliver smallere end tilbudssiderne.
- Online Sourdough: Offers/Menu/About er centreret på desktop; Newsletter
  og theme ligger til højre. Arc’IT: Offers centreres, samme utility-placering.
  Smalle skærme prioriterer plads til logo, Offers, Newsletter og theme.
  Arc’ITs dropdown får samme kompakte skala og afstand under headeren som
  Sourdoughs, men bevarer skarpere hjørner og monokrome flader.
- Ingen farvet baggrund/cirkel/firkant på theme-hover: kun ikonet farves.
  Tilgængelig tastaturfokus beholdes. `gustavonline` bruger orange
  #b64d16 / #ec9255, Online Sourdough varm brun #85552f / #dbad7c.
  Arc’IT prøver en afdæmpet stålblå #4265a0 / #93b4e9 på interaktioner;
  flader, mark og animationernes neutrale former forbliver monokrome.
- Familie-links får hver sin eksisterende identitet: Gustav-portræt,
  pixelboule eller Cut Six. Pixelboulen bevarer silhuet og snit med ensartede
  mellemrum mellem felterne, også i header/footer. Begge footer-marks forbliver
  monokrome på hover/fokus; linkteksten får sidens accent. Ingen nye logofigurer.
- Online Sourdoughs live homepage- og About-copy er sammenholdt direkte
  med produktion og gendannet, bortset fra den aftalte hero uden punktum
  og navneskrivningen `gustavonline`. Den tidligere lokale business-copy er
  ikke længere kilden. Det eksisterende levende brød genbruges fra den
  deployede kildes familie, ikke en erstatningsanimation.
- Arc’ITs “The work I take care of” er synlig igen som tilbudsoverskrift.
  Større luft mellem de to tilbud og før AI Agent Factory; den accepterede
  video, forespørgselsroute og reversible pipeline er uændrede.
- Arc’ITs hero-overskrift og indledning er centreret over videoen.
  Sourdoughs levende brød får en 360px høj desktop-scene i venstre kolonne;
  hero og method følger samme .9fr/1.1fr-opdeling og 70px mellemrum.
  Mobil beholder brød/overskrift side om side med brødscenen på 170px,
  mens den forklarende tekst går over hele bredden.

Kilder: https://onlinesourdough.com/ og /about/ samt https://www.kyzo.io/,
inspiceret 25. september 2026. Det levende brøds kilde er det read-only
checkout `onlinesourdough-preview`, commit 4514634; komponenten er kopieret
til det faktiske produktrepo uden en cross-repo runtimeafhængighed.
Nyeste skærmbevis hedder `output/playwright/refine42-*` i Arc’IT-repoet.
Der er kun ændret lokale previews; produktion og native canvas er urørte.

Gustavs korrektion under HTML-review: bøgerne på Online Sourdough er en del af
sidens identitet og skal bevares, med ryg, omslag, hylde/lomme og bevægelse.
De flade cards i det kompakte OpenPencil-board er ikke en godkendelse til at
fjerne dette. Fælles familie gælder shell, typografi, links og rytme, ikke
ensretning af siderne. Gustav beholder sin personlige collage og bogreol;
Arc’IT beholder landskab, originale mark og abstrakte/pipeline-animationer.
Dette erstatter nedenstående kompakte previews' flade menu-cardfortolkning.

Gustav ønsker en visuel oversigt frem for mere researchtekst. Det primære
review er derfor nu et fælles canvas med de tre brands side om side, mens
rejsekort og research er baggrund. Arc’IT skal visuelt høre sammen med de
andre; ikke alene dele en footer eller en ejer.

Den faktiske Online Sourdough-side er det primære visuelle grundlag:
paper #f8f2e8, brunt/sort ink, Geist Sans + Pixel, almindelig header med fin
bundstreg, meget diskret grid og pixelillustrationer. Gustav Online bruger
en nært beslægtet off-white (#fbfaf7) og mørk tekst (#1f1f1f).

Fælles regler i det seneste canvas: samme rolige header, fine linjer,
Pixel-overskrifter og små, næsten rektangulære mørke knapper. Ingen
glaspaneler eller et selvstændigt design-system kun for Arc’IT.

Gustav har fravalgt mint/grøn og præciseret forskellen: Online Sourdough er
blødere og mere personlig; Arc’IT er den præcise, kantede DFY-leverance.
Arc’IT får derfor neutral white #fafafa, ink #202020, muted #626262,
line #dddddd og sort primærknap #202020. Illustrationernes UI-former er
gråtoner, ikke grønne. Logoet er fortsat sort/hvidt. Den eksisterende
landskabsscene bevarer sine naturlige farver; den er ikke en brandaccent.

Det diskrete grid flyttes fra Online Sourdough-previewet til Arc’ITs hero:
#ededed, 1px linjer, 80px mellemrum på desktop og 40px på mobil. Gridet
stopper før tilbudsteksten og ligger bag indholdet, aldrig oven på videoen.
Knapper får 2px hjørner og video 4px. Ingen futuristiske dashboarddetaljer.
Online Sourdough beholder paper/cocoa, uden grid, med rolige papirflader,
20px kortradius i det kompakte kompositionsstudie og egne lo-fi-illustrationer.
Der tilføjes ikke en ny støjtekstur eller bølgemønster for at udfylde fladen.
Gustav Online beholder chalk/ink og sin personlige collage. Samme typografi,
header, theme-kontrol og rytme gør siderne beslægtede uden at gøre dem ens.
Arc’IT er mindre personligt iscenesat, men skjuler ikke Gustav som ansvarlig
leverandør eller foregiver at være et stort team.
Arc’ITs eksisterende scene bruges inde i videoen, ikke som en dominerende
separat brandverden bag hele forsiden.

Gustav Online-forslaget tager Kyzo-sidens smalle personlige introduktion og
konkrete projekt-/linkliste, men beholder Gustavs tekst, mailrelation, egne
assets og familie. Ingen kopierede projekter, exit-statusser eller lavkontrast-
mikrotekst. Kyzo er faktisk inspiceret på desktop og mobil. De tre previews
på hovedcanvas er kompositionsstudier, ikke tre færdige responsive websites.

Online Sourdough-previewet genbruger de fire faktiske lo-fi-assets fra det
lokale ejerrepo. Gustav-previewet genbruger hans eget portræt. Disse assets
er indlejret i det native dokument; ingen tredjepartsmedier er downloadet.

Det tidligere `customer-journey-owner-review.op` bevares som forrige version.
Seneste kandidat er `brand-family-complete-owner-review.op`. De efterfølgende
businessvalg gælder fortsat; seneste visuelle regler her erstatter forslagets
tidligere Sans-hero og pill-formede CTA.

Gustavs efterfølgende konkrete valg for den personlige forside: behold den
eksisterende header med logo, Newsletter-link og theme, hans portræt og den
personlige billedcollage. Brug “Founder” under navnet. Saml YouTube, Instagram,
LinkedIn og GitHub øverst. Vis tre projekter:
onlinesourdough, Arc’IT AI og Kastanje AI (“AI inference”). Fjern forsidens
newsletter-blok, open-source-række og collaborations/email-række. Ingen
collection/writing/health-tabs. Newsletter-linket går til den eksisterende
separate indgang, som YouTube og andet indhold også kan pege direkte på.
GitHub er en social/profil-destination, ikke en ekstra projektrække.

Det senere ønske om en fælles footer på alle tre sider erstatter det første
forslag om helt at fjerne footeren på den personlige side. Den er nu en lav,
rolig navigationsrække, ikke endnu en profil- eller newslettersektion.
Theme-ikonets lyse/mørke tilstand skal følge Online Sourdoughs eksisterende
17px crescent/sun, samme hit area og fokusadfærd. Canvas viser formen; faktisk
theme-state, persistence og tastaturadfærd er implementeringsarbejde.

## Ét newsletter, tre brandede indgange

Gustav har bedt om Newsletter i alle tre headers. Det er samme newsletter
fra Gustav Online, ikke tre lister eller forskellige redaktionelle løfter.
Gustav Online er fortsat ejer af afsender, samtykke, afmelding og arkiv.
En tilmelding må ikke føre til dobbelt udsendelse, selv om samme email bruger
mere end én indgang. Ingen ny sendefrekvens, mailserie eller lokkemad er aftalt.

Den nuværende `/newsletter` hos Gustav Online er set på desktop og mobil.
Den har en stor arkivoverskrift og derefter en stor formularoverskrift.
Forslaget samler toppen: “Notes from the work.”, tydelig afsender,
én forklaring og én formular med synlig “Email address”-label.

Fælles engelsk copy:

> Notes from the work.
>
> A newsletter by Gustav Anderson.
>
> Experiments, workflows and lessons from using AI in a real business.

Knap: “Subscribe”. Under formularen: “One newsletter from Gustav Online.
Unsubscribe anytime.” Sidstnævnte kræver, at den eksisterende mailleverance
har en fungerende afmeldingsvej; den funktion er ikke end-to-end-verificeret her.

- Gustav Online: off-white, egne identitetsassets og den eksisterende bogreol
  nedenunder. Arkivet er sekundært i forhold til tilmelding, ikke en anden
  hero. Brug den fælles lave footer. Den observerede live side har ingen
  publicerede issues. Canvas viser derfor en bogstøtte/empty state, ikke
  opfundne udgaver. Genbrug den eksisterende bogreolskomponent ved implementering.
- Online Sourdough: samme formular og ordlyd, varmt papir og bløde hjørner.
  Ingen bogreol, yderligere offersektioner eller newsletter-footerkatalog.
- Arc’IT: samme formular og ordlyd, monokromt, skarpe linjer og diskret grid.
  Ingen bogreol. Personlig afsender er stadig eksplicit, selv om indgangen
  er et mere nøgternt leverancebrand.

Alle tre får en enkel branded takkeside, kun efter anerkendt tilmelding:

> You’re on the list.
>
> You’ll hear from Gustav when the next note is ready.

Én returhandling fører tilbage til siden, man kom fra: “Back to Gustav Online”,
“Explore the menu” eller “Back to Arc’IT AI”. Ingen automatisk salgsbooking,
upsell eller løfte om en mail sendt lige nu. Hvis det faktiske mailsystem
kræver double opt-in, skal tilstanden i stedet sige “Check your inbox” indtil
bekræftelse; hverken dette eller den efterfølgende email er verificeret her.
Fejl beholder email og bliver ved formularen; ingen fejlagtig success-redirect.
Pending viser “Subscribing…” og beskytter mod gentaget submit.

Foreslået routing: `/newsletter` og `/newsletter/thank-you` i hvert brands
egen visuelle shell; del formularlogik og det eksisterende Gustav Online-
newsletter-endpoint. Det er et implementeringsforslag, ikke oprettede routes.
Den læste lokale kontrakt tillader allerede `gustavonline`, `onlinesourdough`
og `arcitai` som `source`. Det er attribution, ikke tre abonnementer.
CORS, samtykke, idempotens og afmelding skal kontrolleres før implementering
og release; ingen ny backend eller Arc’IT Project Inquiries-route skal eje det.

På mobil står label, input og knap i fuld bredde. Headeren holder Newsletter
synligt sammen med Offers og theme på tilbudssiderne, uden overlap eller
tekst mindre end 14px. Det fælles arkiv bor kun hos Gustav Online; de andre
newsletter-indgange må gerne forblive korte sider.

## Samme footer-system, uden copyright eller links til sig selv

Gustavs seneste valg gælder også de brandede newsletter- og takkesider:
fin divider, samme læsbare størrelse og samme spacing. Venstre er links til
de andre sites i forretningen; højre er YouTube, Instagram, LinkedIn og GitHub
i samme rækkefølge og med samme monokrome ikonfamilie. Profilerne er Gustavs
eksisterende offentlige profiler. Footerens GitHub peger konsistent på
`github.com/gustavonline`; organisationsrepos hører fortsat hjemme i relevant
produkt-/ressourceindhold. Ingen “© 2026”, juridisk støj eller ekstra slogan.

- Gustav Online: Online Sourdough + Arc’IT. Intet selv-link eller ekstra portræt.
- Online Sourdough: lille portrætfirkant + Gustav Online, derefter Arc’IT.
- Arc’IT: lille portrætfirkant + Gustav Online, derefter Online Sourdough.

Gustav Online beholder også de eksplicit ønskede tekstlinks til sociale profiler
øverst. De diskrete footerikoner er del af det senere fælles-footerønske.
På mobil står søstersiderne på første række og sociale ikoner på næste,
højrestillet med mindst 44px klikflade ved implementering. Tekst skjules ikke
i tiny type; hvert ikon får sit navn som tilgængeligt label.

Online Sourdoughs nuværende afsluttende method-/about-afsnit og store
brand-signatur må fortsat hænge sammen med footeren. Det er den nederste
divider/række, der standardiseres; ikke et krav om tre identiske store
footerblokke. Den varme/dybe brune footer kan beholdes dér, mens Arc’IT er
neutral. Det ekstra footer-board viser dette særtilfælde. De kompakte
oversigter viser kun den fælles nederste navigationsrække.

## Beslutningen, vi prøver af

Gustav har præciseret, at den gode Arc’IT-kunde er en virksomhed eller et team,
der vil have arbejdet udført. Founders og business leaders er den primære
indgang til Online Sourdoughs done-with-you-forløb. En founder kan stadig købe
på en virksomheds vegne; skellet er det købte ansvar, ikke personens titel.

Anbefaling: Behold Arc’IT som leverancebrand og selvstændig destination. Lad
Complete Bake være navnet på DFY-valget i Online Sourdoughs menu, ikke endnu
en selvstændig service oven på Arc’IT. Skriv ved overgangen:

> Complete Bake — Done for you by Arc’IT AI.

Tre roller, men ikke tre obligatoriske stop:

- Gustav Online: personen, offentlig dokumentation, YouTube, LinkedIn,
  Instagram og den løbende relation på mail.
- Online Sourdough: metoden og valget mellem ressourcer, hjælp til selv at
  arbejde med AI og at få arbejdet udført.
- Arc’IT AI: virksomheder/teams, konkret opgave, afgrænset ansvar og levering.

En virksomhed kan komme direkte til Arc’IT via en anbefaling, relevant video
eller et opslag. Den skal ikke først tilmelde sig eller forstå sourdough-
metaforen. Online Sourdough er en menu, ikke en adgangskontrol til Arc’IT.

## To kompakte muligheder

1. Alt under Online Sourdough: færre navne og én vedligeholdt hjemmeside.
   Relevant hvis samme målgruppe køber samme type hjælp. Ulempen her er at
   læringsuniverset og den ansvarstagende B2B-leverance får samme indpakning.
2. Online Sourdough + en kort Arc’IT-destination: et ekstra navn/domæne, men
   tydeligere ansvar og mulighed for direkte B2B-henvendelser. Dette er
   anbefalingen på baggrund af Gustavs målgruppeafklaring — ikke dokumenteret
   konverteringsløft. Den korte side skal kunne stå alene uden at genfortælle
   hele Online Sourdough-universet.

## Kunderejser

Owain Lewis er primær reference for forretningsopdelingen: personligt indhold,
AI Engineer for selvstændig læring med gruppestøtte, Build Together for privat
projekthjælp og GradientWork for implementering. AI Engineers egen FAQ gør
ansvarsforskellen eksplicit. Online Sourdough skal dog ikke arve hans
udviklerfokus eller “100x”-løfte. Frederik er reference for korte sider og
relationen på mail, ikke for hele Gustavs forretningsmodel.

Andreas Ellemstrøm er nævnt af Gustav som supplerende inspiration. Ingen
bestemt side eller påstand er udpeget; intet fra ham er derfor adopteret eller
gættet ind i denne retning.

Læring: indhold → Online Sourdough → Resources eller The Fermentary.
Mail er en frivillig, sideløbende relation hos Gustav Online, ikke et krav
før gratis indhold eller en salgsdialog. Brug den eksisterende mail-ejer;
opret ikke tre separate nyhedsbreve eller lov en ny daglig frekvens.

Levering: relevant indhold/anbefaling → Arc’IT, eller Online Sourdough →
Complete Bake → Arc’IT. Kort walkthrough → projektforespørgsel → afklaring
af opgave, budget, data/adgang, drift og ansvar → konkret aftale.

En varm DFY-kunde skal ikke sendes tilbage til menuen som primær handling.
“Discuss your project” er primær. “All offers” er en diskret tilbagevej.

En separat email-gated metodevideo kan testes senere som en kampagneindgang
til Online Sourdough. Den er ikke nødvendig for Arc’IT, og den oprettes ikke
i dette udkast. En venteliste er kun relevant ved faktisk kapacitetsmangel;
den er ikke en standard-erstatning for en klar forespørgsel.

## Sidecopy — engelsk udkast

Online Sourdough bevarer sin forretningsvinkel:

> Build the business you want to run.
>
> Practical ways to use AI in your business. Explore the resources, work
> through it with me, or have me take care of the implementation.

Menuen bruger de eksisterende fire valg, med konkret forklaring ved hvert:
Content / Resources / The Fermentary / Complete Bake. “Complete Bake” får
aldrig lov at stå uden “Done for you by Arc’IT AI”. De poetiske navne må ikke
være nødvendige for at forstå, hvad man køber.

Arc’IT:

> AI and software, done for your team.
>
> From a promising demo to software your team can use. I review what you
> have, handle the agreed work, and set up the agents and checks around it.

Videohandling: Watch the walkthrough. Primær handling: Discuss your project.
Kort scope: One-off AI consultation / Software review & delivery / AI agent
factory setup. Factory-forklaringen beskriver udvikling og sikkerhedsarbejde
omkring kundens software, ikke et proprietært softwareprodukt.

Der sættes ingen omsætningsgrænse, opfundet pris, sikkerhedsgaranti eller
videolængde. Local AI tilbydes efter vurdering af behov, hardware, datakrav
og budget; det er ikke et løfte om gratis eller vedligeholdelsesfri AI.
Eventuelt løbende ansvar aftales som en del af leverancen.

## Visuel retning: en kort introduktion, ikke en ny lang salgsside

Kompositionsreference: The Digital Coffee Shop /walkthrough/, faktisk inspiceret
på desktop og 390px mobil. Overfør én overskrift, kort forklaring, stor video
og én næste handling. /model/ viser, hvordan en særskilt opt-in kan have én
opgave; den er ikke den valgte standardvej til Arc’IT.

Bevar Arc’ITs egne landskaber, originale sort/hvide Cut Six-mark og Geist.
Ingen kopieret kaffekop, omsætningsclaim, orange identitet eller tredjeparters
medier. Referenceskærmbilleder er kun research, ikke designassets.

- Neutral white #fafafa, ink #202020, muted #626262, rule #dddddd,
  grid #ededed. Ingen mint/grøn brandaccent. Dark-mode-tokenforslag:
  surface #171717, ink #f5f5f5, muted #b8b8b8 og grid #222222;
  dark mode er ikke tegnet eller interaktionstestet i dette canvas.
- Klar tekstnavigation, ingen glasbjælke. Arc’IT-navn venstre, All offers
  og den eksisterende theme-kontrol højre.
- Venstrestillet, læsbar Pixel-overskrift over en lys 16:9-scene med 4px hjørner.
  Ingen mørk flade over hele heroen. Video er sidens grafiske hovedpunkt.
- Primær mørk knap, ikke flere ens konkurrerende CTA’er.
- De tre eksisterende tilbud er korte uddybninger under videoen. Bevar
  to-plus-one-fordelingen og brug de eksisterende abstrakte animationer
  som små støttepunkter, ikke endnu en forklaring af hele arkitekturen.
- Desktop 1280px board, 80px margin, video 880px bred. Sidecopy 18–20px,
  overskrift 58px. Mobil 390px, 24px margin, overskrift 36px og brødtekst 17px.
- Mobil: overskrift → forklaring → video → projektknap → kort scope.
- Monokromt logo, langsom scene, reduceret bevægelse respekteres. Pipe-
  animationen er en illustration og må aldrig ligne reel kundestatus.

## Hvad udkastet ikke beviser

OpenPencil viser designfamilien, tre interne rejsekort, den korte Arc’IT-side
på desktop/mobil, et personligt Gustav Online-desktopudkast med billeder,
tre newsletter-/takkesideindgange samt newsletter på mobil og Gustav-desktop.
Kortene er ikke public-facing copy.
Online Sourdoughs eksisterende menu genbruges; et nyt menudomæne og en ny
Online Sourdough-landingpage er ikke nødvendige for dette udkast.

En rigtig founder-walkthrough er endnu ikke optaget. Videooverfladen er et
design af den fremtidige tilstand. Det eksisterende landskabsloop er ikke
en VSL og må ikke udgives som én. Indtil filmen findes, skal en implementering
bevare en ærlig introduktion og projektknap uden falsk walkthrough-afspilning.

Animationer vises som stilltilstande. Links, tema, playback, formularer og
responsive reflow er ikke implementeret i native boards. Den eksisterende
projektformular genbruges som næste trin; ny route `/project` er alene et
forslag og er ikke oprettet. Formens reelle felter/fejltilstande er ikke redrawn.
320px, dark mode, keyboard/focus, captions/transcript og formstates skal
verificeres ved en eventuel implementering, ikke erklæres bestået af denne fil.

## Lille validering før mere arbejde

Bed et par relevante teams og et par founders finde den hjælp, de søger,
ud fra kortet/prototypen. Kan de forklare forskellen uden at kende navnene?
Kan et team gå direkte til en forespørgsel? Behandl svar som kvalitativ
feedback, ikke konverteringsbevis. Ved senere implementering kan man måle
menuklik og kvalificerede forespørgsler uden at tælle afspilninger som salg.

Review: owner, Gustav. Anbefalingen og designet er til vurdering; ingen
automatisk flytning af brands, domæner, samtykker eller eksisterende kunder.
