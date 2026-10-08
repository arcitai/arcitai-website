# Arc’IT AI · Landingpage 03.5

24. september 2026. Skarpere engelsk copy og fungerende animationer i den eksisterende lokale web-preview.

- [Åbn hele landingpagen](http://127.0.0.1:4175/?v=3.5).
- [Engelsk copy](../../content/practical-delivery-r3-2026-09-21/website-copy.md).
- [Designretning](DESIGN.md).

## Denne iteration

Samme grønne landskab, almindelige navigation og sort/hvide Cut Six-logo. Ydelserne har nu en kort værdiforklaring og konkrete punkter: **One-off AI consultation**, **Software review & delivery** og **AI agent factory setup**. Opsætningsydelsen nævner Agent Software Factory og Agent Defense Factory med afgrænset ansvar og menneskelige godkendelser.

Logoets eksisterende seks dele bevæger sig. Tre nye abstrakte SVG-animationer viser fokus, gennemgang og et gentageligt flow. Under ydelserne viser et interaktivt **Plan → Code → Review → Test → Deploy**-eksempel sammenhængen mellem trinene. **Disconnected / Connected** ændrer køerne og de illustrative loading bars. Det er en forklaring, ikke live-data eller dokumenterede performance-tal.

**Pause motion** gælder alle animationer. Reduced motion, pause uden for viewport og sidens visibility-handler er indbygget. Mobil har læsbare trin i en liste i stedet for meget små labels.

## Vis den lokale side

Serveren viser kun `web/` på loopback, ikke hele repositoryet:

```bash
node /Users/gustavanderson/.codex/plugins/cache/online-sourdough/aios/0.13.0/skills/design/scripts/serve.mjs \
  --design-dir /Users/gustavanderson/Downloads/arcitai/design/practical-delivery-r3-2026-09-21/web \
  --port 4175
```

Videoen er fortsat mærket **Film to be recorded**. Formularen sender og gemmer intet og er ikke koblet til en API. `src/`, `worker/`, dependencies og live-siden er uændrede. Der er ingen offentlig publicering i denne iteration.

## Kilder og historik

Agentic Engineer er genbesøgt i browseren; den valgte onlinesourdough-version fra den linkede task er genfundet og inspiceret read-only. Principperne er tilpasset Arc’IT med original CSS/SVG/JavaScript. Præcise kilde- og proofhenvisninger står i DESIGN og copyfilen.

R3.4 er bevaret i `history/r3.4/`: DESIGN, README, website-copy og de tre tidligere web-kildefiler. Assets er uændrede og ikke duplikeret. R3.3 og R3.2 samt deres reviews ligger fortsat i historikken.

[OpenPencil-filen](openpencil/arcitai-r3.2.op) forbliver R3.2. Den er ikke arbejdsfladen for R3.5. Brug den lokale web-preview til copy og faktisk animation.

## Kontrol

Aktuel R3.5 browser- og designkontrol registreres i `REVIEW-3.5.md`. Ingen gennemført produktionsrelease eller ejeraccept er påstået. De tidligere begrænsninger i repositoryets brede release-checks er bevaret i `history/README-3.2.md`.

Animationens selvstændige checks:

```bash
node --test design/practical-delivery-r3-2026-09-21/check-motion.mjs
```
