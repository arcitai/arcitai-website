# Arc’IT AI — draft 03.1

Budskabet er **“You’ve got it working. Let’s take it further.”** Fra en lovende demo, MVP eller prototype til software, der er klar til den aftalte anvendelse. onlinesourdough er metoden til at arbejde med AI. Software- og defense-factory er to genbrugelige AI-systemer, du sætter op og tager dig af gennem Arc’IT — ikke en ny proprietær platform.

## Åbn og læs

- [Åbn OpenPencil-workbench](http://127.0.0.1:59403/) — mens den lokale editor kører.
- [Gemte, redigerbare design](openpencil/arcitai-r3.1.op) — den varige fil, også når browserfanen er lukket.
- [Engelsk copy](../../content/practical-delivery-r3-2026-09-21/website-copy.md) — lettest at gennemgå og kommentere her.
- [Hero i den faktiske editor](previews/r31-hero-canvas.png), [ydelser](previews/r31-offers-canvas.png), [systemer og FAQ](previews/r31-systems-and-faq-canvas.png) og [hele boardet](previews/r31-board-overview.png).
- [Research-issue med de tre X-links](https://github.com/arcitai/arcitai/issues/6).

Filen har tre navngivne frames: desktop (1440 px), mobil (390 px) og noter om bevægelse, links og senere implementering. Tekst, logoets seks dele, abstrakte motiver, felter og knapper er redigerbare. Det eksisterende landskabsbillede er indlejret; der kræves ikke en forbindelse til en billedserver.

## Hvis du lukker fanen

Åbn `arcitai-r3.1.op` gennem **File → Open** i OpenPencil. Filen er gemt i projektet, ikke kun i editorens midlertidige tilstand. Ved en senere genstart kan den samme fil åbnes i en ny kompatibel OpenPencil 0.8.4-workbench. En udløbet localhost-adresse betyder ikke, at designet er væk.

Workbench arbejder i en isoleret kopi. Efter nye ændringer skal en ny `.op` gemmes/downloades med **Save As** til en varig mappe, eller gemmes tilbage i projektet gennem Codex, før workbench lukkes. Stol ikke alene på browserfanen eller den midlertidige arbejdskopi.

Skrifterne er ikke indlejret i `.op`. På en ny browser/installation: **Agents & MCP → Fonts → Choose font → Import font**, og vælg de tre TTF-filer i [fonts](openpencil/fonts/). De hedder **Geist**, **Geist Mono** og **Geist Pixel** i editoren. Licensen følger med. Den kontrollerede browser har alle tre importeret.

## Hvad der er ændret

Den oprindelige Arc’IT-retning har forrang: almindelig fuldbredde-navbar med uigennemsigtig baggrund og en fin streg, ikke glas. Headeren har kun navnet. Det originale Cut Six-logo er sort på lyse flader og hvidt på mørke — også i VSL-feltet. De grønne landskaber og accenter, Geist-familien og de abstrakte punkt-, ring- og stregmotiver bevares.

Copyen nævner demo, MVP og prototype samt vejen til production-ready software. Den tredje ydelse forklarer software-factory til udviklingen og defense-factory omkring softwaren; FAQ’en forklarer forholdet til onlinesourdough. Loop-sektionen forbliver fjernet. Dashboardet er højst et lille valgfrit eksempel, og footeren har kun eksterne links. Noteframen viser sort/hvid-logoer på begge overfladetyper.

R1, R2, R3 og deres snapshots er bevaret. R3’s tidligere README, copy og designbeskrivelse findes i `history/`. Den præcise ekstra Chrome-variant, du huskede, blev ikke identificeret; dette er et nyt udkast, ikke en påstået gendannelse af den.

## Grænser og kontrol

Dette er et statisk designudkast, ikke en ændring af den live side. Motiverne viser en stillestående animationstilstand med bevægelsesnoter; videoen er ikke optaget, formularen sender intet, og dashboard-linket er et template-koncept med eksempeldata. Der er ikke oprettet et nyt repository eller publiceret en template.

OpenPencil 0.8.4 viser de importerede skrifter på canvas, men den automatiske eksport bruger fallback-skrifter; samme begrænsning blev tidligere konstateret ved GUI-eksport. Filerne i `openpencil/native-exports-r31/` er derfor strukturel eksportkontrol, **ikke godkendt typografisk facit**. Brug editoren og canvas-previews til typografien. [R3.1-kontrollen og de præcise filversioner](REVIEW-R31.md); [tidligere R3-kontrol](REVIEW.md).

Store dokumenter synkroniseres ikke altid mellem native-værktøjet og en allerede åben browser. Den gemte R3.1-fil er derfor åbnet eksplicit gennem File → Open og kontrolleret på canvas. Hvis en anden fane viser R3, åbn den nye fil dér; fremtidig synkronisering mellem faner er ikke verificeret.

`DESIGN.md` er den kanoniske designbeskrivelse. De små author/revision-scripts under `openpencil/` er afgrænsede spor fra native-opbygningen; de skal ikke køres mod en færdig fil, du er begyndt at redigere.
