# Arc’IT AI — draft 03.2

Budskabet er **“From prototype to production-ready software.”** Fra en lovende demo, MVP eller prototype til software, der er klar til den aftalte anvendelse. onlinesourdough er metoden til at arbejde med AI. Software- og defense-factory er to genbrugelige AI-systemer, du sætter op og tager dig af gennem Arc’IT — ikke en ny proprietær platform.

## Åbn og læs

- [Se hele landingpagen på localhost](http://127.0.0.1:4175/) — responsiv web-preview af R3.2, uden editorens canvas.
- [Åbn OpenPencil-workbench](http://127.0.0.1:59191/) — mens den lokale editor kører.
- [Gemte, redigerbare design](openpencil/arcitai-r3.2.op) — den varige fil, også når browserfanen er lukket.
- [Engelsk copy](../../content/practical-delivery-r3-2026-09-21/website-copy.md) — lettest at gennemgå og kommentere her.
- [Hero og navigation i editoren](previews/r32-hero-canvas.png), [ydelser og projektforespørgsel](previews/r32-scope-canvas.png) og [mobilens projektforespørgsel](previews/r32-inquiry-canvas.png).
- [Research-issue med de tre X-links](https://github.com/arcitai/arcitai/issues/6).

Filen har tre navngivne frames: desktop (1440 px), mobil (390 px) og noter om bevægelse, links og senere implementering. Tekst, logoets seks dele, abstrakte motiver, felter og knapper er redigerbare. Det eksisterende landskabsbillede er indlejret; der kræves ikke en forbindelse til en billedserver.

## Lokal web-preview · 22. september

[Web-preview](web/index.html) gengiver det gemte R3.2-design som en hel, scrollende side. Den har sektionslinks, Offers-selector, lyst/mørkt tema og korte abstrakte bevægelser, der respekterer reduced motion og pauser uden for skærmen. Originale lokale billeder og Geist-skrifter følger med; logoet vises kun sort eller hvidt.

Videoen er stadig mærket **Film to be recorded**. Formularen sender og gemmer intet, har ingen tilknyttet API og blokerer netværkskald og formularafsendelse via sin CSP. Det valgfrie dashboard-eksempel er en lokal kopi af det tidligere koncept med eksempeldata og et returlink til denne landingpage.

Previewen ændrer ikke `src/`, `worker/`, live-siden, den engelske copy eller den gemte OpenPencil-fil. Der er ingen automatisk synkronisering fra OpenPencil til HTML. Serveren eksponerer kun `web/` på loopback, ikke repository-roden. Genstart fra en terminal med:

```bash
node /Users/gustavanderson/.codex/plugins/cache/online-sourdough/aios/0.13.0/skills/design/scripts/serve.mjs \
  --design-dir /Users/gustavanderson/Downloads/arcitai/design/practical-delivery-r3-2026-09-21/web \
  --port 4175
```

### Kontrol af web-preview

Codex, 22. september 2026: **PASS for lokal visning**, ikke en produktionsrelease eller endelig ejeraccept. Kontrolleret mod `DESIGN.md` 3.2.0 og de tre R3.2-canvasbilleder. Desktop er 1440 × 4334 px; mobil er 390 × 6522 px. Ingen vandret overflow ved 1440, 390 eller 320 px. Canvas-layoutets naturlige teksthøjder er tilpasset browseren; temaskift og diskret bevægelse er nye preview-interaktioner, ikke ændringer af native-filen.

Browserkontrol: Geist Sans/Mono/Pixel og billeder indlæst lokalt; Offers åbner, får tastaturfokus og lukker på Escape/klik udenfor; sort/hvidt logo følger overfladen; sektionslink til inquiry virker; reduced motion stopper alle motivanimationer; formularens Enter og knap sender ingen requests; eksempel-link åbner det lokale koncept. Ingen konsolfejl eller fejlede requests i den gennemførte kontrol. Skærmbilleder ligger i `output/playwright/arcit-r32-web-*.png` fra repository-roden.

De fire preview-filer består formateringskontrollen. Repository-lint, 38 tests, produktionsbuild og Worker-dry-run består med den eksisterende dependency-installation. Den samlede `npm run check` stopper dog på allerede eksisterende formatering i OpenPencil-scripts/`REVIEW.md`; `npm run audit` finder 7 eksisterende udviklingsdependency-advisories (3 moderate, 4 high). De er ikke rettet som del af denne lokale preview. Preview-serveren bruger kun Node-standardbiblioteket, ikke Vite eller Worker.

Kontrollerede SHA-256:

- `DESIGN.md`: `683b42623be7b8b0beb7b6a5a60fe5b56bd5b394c75318b36c72b1f5b481f83a`
- `web/index.html`: `a5d663fadbb958a28a6047dcd8d6a5e981dce08e092cdd047d480feed6aa8536`
- `web/style.css`: `980067b59246182881d8ae322a32f4c7e2ad48e4f150d56ff4a23940260198e2`
- `web/preview.js`: `5d5b6c1e7a49c623e2588e65a329528758a32aa68d05f5c561ed262672a6f823`
- `web/example/index.html`: `3765408e50a7cc34f50f99669f4072fd616e2157f21f53be16f0eab8aeb9481b`

## Hvis du lukker fanen

Åbn `arcitai-r3.2.op` gennem **File → Open** i OpenPencil. Filen er gemt i projektet, ikke kun i editorens midlertidige tilstand. Ved en senere genstart kan den samme fil åbnes i en ny kompatibel OpenPencil 0.8.4-workbench. En udløbet localhost-adresse betyder ikke, at designet er væk.

Efter reparationen 22. september ligger runtime varigt i `~/Library/Application Support/OpenPencil/runtimes/0.8.4-arcitai-recovery`, og den isolerede workbench i `~/Library/Application Support/OpenPencil/workbenches/arcitai-r31-20260922`. Den gamle adresse på port 59403 bruges ikke længere.

Workbench arbejder i en isoleret kopi. Efter nye ændringer skal en ny `.op` gemmes/downloades med **Save As** til en varig mappe, eller gemmes tilbage i projektet gennem Codex, før workbench lukkes. Stol ikke alene på browserfanen eller den midlertidige arbejdskopi.

Skrifterne er ikke indlejret i `.op`. På en ny browser/installation: **Agents & MCP → Fonts → Choose font → Import font**, og vælg de tre TTF-filer i [fonts](openpencil/fonts/). De hedder **Geist**, **Geist Mono** og **Geist Pixel** i editoren. Licensen følger med. Den kontrollerede browser har alle tre importeret.

## Hvad der er ændret

R3.2 går tilbage til **Offers · Process · Scope · Start**, som i det oprindelige produktionsheader. Offers beholder valget mellem Arc’IT og onlinesourdough; på mobil vises Offers og Start. “Project inquiry”, “AI consultation”, “Code and security review” og “Agent workflow setup” erstatter de mere sloganagtige overskrifter. Copy- og navigationstilretningen ændrer ikke layout, farver, billeder, skrifter eller logo.

Den oprindelige Arc’IT-retning har forrang: almindelig fuldbredde-navbar med uigennemsigtig baggrund og en fin streg, ikke glas. Headeren har kun navnet. Det originale Cut Six-logo er sort på lyse flader og hvidt på mørke — også i VSL-feltet. De grønne landskaber og accenter, Geist-familien og de abstrakte punkt-, ring- og stregmotiver bevares.

Copyen nævner demo, MVP og prototype samt vejen til production-ready software. Den tredje ydelse forklarer software-factory til udviklingen og defense-factory omkring softwaren; FAQ’en forklarer forholdet til onlinesourdough. Loop-sektionen forbliver fjernet. Dashboardet er højst et lille valgfrit eksempel, og footeren har kun eksterne links. Noteframen viser sort/hvid-logoer på begge overfladetyper.

R1, R2, R3 og R3.1 med deres snapshots er bevaret. Tidligere README, copy og designbeskrivelse findes i `history/`. Den præcise ekstra Chrome-variant, du huskede, blev ikke identificeret; dette er et nyt udkast, ikke en påstået gendannelse af den.

## Grænser og kontrol

Dette er et statisk designudkast, ikke en ændring af den live side. Motiverne viser en stillestående animationstilstand med bevægelsesnoter; videoen er ikke optaget, formularen sender intet, og dashboard-linket er et template-koncept med eksempeldata. Der er ikke oprettet et nyt repository eller publiceret en template.

OpenPencil 0.8.4 viser de importerede skrifter på canvas, men den automatiske eksport bruger fallback-skrifter; samme begrænsning blev tidligere konstateret ved GUI-eksport. Filerne i `openpencil/native-exports-r31/` er ældre R3.1-eksportkontrol, **ikke den aktuelle R3.2-preview**. Brug editoren og R3.2-canvas-previews til denne revision. [R3.2-kontrol](REVIEW-R32.md); [R3.1-kontrol](REVIEW-R31.md); [R3-kontrol](REVIEW.md).

Store dokumenter synkroniseres ikke altid mellem native-værktøjet og en allerede åben browser. Den gemte R3.2-fil er derfor åbnet eksplicit gennem File → Open og kontrolleret på canvas. Hvis en anden fane viser en tidligere revision, åbn den nye fil dér; fremtidig synkronisering mellem faner er ikke verificeret.

`DESIGN.md` er den kanoniske designbeskrivelse. De små author/revision-scripts under `openpencil/` er afgrænsede spor fra native-opbygningen; de skal ikke køres mod en færdig fil, du er begyndt at redigere.
