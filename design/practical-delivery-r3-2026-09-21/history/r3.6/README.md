# Arc’IT AI · Landingpage 03.6

24. september 2026. [Åbn localhost](http://127.0.0.1:4175/?v=3.6#scope).

To kompakte tilbud øverst, ét stort factory-tilbud nedenunder. De første to animationer er bevaret. Factory-sektionen bruger den overdragne **Spec → Build → Review → Ship**-animation fra onlinesourdough, tilpasset med langsommere bevægelse og begge temaer.

Factory-copyen dækker software, defence, lokal AI og dataadgang/retention. De store mintpaneler er fjernet; mørkt tema er neutralt med natteillustrationen og afstemte formularfarver.

- [Engelsk copy](../../content/practical-delivery-r3-2026-09-21/website-copy.md).
- [Designretning](DESIGN.md).
- [Kontrol af denne landingpage-version](REVIEW-3.6.md).
- [Hero-videoer: forberedelse og udestående browseradgang](HERO-MOTION.md).

## Lokal visning

```bash
node /Users/gustavanderson/.codex/plugins/cache/online-sourdough/aios/0.13.0/skills/design/scripts/serve.mjs --design-dir /Users/gustavanderson/Downloads/arcitai/design/practical-delivery-r3-2026-09-21/web --port 4175
```

Kun `web/` udstilles på loopback. Videoen med Gustav er ikke optaget, og formularen sender/gemmer intet. Production source, Worker, dependencies og live-side er uændrede.

## Bevarede kilder

R3.4 og R3.5 er gemt i deres `history/`-mapper; fælles assets er ikke duplikeret. [Handoff-kilden](references/method-flow-handoff/README.md) og dens React/CSS er bevaret. [OpenPencil R3.2](openpencil/arcitai-r3.2.op) er fortsat historisk; den er ikke opdateret i denne browser-iteration.

## Checks

```bash
node --test design/practical-delivery-r3-2026-09-21/check-motion.mjs
npm test
```

De fem afgrænsede motion-checks og de 38 eksisterende tests består. Det er ikke en produktionsrelease. Tidligere brede release-begrænsninger er dokumenteret i `history/README-3.2.md`.

Hero-videoer er endnu ikke genereret. En lokal worker blev startet med GPT-6 Luna/max, men dens browseradgang blev afvist. Workeren er afsluttet uden generering eller kreditforbrug. Gustavs separate animationsopgave har overtaget brief og videre browserkoordinering; se `HERO-MOTION.md`. Denne opgave beholder integrationen af de færdige klip.
