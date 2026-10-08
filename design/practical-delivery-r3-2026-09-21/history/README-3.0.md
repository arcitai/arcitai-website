# Arc’IT AI — draft 03

Den nye retning er **“You’ve got it working. Let’s take it further.”** Du hjælper med at gennemgå og forbedre det, kunden allerede har, og få en ordentlig arbejdsgang omkring det videre arbejde. Factory-metoderne er en del af din ekspertise, ikke to nye platforme, kunden skal købe.

## Åbn og læs

- [Åbn OpenPencil-workbench](http://127.0.0.1:59403/) — mens den lokale editor kører.
- [Gemte, redigerbare design](openpencil/arcitai-r3.op) — den varige fil, også når browserfanen er lukket.
- [Engelsk copy](../../content/practical-delivery-r3-2026-09-21/website-copy.md) — lettest at gennemgå og kommentere her.
- [Hero i den faktiske editor](previews/hero-canvas.png) og [hele boardet](previews/board-overview.png).
- [Research-issue med de tre X-links](https://github.com/arcitai/arcitai/issues/6).

Filen har tre navngivne frames: desktop (1440 px), mobil (390 px) og noter om bevægelse, links og senere implementering. Tekst, logoets seks dele, abstrakte motiver, felter og knapper er redigerbare. Det eksisterende landskabsbillede er indlejret; der kræves ikke en forbindelse til en billedserver.

## Hvis du lukker fanen

Åbn `arcitai-r3.op` gennem **File → Open** i OpenPencil. Filen er gemt i projektet, ikke kun i editorens midlertidige tilstand. Ved en senere genstart kan den samme fil åbnes i en ny kompatibel OpenPencil 0.8.4-workbench. En udløbet localhost-adresse betyder ikke, at designet er væk.

Workbench arbejder i en isoleret kopi. Efter nye ændringer skal en ny `.op` gemmes/downloades med **Save As** til en varig mappe, eller gemmes tilbage i projektet gennem Codex, før workbench lukkes. Stol ikke alene på browserfanen eller den midlertidige arbejdskopi.

Skrifterne er ikke indlejret i `.op`. På en ny browser/installation: **Agents & MCP → Fonts → Choose font → Import font**, og vælg de tre TTF-filer i [fonts](openpencil/fonts/). De hedder **Geist**, **Geist Mono** og **Geist Pixel** i editoren. Licensen følger med. Den kontrollerede browser har alle tre importeret.

## Hvad der er ændret

Kastanjes landskabshero og mobilens adskillelse af tekst og scene er brugt som inspiration. Arc’ITs egne farver, Geist-familie og rigtige Cut Six-logo er bevaret. Headeren har kun navnet. De tre ydelser har abstrakte punkt-, ring- og stregmotiver. VSL’en har en tydelig placering. Loop-sektionen er fjernet helt; dashboardet er højst et lille, valgfrit eksempel. Footeren har kun eksterne links.

R1, R2 og deres snapshots er bevaret. Den præcise ekstra Chrome-variant, du huskede, blev ikke identificeret; dette er et nyt udkast, ikke en påstået gendannelse af den.

## Grænser og kontrol

Dette er et statisk designudkast, ikke en ændring af den live side. Motiverne viser en stillestående animationstilstand med bevægelsesnoter; videoen er ikke optaget, formularen sender intet, og dashboard-linket er et template-koncept med eksempeldata. Der er ikke oprettet et nyt repository eller publiceret en template.

OpenPencil 0.8.4 viser de importerede skrifter på canvas, men både den automatiske eksport og den testede GUI-billedeksport bruger fallback-skrifter. Filerne i `openpencil/native-exports/` er derfor strukturel eksportkontrol, **ikke godkendt typografisk facit**. Brug editoren og canvas-previews til typografien. [Kontrollen og de præcise filversioner er dokumenteret her](REVIEW.md).

`DESIGN.md` er den kanoniske designbeskrivelse. De små author/revision-scripts under `openpencil/` er afgrænsede spor fra native-opbygningen; de skal ikke køres mod en færdig fil, du er begyndt at redigere.
