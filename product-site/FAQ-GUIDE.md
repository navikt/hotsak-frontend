# Slik legger du til spørsmål og svar

Spørsmålene på siden [Spørsmål og svar](https://navikt.github.io/hotsak-frontend/faq.html) ligger i fila `product-site/faq.md`. Du skriver vanlig tekst med noen få tegn for overskrifter og fet skrift. Du trenger ikke å kunne HTML.

## Slik endrer du fila på GitHub

1. Åpne [faq.md på GitHub](https://github.com/navikt/hotsak-frontend/blob/main/product-site/faq.md).
2. Trykk på blyanten (**Edit this file**) oppe til høyre.
3. Gjør endringene. Fanen **Preview** viser omtrent hvordan teksten blir.
4. Trykk **Commit changes…**. Velg **Create a new branch** og deretter **Propose changes**.
5. Opprett en pull request og be noen på teamet se over den.

Når du oppretter pull requesten, sjekker GitHub automatisk at fila er riktig skrevet. Se [Hvis sjekken feiler](#hvis-sjekken-feiler). Når pull requesten er godkjent og merget, blir siden oppdatert etter noen minutter.

## Slik ser et spørsmål ut

```markdown
# Journalføring

## Hva gjør jeg hvis dokumentene kommer før det finnes en sak?

Velg **Koble til sak** og deretter **Generell sak**.

Det kan være aktuelt når en ettersendelse kommer før søknaden.
```

- `# Journalføring` er en **gruppe**. Gruppene vises som store overskrifter på siden.
- `## Hva gjør jeg …?` er et **spørsmål**. Det må stå under en gruppe.
- Teksten under spørsmålet er **svaret**. Hvert spørsmål må ha et svar.

Vil du legge til et spørsmål i en gruppe som finnes, skriver du det under de andre spørsmålene i gruppen. Vil du lage en ny gruppe, skriver du en ny linje som starter med `# `.

## Dette kan du bruke i svarene

| Du skriver | Det blir |
| --- | --- |
| `**Koble til sak**` | **Koble til sak** (fet skrift) |
| `*viktig*` | *viktig* (kursiv) |
| `[Les om journalføring](journalforing.html)` | En lenke til en annen side på produktsiden |
| `[Les om journalføring](journalforing.html#innsyn)` | En lenke til et bestemt avsnitt |
| `[Les rutinen](https://navno.sharepoint.com/...)` | En lenke til en ekstern side som åpnes i ny fane |
| `- Første punkt` | En punktliste. Hver linje som starter med `- `, blir et nytt punkt |
| `Første linje\` | Et linjeskift. Skriv `\` til slutt i linjen, så starter neste linje på en ny linje i samme avsnitt |
| En tom linje | Et nytt avsnitt |

Et linjeskift passer for regnestykker og andre korte linjer som hører sammen:

```markdown
**Fysisk**\
+ **Bestilt**\
− **Reservert**\
= **På lager**
```

Bruk minustegnet `−` i stedet for bindestrek (`-`) først i en linje. En linje som starter med `- `, blir et punkt i en liste.

## Dette kan du ikke bruke

- `###` eller flere `#`. Bruk bare `#` for grupper og `##` for spørsmål.
- Nummererte lister (`1.`, `2.`). Bruk punktliste med `- `.
- Tabeller, sitater (`>`), bilder og HTML (`<b>`, `<br>` og lignende).

## Tips

- Skriv spørsmålene slik saksbehandlerne selv ville spurt.
- Hold svarene korte. Lenk heller til siden der det står mer.
- Bruk de samme ordene som står på knappene og feltene i Hotsak, og skriv dem med fet skrift.
- Teksten øverst i fila mellom `<!--` og `-->` er en huskelapp. Den vises ikke på siden.

## Hvis sjekken feiler

Får pull requesten et rødt kryss, åpner du **Details** ved sjekken **Valider spørsmål og svar**. Der står det hvilken linje som er feil og hva du må rette, for eksempel:

```text
Linje 42: Spørsmålet «Hvem kan se dokumentene?» mangler svar.
Linje 57: Fet skrift mangler avsluttende **.
Linje 63: Fant ikke avsnittet #innsyn2 på journalforing.html.
```

Rett feilen i fila på samme måte som før, og lagre endringen i samme branch. Sjekken kjøres da på nytt.

Får du det ikke til? Spør i Slack-kanalen #digihot.
