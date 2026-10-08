# Arc’IT AI: retning med Secure Agents

Udkast, 14. september 2026. Til Gustav. Hjemmesiden, de operative designdokumenter og Notion er ikke ændret. VSL-arbejdet er sat til side, mens vi afklarer denne retning.

## Min anbefaling

Arc’IT AI skal være dit **done-for-you-tilbud til virksomheder, der vil bruge AI i det daglige arbejde og have nogen til at tage ansvar for opsætningen og den fortsatte drift**. Secure Agents er det tydelige speciale inden for det tilbud.

Du begynder med arbejdet og forretningsværdien. Derefter tager du dig af de nødvendige værktøjer, agenter, forbindelser, adgangsrettigheder og vedligehold. Softwareudvikling og sikkerhedsarbejde er fagligheder i leverancen. Kunden køber et brugbart resultat og et klart ansvar.

Den anbefalede åbning er:

> **Put AI to work. Keep control.**
>
> I help you take time-consuming work off your team’s plate. I set up and maintain the AI tools, agents and workflows behind it, with clear limits on what they can access and do.

Det er en mere konkret førstegangsforståelse end “Become AI-first”. Den sidste formulering kan stadig bruges i din forklaring af metoden. “Secure Agents” står synligt over overskriften, så den rolige, brede indgang ikke skjuler dit speciale.

Dette er en anbefalet positionering og en servicehypotese. Der er ikke dokumentation her for efterspørgsel, kundecases, en fungerende Defense Factory eller en bestemt leverancekapacitet.

## Samspillet med onlinesourdough

Det fælles udgangspunkt er en værdifuld ændring i virksomheden. Forskellen er, hvem der gør arbejdet og bærer leveranceansvaret.

| Tilbud                                | Kunden vil                                              | Ansvar                                                                                        |
| ------------------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Resources / onlinesourdough, DIY      | Forstå agenter og bygge en brugbar arbejdsform selv     | Kunden anvender materialet og ejer resultatet                                                 |
| The Fermentary / onlinesourdough, DWY | Arbejde selv med dig tæt på de svære beslutninger       | Kunden er den primære udførende; du hjælper med beslutninger og review                        |
| Arc’IT AI, DFY                        | Have den aftalte del af arbejdet taget af sin tallerken | Du tager ansvar for afklaring, opsætning, implementering, test og den aftalte fortsatte drift |

Grundlæggende sikker brug hører også hjemme i DIY og DWY: forstå agentens adgang, hold uvedkommende data ude, brug passende godkendelser, og vid, hvordan arbejdet stoppes. Arc’IT tilføjer virksomhedsspecifik implementering, teknisk håndhævelse, test og et ansvar for at holde den aftalte løsning i orden. Undgå at fremstille DIY som usikkert og DFY som risikofrit.

AIOS kan støtte arbejdet i kundens eksisterende AI-harness. Kunden behøver ikke et særskilt OS-produkt eller at adoptere AIOS for at købe Arc’IT. OSM/OS App er et afsluttet eksperiment ifølge din afklaring 14. september; formuleringerne i LaterWork skal læses med den korrektion.

Det nuværende Offers-dokument har en bredere business-first-beskrivelse af Complete Bake. Mit forslag er at bevare den som fælles tankegang og gøre Arc’ITs offentlige indgang mere specifik. Det er ikke en beslutning om at fjerne alle andre former for forretnings- eller softwarearbejde.

## Hvem siden skal tale til

Den primære læser er en leder med ansvar for en funktion eller en virksomhed, ofte i en mellemstor eller større organisation. De vil bruge AI til noget reelt, men mangler tid eller faglighed til at samle forretningsbehov, integrationer, data, godkendelser og vedligehold.

Gode udgangspunkter kan være:

- En virksomhed vil forbinde agenter med interne dokumenter, kundedata eller fagsystemer.
- Et team har flere spredte AI-værktøjer og mangler en fælles arbejdsform og tydeligt ejerskab.
- En agent eller integration er allerede bygget, men ingen har taget ansvar for adgangen, fejlene og de næste ændringer.

Det er foreslåede købssituationer, ikke observerede kundeudsagn. Risiko og ansvar er vigtigere udvælgelseskriterier end medarbejdertal. En solo founder med følsomme data eller omfattende rettigheder kan også have et relevant behov.

Hold “enterprise-grade” ude af copyen. Det kan antyde dokumenterede servicekrav, certificeringer, organisation og supportkapacitet, som kilderne ikke etablerer.

## Hvad Secure Agents betyder i praksis

En agent kan bruge værktøjer til at læse data eller udføre handlinger. Derfor skal sikkerhed vurderes i hele opsætningen omkring modellen. Et godt instruktionsdokument eller en skill er vejledning, ikke i sig selv en adgangsgrænse.

| Område         | Et konkret spørgsmål                                                               | Mulig leverance, afhængigt af den valgte platform                                                |
| -------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Arbejdet       | Hvad skal blive bedre, og hvad bør vi slet ikke automatisere?                      | Én prioriteret arbejdsgang, succeskriterier og en målt baseline                                  |
| Data og adgang | Hvilke data og værktøjer kræver opgaven?                                           | Afgrænsede konti/rettigheder, adskillelse af kunder og miljøer, sikker håndtering af credentials |
| Handlinger     | Hvad kan agenten gøre, og hvad kræver en person?                                   | Godkendelse før konsekvensfulde handlinger og rettigheder, der håndhæves uden for prompten       |
| Test           | Hvad sker der med forkerte input, uvedkommende instruktioner eller manglende data? | Relevante testscenarier, dokumenterede fund, rettelser og retest                                 |
| Drift          | Hvem reagerer på ændringer og fejl?                                                | Aftalt vedligehold, adgangsreview, synlige fejl, stop og genopretning                            |

På udvalgte platforme kan de nødvendige begrænsninger mangle. Så må du begrænse opgaven, beholde mere menneskelig kontrol eller anbefale en anden opsætning. Fortrolighed, datalagring, leverandørvilkår og relevante juridiske krav afklares for det konkrete engagement; de kan ikke løses med en generel sikkerhedstekst.

### Et forklarende eksempel

En agent hjælper med at forberede tilbud. Den får adgang til en godkendt prisliste og det valgte kundebrief og laver et udkast. Opsætningen giver den ikke ret til at sende til kunden eller ændre priser. Mangler et nødvendigt prisgrundlag, sendes arbejdet til menneskelig afklaring. En person godkender og sender.

Testen handler både om et korrekt tilbud og om grænserne: Kan uvedkommende tekst i briefet få agenten til at hente andre kunders data? Kan den forsøge at sende noget uden godkendelse? Bliver manglende grundlag synligt?

Det er et illustrativt design, ikke en kundecase eller dokumentation for et allerede testet system.

## IBM: kompromiserne og forskellen på personligt og fælles arbejde

IBM-videoens verificerede titel og beskrivelse handler om **intelligens/kapabilitet, hastighed og sikkerhed**. Brug det som en arkitekturlinse: mere kontrol kan koste tid og begrænse handlemuligheder, mens mere adgang og autonomi kan give større konsekvenser ved fejl. Det er ikke dokumentation for en matematisk regel om, at man altid kun kan vælge præcis to, eller at god arkitektur aldrig kan forbedre alle tre.

En personlig agent er heller ikke undtaget. Hvis den kan læse private data, møde ukendt indhold og sende information ud, er der en relevant risiko, selv om kun én person bruger den. Simon Willisons “lethal trifecta” beskriver netop den kombination. Det er en anden model end IBM’s trilemma.

I et fælles eller produktionsnært setup får fejl typisk flere berørte mennesker, flere forbindelser og større driftskonsekvenser. Derfor bliver håndhævede grænser, systematisk test, adgangsstyring og aftalt drift vigtigere. Arc’ITs værdi er din faglige vurdering og implementering af en passende balance til den konkrete opgave.

Jeg ville forklare det sådan i en samtale:

> Once an agent can act on company data, the setup around it matters as much as the model. I help you decide what it should do, put the right limits in place, and take care of the agreed setup as it changes.

Kildegrænse: YouTube-sidens titel og beskrivelse blev læst, men den fulde tale/transcript kunne ikke hentes. De tekniske detaljer ovenfor støttes derfor af de skriftlige kilder, ikke af et påstået gennemsyn af hele videoen.

## Agent Defense Factory: en metode bag leverancen

Jeg ville foreløbig bruge navnet internt. Det beskriver en gentagelig måde at undersøge og forbedre de aftalte systemer på:

**Afgræns og få mandat → undersøg → vurder fund → ret under kontrol → retest → følg relevante ændringer.**

Hver kunde kræver sit eget godkendte scope, passende adskilt miljø, adgang og bevismateriale. En model kan hjælpe med fund og rettelser, men en scan er ikke et sikkerhedscertifikat. Automatisk fund, ændring og deployment bør ikke være én uovervåget kæde. Følsomme eller kritiske ændringer kræver passende menneskelig godkendelse og ved behov en uafhængig specialist til retest.

Codex Securitys eksisterende workbench/plugin kan understøtte afgrænset kodereview og arbejdet med fund og rettelser. Det erstatter ikke vurdering af hele agentsystemets rettigheder, driftsmiljø, leverandører og arbejdsgange. Ingen ny scanner, platform eller dashboard er nødvendig for at undersøge denne leverancemodel.

Trail of Bits er en nyttig reference for fagligheden og forløbet fra fund til rettelse. Deres team, cases, partnerskaber og dokumenterede resultater er deres, ikke Arc’ITs. Det særligt brugbare princip er at måle verificerede rettelser og resterende huller frem for antal fund.

OpenAI’s aktuelle Daybreak-vejledning gør adgang afhængig af godkendt identitet, organisation og anvendelse. Enterprise-adgang er som udgangspunkt til internt autoriseret arbejde; brug til tredjepartskunder kræver passende udtrykkelig godkendelse. Din rapporterede adgang er derfor ikke tilstrækkeligt grundlag for at love Daybreak-leverancer eller vise et partnerbadge. Det begrænser den leverandørspecifikke mulighed, ikke hele din foreslåede rådgivningsydelse.

## Den første leverance og en lille validering

Jeg ville starte med **én aftalt AI-arbejdsgang eller eksisterende opsætning**. Det kan være en afgrænset opgave eller begyndelsen på et løbende samarbejde. Kunden skal ikke vælge mellem en hel menu af sikkerhedsprodukter.

Det foreslåede indhold er:

- Afklar resultat, eksisterende arbejde, data og nødvendige rettigheder.
- Konfigurér eller byg det, der mangler, med passende grænser og godkendelser.
- Test nytte og de vigtigste fejl-/misbrugsscenarier; ret og test igen.
- Sæt resultatet i brug og beskriv, hvem der driver det, hvordan det stoppes, og hvordan det genoprettes.
- Tag den nødvendige fortsatte vedligehold med i aftalen fra starten, når det er en del af kundens behov.

Kunden bidrager med en beslutningsejer, nødvendige og godkendte adgange, domæneviden og accept af konsekvensfulde valg. Du koordinerer den aftalte leverance. Handover er muligt, men skal ikke være det dominerende slutpunkt i salgsfortællingen.

Kommercielt bør opstart afhænge af scope, data, integrationsarbejde, test og behov for specialistbistand. Fortsat betaling skal afspejle de navngivne systemer, vedligehold, review og faktisk tilgængelighed. Leverandør-/modeludgifter og eventuelle eksterne specialister skal indgå i økonomien. Kilderne giver ikke grundlag for en pris, bestemt kadence, svartid eller antal samtidige kunder.

**Vigtigste ubekendte før et bredt driftsløfte:** Hvor meget løbende ansvar kan du levere pålideligt og rentabelt som solooperatør?

Forslag til én lille validering: Kør en intern pilot på én ejet eller udtrykkeligt godkendt arbejdsgang med syntetiske data og én simuleret ændring af adgang eller værktøj. Brug dit eksisterende harness og workbench, hvor de passer. Som et startforslag kan du afsætte højst to fokuserede arbejdsdage til dette første forsøg; tidsrammen er en foreslået grænse, ikke kendt ledig kapacitet.

Registrér udgangspunkt og resultat: tid brugt på opgaven og menneskelig review, testede grænser, bekræftede problemer, verificerede rettelser, om stoppet virker, og tiden til at håndtere ændringen. Fortsæt mod et afgrænset kundeengagement, hvis både opgaven og kontrollen fungerer, og den målte indsats kan prissættes forsvarligt. Begræns autonomi/scope eller stop forsøget, hvis du ikke kan håndhæve en nødvendig grænse, styre omkostningen eller opdage og håndtere den simulerede fejl. Piloten beviser leverancemulighed, ikke markedsefterspørgsel eller generel sikkerhed.

Tilbudsstatus: **needs-one-material-decision** før et fast, bredt driftsprodukt: den bæredygtige driftsforpligtelse skal vælges på baggrund af piloten. Copyudkastet kan godt vurderes nu; det opfinder ingen serviceplan eller svartid.

## Hvad jeg ændrer i hjemmesideudkastet

Den læste side på [arcitai.com](https://arcitai.com) er centreret om “Better software…” og ender med “SHIP / HANDOVER”. Det gør softwarebyggeri til kategorien og skjuler den fortsatte ansvarsovertagelse.

Udkastet beholder landskabet, den varme papirfarve, Cut Six-mærket, Geist-familien og sidens overordnede forløb. Det ændrer indgangen og indholdet:

- “Secure Agents / Done for you” og et direkte løfte om nyttigt arbejde og kontrol.
- Førsteperson og tydelig ansvarsovertagelse, uden påstande om en større organisation bag dig.
- Et konkret agenteksempel i forklaringsområdet. Ingen falsk videoafspiller eller opfundet spilletid, mens VSL’en ikke findes.
- Fire sammenhængende leverancetrin: Understand, Set up, Test, Run.
- En henvendelse om arbejdsgangen og opsætningen, ikke kun et nyt softwareprojekt.
- Ingen ubekræftet kvartalsknaphed, kundelogoer, sikkerhedsgarantier eller partnerpåstande.

Jeg foreslår at spørge til virksomhed, den ønskede forbedring og relevante værktøjer. Månedlig omsætning er et svagere førstespørgsmål for denne indgang. En senere formularændring skal opdatere browser, Worker og Notion-kontrakten samlet; prototypen ændrer ingen af dem og sender intet.

En mulig senere lead magnet er en kort **Secure Agent Readiness Map**: opgave, data, værktøjer, tilladte handlinger, godkendelser, ejer, test og stop. Den kan give læseren én udfyldt arbejdsgang og et klart næste spørgsmål. Der er ikke lavet eller lovet en download nu. Den nævnte Defense Factory-PDF var ikke tilgængelig, så dette er et selvstændigt forslag, ikke en bearbejdning af den.

## Kilder og bevisgrænser

Læst eller inspiceret 14. september 2026, medmindre andet er angivet. Eksterne sider er baggrundskilder, ikke godkendelse af Arc’ITs kompetencer eller markedsføringspåstande.

| Kilde                                                                                                                                                                            | Anvendelse og grænse                                                                                                                                                                             |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [later-work.md](/Users/gustavanderson/Downloads/later-work.md)                                                                                                                   | Din ønskede retning, DFY-afgrænsning, tekniske referencer og pilotidé. Forslag, ikke publiceret tilbud.                                                                                          |
| [Offers](https://app.notion.com/p/3b56d2e17f5681e58716e35e9a5d1150)                                                                                                              | Ansvarsfordeling og business-first. Kildens seneste redigering er 3. september 2026.                                                                                                             |
| [Resources source of truth](https://app.notion.com/p/3b56d2e17f5681a3a800ed0a10c354ad) og [aktuel kursusafklaring](/Users/gustavanderson/.AIOS/context/content-and-resources.md) | DIY/DWY og din nyere afklaring 14. september om agentforståelse, AIOS og forebyggende sikker brug. Den nyere afklaring kvalificerer den ældre formulering om, at Resources ikke er et AI-kursus. |
| [Arc’IT live](https://arcitai.com), [design](../../docs/design.md), [arkitektur](../../docs/architecture.md)                                                                     | Aktuel software-/handover-vægtning, visuel identitet og selvstændig inquiry-grænse. Repo udgangspunkt: `74dc67adf0a97072e0afd8e92876e9bd18f693cd`.                                               |
| [IBM-video](https://www.youtube.com/watch?v=OvjccOrr-iw)                                                                                                                         | Verificeret titel “What Is the AI Security Trilemma? Smart, Fast, or Secure AI?” og beskrivelse. Fuld tale ikke verificeret.                                                                     |
| [IBM: AI security](https://www.ibm.com/think/topics/ai-security)                                                                                                                 | Skelnen mellem AI til sikkerhedsarbejde og sikkerhed omkring AI. Dette link er en artikel, ikke dokumentation for et gennemført kursus.                                                          |
| [IBM: AI agent security](https://www.ibm.com/think/topics/ai-agent-security)                                                                                                     | Risici ved værktøjer, adgang, data og utilsigtede handlinger; lagdelte kontroller.                                                                                                               |
| [MCP: Security Best Practices](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices)                                                                  | Tekniske integrationsgrænser, bl.a. OAuth-samtykke, token audience og forbud mod token passthrough. Kun relevante dele anvendt.                                                                  |
| [Trail of Bits: AI/ML](https://trailofbits.com/services/ai-ml/), [MCP](https://trailofbits.com/mcp/), [Patch the Planet](https://trailofbits.com/patch-the-planet/)              | Leverancereference: review, konkrete fund, remediation og retest. Ingen overførsel af deres proof eller brand.                                                                                   |
| [Simon Willison: The lethal trifecta](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/)                                                                                | Historisk arkitekturmodel, 16. juni 2025. Ikke IBM’s trilemma eller en nutidig test af alle modeller.                                                                                            |
| [OpenAI: Models and Trusted Access](https://learn.chatgpt.com/docs/cyber-safety)                                                                                                 | Aktuelle begrænsninger for Daybreak og tredjepartsydelser. Den offentlige Daybreak-landingsside gav 403; officiel dokumentation blev brugt i stedet.                                             |
| [OpenAI: Security workbench](https://learn.chatgpt.com/docs/security/plugin/workbench)                                                                                           | Eksisterende kodereview-/findingsværktøj, ikke bevis for en færdig Secure Agents-leverance. Ingen scan blev kørt.                                                                                |

Tre nævnte lokale filer kunne ikke findes ved de angivne stier eller den målrettede søgning: `ibm-ai-security-trilemma.md`, `defense-factory-playbook.pdf` og `edit/transcripts/intelligence-at-work-cyber.md`. Deres indhold er ikke rekonstrueret eller fremstillet som læst. Retningen kan vurderes på det tilgængelige grundlag; en præcis bearbejdning af de filer kræver selve materialet.

## Arbejdets kontrakt og fortsættelse

Leverancen her er denne anbefaling, engelsk sidecopy med alternative åbninger og en lokal visuel prototype. Samme opgave og eksisterende model er tilstrækkelig; der er fortsat redaktionel og arkitektonisk vurdering, og et model-/opgaveskift giver ingen påvist fordel. Ingen delegering er valgt.

Beviset er kildegennemgang, review mod din stemme og dine principper samt faktisk browserinspektion af prototypen. Det beviser et brugbart udkast, ikke markedseffekt eller et sikkert kundesystem. Din godkendelse af retningen, eventuel implementering/publicering og en eventuel pilot er separate næste beslutninger. Eksisterende runtimefiler, Notion, AIOS-truth, konti og adgange er bevaret.
