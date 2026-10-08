# Arc’IT AI · Landingpage 03.4

24. september 2026. Samme visuelle retning, roligere og mere kundeorienteret copy.

- [Åbn hele landingpagen på localhost](http://127.0.0.1:4175/).
- [Engelsk copy](../../content/practical-delivery-r3-2026-09-21/website-copy.md).
- [Designretning](DESIGN.md).

Siden handler om at tage en lovende demo, MVP eller eksisterende løsning videre til reel brug og tage sig af det aftalte arbejde bagefter. De tre indgange er **AI consultation**, **Code and security review** og **Agent factory setup**. Den seneste præcisering gør opsætning til en tydelig hovedydelse: Agent Software Factory til udvikling, test og review samt Agent Defense Factory til vurdering af sikkerhedsfund efter release.

Navigationen **Offers · Process · Scope · Start**, landskabet, Geist-skrifterne, det sort/hvide Cut Six-logo og de små abstrakte animationer er bevaret. Kun ydelse 3 er ændret siden R3.3: **Done-for-you setup / Agent factory setup / Discuss a setup** og en kort forklaring af de to factories. Ingen ny sektion, runtime-forklaring eller dashboard-produktpitch. Det gamle eksempel-link forbliver fjernet; konceptfilerne er ikke slettet.

## Vis den lokale side

Serveren viser kun `web/` på loopback, ikke hele repositoryet. Hvis den er stoppet:

```bash
node /Users/gustavanderson/.codex/plugins/cache/online-sourdough/aios/0.13.0/skills/design/scripts/serve.mjs \
  --design-dir /Users/gustavanderson/Downloads/arcitai/design/practical-delivery-r3-2026-09-21/web \
  --port 4175
```

Videoen er stadig mærket **Film to be recorded**. Formularen sender og gemmer intet og har ingen tilknyttet API. Previewen ændrer ikke `src/`, `worker/`, dependencies eller live-siden. En rigtig publicering og formularintegration er ikke del af denne iteration.

## Gemte revisioner

Den aktuelle web-preview er R3.4. [OpenPencil-filen](openpencil/arcitai-r3.2.op) er fortsat den tidligere R3.2-version, ikke en automatisk synkroniseret kopi. Dens [åbningsvejledning og kontrol](history/README-3.2.md) er bevaret. Browseradressen til editoren er kun gyldig, når dens egen server kører. R3.3-copy, HTML, DESIGN og README er bevaret i `history/r3.3/`.

R3.2-copy, designbeskrivelse og README ligger i `history/`. De tre tidligere web-kildefiler ligger i `history/web-3.2/`; deres uændrede assets findes fortsat i `web/assets/`. Tidligere native reviews og canvasbilleder gælder deres navngivne revisioner, ikke automatisk denne opdatering.

## Kilder og kontrol

Factory-kontrakt og kvalifikationsstatus er læst som internt grundlag, sammen med de relevante tasks og Gustavs tone-of-voice. Kildelinks og grænsen mellem metode og dokumenteret drift står i copyfilens interne noter. Ingen kundedata eller private hændelser er kopieret til siden.

### Tidligere kontrol · R3.3

**R3.4-kontrol:** Kun tredje ydelses label, titel, brødtekst og CTA samt previewens versionsmærke er ændret i HTML. Copyen er læst for kundeværdi, tydeligt DFY-ansvar og fravær af løfter om automatisk overvågning. Browserkontrol ved 1440, 390 og 320 px viser ingen vandret overflow; “Discuss a setup” går til formularen. Desktop-/mobilvisningen er visuelt kontrolleret i `output/playwright/arcit-r34-scope-desktop.png` og `arcit-r34-offer-mobile.png`. HTML SHA-256: `fe1295be967f8632b8acec440569f75bf7afaad2dbe6a837f9979bffa836f088`. Copy SHA-256: `056916f0ef0d91e7de0a1daef462444b6d214de353f046382f4a68c5ef0f2edc`. Lokal kontrol består; øvrig uændret adfærd bruger R3.3-kontrollen nedenfor. Ingen publicering.

Nedenstående kontrol og hashes gælder den bevarede R3.3-version. De ændrede R3.4-tekster kræver deres egen kontrol; uændret adfærd bevarer den tidligere evidens.

Codex, 24. september: **PASS for R3.3’s lokale copy-/preview-iteration**, ikke en produktionsrelease eller ejeraccept. Sammenholdt med den bevarede R3.2-komposition og den daværende instruktion om at bruge factoryen som baggrundsviden. Ingen factory-, runtime-, AIOS- eller triageforklaring i R3.3’s synlige landingcopy. Tre ydelser og fire FAQs; intet nyt produkt-/dashboardafsnit.

Kontrolleret i browser ved 1440 × 1000, 390 × 844 og 320 × 844 uden vandret overflow. Geist-skrifter og billeder indlæses lokalt. Offers-menu med tastatur/Escape, lyst/mørkt tema, sort/hvidt logo, sektionslinks og reduced motion er afprøvet. Formularen sender ingen requests ved Enter eller klik efter afsluttet asset-indlæsning. Den første netværksprøve talte også statiske assets med; en afgrænset gentagelse viste nul formularrequests. Ingen konsolfejl. Skærmbilleder er gemt under `output/playwright/arcit-r33-*.png` fra repository-roden.

Formatering af ændrede filer og alle 38 eksisterende tests består. Ingen dependency-installation, produktionsbuild, publicering eller Worker-ændring i denne iteration. De tidligere bredere repository-begrænsninger, herunder formatering uden for denne ændring og dependency-advisories, er bevaret i `history/README-3.2.md`; de er ikke en del af denne preview-rettelse.

Kontrollerede SHA-256:

- `DESIGN.md`: `5a4fc8a2fc1eaca4fea23b2b24b84f6e3026599995874d29221d9faf5a6284b1`
- `website-copy.md`: `ab6dfdf9e2542153120db7333e6ca27d5ec95ff77638334da4a06d99cf127209`
- `web/index.html`: `551ab95c82574e420dcba75f6bf8fe060adc4e60d248c54e25c000b883e6e546`
- `web/style.css`: `12a20e33a29c2d82b20ceb64704379985169bdd71b1aedba2e32f4b250a9edc7`
- Uændret `web/preview.js`: `5d5b6c1e7a49c623e2588e65a329528758a32aa68d05f5c561ed262672a6f823`

Den tidligere OpenPencil-fil er bevaret byte-for-byte: `8c4c518bacb764b03a9ad2f3116ee8541f5d1d889750782fd08465bc26669c06`.
