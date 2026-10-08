# Warp, Cursor og en portabel Arc’IT-leverance

Undersøgt 14. september 2026. Førstepartskilder er linket ved påstandene. Priser, adgang og produktgrænser kan ændre sig. Din oplyste Early Access-adgang er ikke kontrolleret på en autentificeret faktureringsside.

## Den korte konklusion

**Begynd med en afgrænset implementeringsservice. Lad værktøjsvalget være en del af leverancen.** Warp har meget af orkestreringen allerede, Cursor er et reelt alternativ, og direkte CLI/CI er vejen til at undgå en separat Warp-platformbinding. Ingen af de tre er gratis eller vedligeholdelsesfri.

| Mulighed                              | Hvad kunden selv kan drive                                                                     | Hvad stadig afhænger af leverandøren                                                              | Konsekvens for Arc’IT                                                                                  |
| ------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Warp Factories                        | Versionsstyrede factorydefinitioner; Enterprise kan køre managed workers på egen infrastruktur | Warp koordinerer kørsler, identitet, metadata og inference-routing; platformcredits gælder stadig | Hurtig pilot hvis adgang, data og omkostninger passer; sælg ikke som fritstående selvhostet Warp       |
| Cursor Cloud Agents                   | My Machines til personlige forløb; Enterprise Team Pools til administreret workerflåde         | Agentloop, planlægning og inference ligger fortsat i Cursor; outputs/kontekst forlader maskinen   | Relevant motor, men self-hosted compute er ikke cloud-uafhængighed                                     |
| Direkte Codex/anden godkendt CLI + CI | Kundevalgt orkestrering, workers, work queue, rapportering og dataopbevaring                   | Den valgte model/harness, Git-hosting og compute har egne vilkår og udgifter                      | Mest direkte kontrol; Arc’IT skal selv dokumentere og drive drift, isolation, retries og observability |

## Warp: hvad køber man?

[Factories overview](https://docs.warp.dev/factories/) beskriver requests → triage → eventuel spec → implementation → review, med en foreman og specialiserede agents. Definitioner kan ligge som kode; flere harnesses, herunder Codex og Claude Code, understøttes. Der er integrationer, Factory MCP, dashboard, scorers og forbedringsforslag. Mennesker godkender relevante specs og merger PR’er. Warp anbefaler factories pr. sammenhængende produktsurface, ikke to konkurrerende factories for forskellige trin i samme repository.

[Infrastructure and security](https://docs.warp.dev/factories/infrastructure-and-security/) skelner mellem koordinering og eksekvering:

- Selvhostede managed workers flytter checkout, kommandoer og sandboxfilesystem til kundens maskiner.
- Promptindhold, resultater, transcripts, artifacts og telemetry kan stadig gå gennem Warp og de konfigurerede modeludbydere.
- Factory-specifik dokumentation angiver Enterprise for managed self-hosting, kundeleveret inference og kundeejet storage. Generelle BYOK-sider er ikke tilstrækkeligt bevis for samme adgang i Factories.
- Kundeejet S3/GCS-storage flytter ikke alle metadata og al konfiguration ud af Warp.
- Unmanaged CLI-agenter kan tale med factory via MCP, men kan ikke overtage rollen som dens execution host.

[Platform credits](https://docs.warp.dev/support-and-community/plans-and-billing/platform-credits/) gælder alle cloud-/factorykørsler, også med egne workers og egen inference. Warp har særskilte AI-, compute- og platformbuckets. Direkte tredjeparts-CLI, eksempelvis `codex` i en terminal, bruger ikke Warp-platformcredits. Det er noget andet end Codex kørt inde i Warp Factories.

[Prissiden](https://www.warp.dev/pricing) viste Free, Build fra $20/måned, Max fra $200/måned, Business fra $50/bruger/måned og Enterprise efter aftale ved månedlig betaling. Dette er indgangspriser, ikke prisen på en driftsklar factory. Enterprise-pris, platformtimepris og dine konkrete Early Access-vilkår er ikke fastslået. En kampagne om op til $10.000 for udvalgte teams er ikke et kundebudget, vi kan regne med.

Et brugbart tilbud skal derfor skille implementering, løbende ansvar, platformforbrug, inference og compute ad. At vælge self-hosting kan flytte en regning og et driftsansvar; det fjerner dem ikke.

## Build.warp.dev og open source

[Build.warp.dev](https://build.warp.dev/) er den Contributions-side, du huskede. Livevisningen viser issues, PR-referencer, labels, bidragydere, søgning og statusgrupper. [Warp-repositoriets README](https://github.com/warpdotdev/warp) beskriver også adgang til aktive agentsessioner i en webkompileret terminal. Det er mere end en changelog, og det er ikke det samme som kundens autentificerede [Factory Dashboard](https://docs.warp.dev/factories/factory-dashboard/).

Browsernetværket viste applikationskald til Build-domænet. Sammenhængen med GitHub er tydelig, men vi har ikke set backendimplementeringen og kan ikke konkludere, at alt kommer direkte fra GitHubs API. Status for en aktiv agent, transcript, heartbeat og faktisk forbrug kræver normalt data fra agentmotoren eller en adapter, medmindre de eksplicit er skrevet tilbage til GitHub. Deployment på Vercel er heller ikke efterprøvet her og er ikke et produktkrav.

Warp **har** en open-source klientkodebase nu. README angiver MIT for UI-frameworkcrates og AGPLv3 for resten af det pågældende repository. Det giver ikke i sig selv en fri selvhostet kopi af Warp Factories-backenden. [warp-factory-examples](https://github.com/warpdotdev/warp-factory-examples) har MIT-licens. Licens og source til selve Build-dashboardet er ikke identificeret. Udkastet genbruger derfor informationsstrukturen og interaktionsidéen, men er original kode og Arc’IT-design, ikke en kopieret produktidentitet eller ukontrolleret kodekopi.

## Cursor: relevant allerede nu

[Cloud Agents](https://cursor.com/docs/cloud-agent) kan tage arbejde ind fra blandt andet GitHub, Slack, Linear og API, køre i separate miljøer, producere ændringer og vedhæfte test-/demobeviser. Agents koster efter den valgte models API-priser; der kræves en betalt plan og en forbrugsgrænse. Den leverede marketing-URL `/agents` gav 403 ved direkte hentning; tilgængelig officiel dokumentation blev brugt i stedet.

[Self-Hosted Machines](https://cursor.com/docs/cloud-agent/self-hosted) betyder kundekørt værktøjseksekvering, mens Cursor driver agentloop, inference og planlægning. My Machines er brugerbundet og kræver egen drift/oprensning. Team Pools kræver Enterprise og service-account-auth. Kunden betaler egne maskiner oven i modelprisen. [Runtime-sammenligningen](https://cursor.com/docs/cloud-agent/self-hosted/choose-runtime) understreger forskellen.

[Origin](https://cursor.com/docs/origin) er allerede i **tidlig beta**, ikke kun en fremtidig GitHub-idé. Det understøtter Git-repositories, PR’er og GitHub-mirroring med gradvis adgang på Pro/Teams/Enterprise. Ved mirroring forbliver GitHub source of truth. Ingen grund til at gøre en Origin-migrering til forudsætning for Arc’IT-ydelsen.

## Matt Pocock: den nyttige læring

[Getting Started With Ralph](https://www.aihero.dev/getting-started-with-ralph), opdateret 8. januar 2026, beskriver en gentaget agentprompt over en afgrænset opgaveliste, én opgave pr. iteration, en progressrecord og en begrænset løkke. Han begynder human-in-the-loop før unattended kørsel og viser, at GitHub Issues og PR’er kan erstatte lokal PRD og direkte commits.

[11 Tips](https://www.aihero.dev/tips-for-ai-coding-with-ralph-wiggum) fremhæver små ændringer, hurtige feedbackloops, eksplicit kvalitetsniveau og isolation. Det understøtter et enkelt Arc’IT-pilotflow. Det er en metodebeskrivelse, ikke bevis for en færdig factory med tenantadskillelse, sikker kø, lovende ROI eller autonom release. Vi kopierer ikke automatisk hans tilladelsesflag, direkte-commit-adfærd eller historiske udsagn om aktuelle modellers kvalitet. Et completion-token fra modellen er ikke verifikation.

## Defense Factory og OpenAI

[Fix and verify findings](https://learn.chatgpt.com/docs/security/plugin/fix-findings) og [GitLab CI](https://learn.chatgpt.com/docs/security/cli/ci/gitlab) understøtter afgrænset scan, accept af fund, fokuseret rettelse, regression/anden dokumenteret bevisførelse, verification og menneskelig review før merge. Scanrettigheder og repository-write kan adskilles. Et rent diffscan betyder ikke, at hele systemet er sikkert.

Vi fandt ingen dokumenteret OpenAI-produktdefinition af navnet **Agent Defense Factory**. Her er det navnet på Arc’IT’s foreslåede implementeringspakke. Daybreak kan være en valgt kapabilitet, hvis den faktiske konto og anvendelse er godkendt; [Trusted Access](https://learn.chatgpt.com/docs/cyber-safety) gør ikke din adgang til en generel tilladelse til arbejde for tredjepartskunder. Ingen partnerstatus eller Daybreak-baseret kundegaranti er lagt ind i tilbuddet.

## Dashboardets faktiske datakilder

| Oplysning                  | Foreslået autoritativ kilde                          | Må ikke udledes alene af                         |
| -------------------------- | ---------------------------------------------------- | ------------------------------------------------ |
| Issue, PR og merge         | Kundens GitHub, bundet til repository og revision    | Agentens afsluttende besked                      |
| Kørselsstatus og heartbeat | Valgt runtime/CI-run                                 | En label som “in progress”                       |
| Tests og reviewbevis       | CI/checkrun og immutable artifactreferences          | En grøn frontendmarkør                           |
| Fund og verification       | Privat findingrecord bundet til samme commit         | Fravær af nye warnings                           |
| Forbrug                    | Providerens usage-data eller tydeligt mærket estimat | Køretid ganget med en gættet tarif               |
| Godkendelse                | Autoriseret reviewer og beskyttet releaseproces      | Et klik eller en modelpåstand uden serverkontrol |

Første dashboard er read-only. Serveren skal validere GitHub-/provider-events, håndtere dubletter, sene events, manglende adgang og rate limits samt vise seneste sync og stale/unknown. Secrets og følsomme fund må aldrig lægges i frontendbundle eller public issues. Webhooks skal ikke kunne ændre policy eller starte privilegeret arbejde alene gennem tekst i en opgave.
