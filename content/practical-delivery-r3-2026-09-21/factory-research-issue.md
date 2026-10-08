# Research: en let, harness-baseret software factory og sikkerhedsreview

## Formål

Undersøg de tre referencer nedenfor som input til Arc’ITs genbrugelige leverancemetode. Udgangspunktet er kundens eksisterende værktøjer, repository og arbejdsgang — eksempelvis Codex eller Cursor med afgrænsede instruktioner, skills, tests og review. Ikke en ny Arc’IT-platform som standard.

Dette er en afgrænset researchopfølgning til #5. Det erstatter ikke den samlede tilbuds-/landingpage-opgave og autoriserer ikke implementation, kundescans eller udgivelse.

## Referencer fra Gustav

1. [Rasmic / Micky](https://x.com/Rasmic/status/2094961656082079811): beskriver sin software factory som `AGENTS.md` og fem skills og argumenterer for at kunne skifte harness og model. Undersøg den faktiske metode, dens forudsætninger og hvilke kontrolmekanismer der ligger uden for instruktionerne.
2. [Gergely Orosz](https://x.com/GergelyOrosz/status/2099945497377091902): peger på OpenAI’s interne agentbaserede udviklingsarbejde, herunder Perf Factory. Postens link går til [The Pragmatic Engineer: OpenAI software factory](https://newsletter.pragmaticengineer.com/p/openai-software-factory). Skeln mellem erfaringer fra en stor intern organisation og en realistisk kundeleverance.
3. [Matt Pocock](https://x.com/mattpocockuk/status/2049506712801935611): introducerer det open-source projekt Sandcastle. Find den kanoniske kode og dokumentation; kontrollér licens, runtime, isolation, stop og vedligehold før eventuel genbrug.

Posttekster og Gergely-linkets destination er læst 21. september 2026. Videoernes indhold, hele artiklen og Sandcastles implementation er endnu ikke gennemgået. Referencerne er research-input, ikke dokumentation for Arc’ITs aktuelle leveranceevne eller godkendelse til at kopiere kode.

## Spørgsmål, der skal besvares

- Hvad kan leveres med en eksisterende harness, `AGENTS.md`, få specialist-skills og almindelig CI? Hvad kræver faktisk et separat runtime-system?
- Hvordan bindes opgave, tests, review og rettelser til en konkret ændring? Hvem godkender release?
- Hvilke rettigheder, datagrænser, budgetter og stopmuligheder skal håndhæves uden for prompten?
- Hvordan kan et særskilt sikkerhedsreview passe ind uden konkurrerende skriveagenter eller falske “all clear”-resultater?
- Hvilke dele er reelt flytbare mellem Codex, Cursor og andre værktøjer, og hvad kræver tilpasning?
- Giver et valgfrit read-only overblik kunden konkret værdi, eller er GitHub og den valgte harness tilstrækkeligt?

## Leverance og lille validering

- [ ] Kort, kildebelagt sammenligning med verificerede begrænsninger og licenser.
- [ ] En enkel anbefalet metode med dokumenterede input, ansvar, beviser, stop og recovery.
- [ ] Forslag til ét overvåget pilotforløb på et godkendt repository: afgrænset opgave → ændring → tests → review → menneskelig beslutning. Med én relevant fejl-/stopcase.
- [ ] Mål menneskelig reviewtid, genarbejde og samlet forbrug pr. accepteret ændring; ingen udokumenteret autonomi- eller ROI-påstand.
- [ ] Beslut separat, om det eksisterende dashboardudkast bør blive en valgfri open-source template. Afklar først behov, datakilder, adgangskontrol, licens, vedligehold og egnet eksempeldata. Ingen nyt repository eller offentliggørelse i denne researchopgave.

## Positionering

Arc’IT sælger faglig vurdering og praktisk gennemførelse: gennemgå noget kunden allerede har bygget, rette relevante svagheder og sætte arbejdet op, så det kan videreudvikles med klare tests, adgangsgrænser og ansvar. Software/Defense Factory kan beskrive metoden internt; de behøver ikke være produktnavne på forsiden. Der gives ingen garanti for fejlfri eller fuldstændig sikker software, og en kundes egne instruktioner er ikke i sig selv en sikkerhedsgrænse.
