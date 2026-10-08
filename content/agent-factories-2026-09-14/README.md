# Arc’IT AI: én ydelse, to agentfabrikker

14. september 2026. Produkt- og implementeringsudkast, ikke en installeret eller driftsvalideret løsning. [Leverandørresearch](research.md), [Software Factory](software-factory/README.md), [Defense Factory](defense-factory/README.md) og [dashboardudkast](../../design/agent-factories-r1-2026-09-14/index.html).

## Anbefalingen

Sælg **AI Agent Factories** som en implementeringsydelse med to sammenhængende systemer:

- **Software Factory:** omsætter aftalt arbejde til afgrænsede ændringer, tests og PR’er, der kan vurderes.
- **Defense Factory:** undersøger sikkerhedsrisici i systemet og ændringerne, validerer fund og efterprøver rettelser.

To vedligeholdte systempakker giver mening, fordi de har forskellige opgaver, adgangsbehov og beviskrav. Det betyder ikke, at kunden behøver to komplette orkestreringsplatforme. På Warp kan de være specialister i samme factory for samme produkt. To agenter må ikke eje den samme kodeændring samtidig.

Arc’IT tager ansvar for opsætning, implementering og den aftalte drift. Kunden bidrager med forretningsviden, datatilladelser og de beslutninger, som skal ligge hos kunden. Det er stadig Done For You. En enkelt konsultation og Prototype to Production er de andre indgange til at arbejde sammen.

## Det kunden får

1. Et afgrænset arbejdsflow for ét produkt eller en sammenhængende gruppe repositories. Vi aftaler, hvad der må komme ind, og hvad et godt resultat er.
2. Konfigurerede agents, arbejdsmiljøer, adgangsgrænser og review-/releasekrav. Valgte værktøjer dokumenteres; software og prompts er versionsstyret.
3. Et Build-overblik med opgaver, status, PR, bevismateriale, forbrug og det, der afventer en person.
4. Et adgangsbeskyttet Security-overblik med fund, omfang, validering, rettelse og resterende usikkerhed.
5. En driftsvejledning med ejerskab, omkostningsgrænser, stop, recovery og vedligeholdelse. Ét observeret forløb og relevante fejlsituationer skal demonstreres før kundeleverance.

**Engelsk tilbudstekst:**

> I set up an AI Software Factory and a connected Defense Factory around your code and delivery process. Agents work through agreed tasks, prepare changes and run checks. You can follow the work in a shared overview, see the evidence, and make the decisions that need a person. I take care of the setup and the ongoing operation we agree on.

Ingen lovning om en autonom udviklingsafdeling, fejlfri software, certificering, ubegrænset kapacitet eller 24/7-beredskab. Et sikkerhedsreview af kode er heller ikke en fuld vurdering af agentens adgang, dataflow og faktiske drift.

## Hvad vi bør bygge selv

Ejerskab over **arbejdsregler, konfiguration, acceptkriterier og den kundevendte visning**. Brug kundens GitHub som sandhed for kode, issues og PR’er; brug den valgte agentmotor som sandhed for kørsler og forbrug. Eksportér relevante bevisreferencer og den lille mængde driftsstatus, der kræves for at forstå et forløb.

Byg ikke først en erstatning for hele Warp eller Cursor. Udnyt din eksisterende adgang til et afgrænset pilotforløb, hvis vilkår og datagrænser passer. Bevar en direkte CLI/CI-vej, hvor native Codex eller en anden godkendt harness kører på et isoleret miljø. Den vej fjerner Warp som platformafhængighed, men ikke udgifter til modeller, compute og vedligeholdelse.

**Mulige adresser:** `build.<customer-domain>` og `security.<customer-domain>`. Forslag, ikke oprettede domæner. Samme dashboardkode kan levere to visninger, men adgang skal kontrolleres på serveren for kunde, repository og fund. Et skjult menupunkt eller en anden URL er ikke adgangskontrol.

## Økonomi og lille validering

Prislogik: afgrænset implementeringshonorar + aftalt løbende drift + tydeligt adskilt leverandørforbrug. Ingen salgspris er valgt; der er endnu ikke målt leveringstid, reviewbelastning eller dækningsbidrag.

Foreslået første validering: ét godkendt, ikke-følsomt repository, én lille ændring, én syntetisk fejlcase og én navngiven releasebeslutning. Start overvåget med én aktiv skriveagent. Kunden/du godkender budget og kørselsvindue før start. Mål samlet udgift pr. accepteret ændring, menneskelig reviewtid, rework og evnen til at stoppe/genoptage. Et automatisk “done” er ikke accept.

Stop, hvis agenten kræver bredere adgang, gentager samme fejlslagne rettelse, overskrider det aftalte budget eller mangler afgørende testmiljø. Udvid først, når det konkrete arbejdsflow sparer mere arbejde, end det påfører den ansvarlige.

**Status:** behovet for produktafklaring er konkretiseret; markedsbevis og driftsbevis mangler. Første væsentlige valg er pilotens drifts-/datagrænse, ikke en større platformarkitektur. Remote repositories og installation afventer valg af destination; de lokale mapper er source-kandidater, ikke nye aktive systemer.

## System Template og vedligeholdelse

Vi har brugt den navngivne [Agentic System Template](https://github.com/onlinesourdough/Agentic-System-Template/tree/15e1fd9081cf11e7fe26fcc9b508976f3b0c75e2), revision `15e1fd9081cf11e7fe26fcc9b508976f3b0c75e2`, som valgfri strukturvejledning. README, AGENTS og den primære System-metode er læst. De to mapper har egen identitet, domænemetode, kontrakt og recoverykrav. Ingen templatemotor, central registry eller automatisk templateopdatering er indført.

Pakkerne er lokalt forfattede, uinstallerede `0.1.0`-kontraktudkast. Deres specialistmetoder starter på `1.0.0` som anført i templatevejledningen; dette er instruktionernes version, ikke bevis for produktmodenhed. Native discovery og reelle agentkørsler er ikke testet. De kopierer ikke AIOS’ generiske Spec/Build/Review/Ship-metoder.

Fortsættelsen er at vælge private GitHub-repositories i `arcitai` eller beholde disse lokale udkast, vælge pilot og gennemføre den faktiske installation med de tests, som hver pakke beskriver. GitHub-oprettelse, Notion-skrivning, modelkørsler, secrets, DNS og deployment er ikke foretaget her.
