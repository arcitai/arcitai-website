# Arc’IT AI · Landingpage 03.7

> 24 September, later continuation: the current candidate has moved into the
> repository's React production source. See [release status](../../docs/release-2026-09-24.md)
> and [built localhost candidate](http://127.0.0.1:4176/?scene=day&theme=light).
> The text below records the older preview; it does not describe the final
> reversible scroll interaction, Resources-style media frame or release status.

24. september 2026. [Åbn localhost](http://127.0.0.1:4175/?v=3.7#scope).

To kompakte tilbud øverst, ét stort factory-tilbud nedenunder. De første to animationer er bevaret. Factory-sektionen viderefører den overdragne pipeline fra onlinesourdough: **Scope & access → Code & tests → Review & defence → Approval & handoff**. Alle fire flaskehalse åbner i rækkefølge ved scroll eller musebevægelse. Bjælkerne fyldes én gang og bliver fulde; pipelinen lukker ikke ved pointer-exit. De firkantede partikler starter samlet til venstre. Lukkede trin er rød-orange, åbning er orange, og fulde trin bruger samme grønne som de to øvrige tilbud.

Factory-copyen dækker software, defence, lokal AI og dataadgang/retention. De store mintpaneler er fjernet; mørkt tema er neutralt med natteillustrationen og afstemte formularfarver.

- [Engelsk copy](../../content/practical-delivery-r3-2026-09-21/website-copy.md).
- [Designretning](DESIGN.md).
- [Kontrol af denne landingpage-version](REVIEW-3.7.md).
- [Hero-videoer: forberedelse og udestående browseradgang](HERO-MOTION.md).

## Lokal visning

```bash
node /Users/gustavanderson/.codex/plugins/cache/online-sourdough/aios/0.13.0/skills/design/scripts/serve.mjs --design-dir /Users/gustavanderson/Downloads/arcitai/design/practical-delivery-r3-2026-09-21/web --port 4175
```

Kun `web/` udstilles på loopback. Videoen med Gustav er ikke optaget, og formularen sender/gemmer intet. Production source, Worker, dependencies og live-side er uændrede.

## Bevarede kilder

R3.4, R3.5 og R3.6 er gemt i deres `history/`-mapper; fælles assets er ikke duplikeret. [Handoff-kilden](references/method-flow-handoff/README.md) og dens React/CSS er bevaret. [OpenPencil R3.2](openpencil/arcitai-r3.2.op) er fortsat historisk; den er ikke opdateret i denne browser-iteration.

## Checks

```bash
node --test design/practical-delivery-r3-2026-09-21/check-motion.mjs
npm test
```

De otte afgrænsede motion-checks og de 38 eksisterende tests består. Det er ikke en produktionsrelease. Tidligere brede release-begrænsninger er dokumenteret i `history/README-3.2.md`.

Hero-videoer er endnu ikke integreret. En lokal worker blev startet med GPT-6 Luna/max, men dens browseradgang blev afvist. Den er afsluttet uden generering eller kreditforbrug. Gustavs separate animationsopgave har nu Flow-adgang og producerer/reviderer klippene; afviste takes bruges ikke. Se `HERO-MOTION.md`. Denne opgave beholder integrationen af de færdige klip.
