# Skill: hotsak-produktside

Denne skillen hjelper en KI-agent (for eksempel GitHub Copilot) med å oppdatere produktsiden for Hotsak i `product-site/`. Skillen inneholder målgruppene, strukturen og valgene vi allerede har tatt, slik at agenten ikke må finne ut av det på nytt hver gang.

## Når bruker du den?

- En ny funksjon i Hotsak skal beskrives på produktsiden.
- Du vil legge til flere spørsmål og svar.
- Skjermbildene er utdaterte og skal tas på nytt.
- Sidene skal ryddes eller få en ny side.

Vil du bare legge til et spørsmål i FAQ, trenger du ikke skillen. Følg [FAQ-GUIDE.md](../../../product-site/FAQ-GUIDE.md).

## Slik bruker du den

Åpne Copilot i repoet og skriv for eksempel:

```text
Bruk skillen hotsak-produktside. Vi har laget en ny funksjon for <beskrivelse>.
Lag et avsnitt om den på journalføringssiden, legg til spørsmål i FAQ og ta nye skjermbilder.
```

Andre eksempler:

```text
Bruk skillen hotsak-produktside og ta alle skjermbildene på nytt.
```

```text
Bruk skillen hotsak-produktside. Lag en ny side om ombruk for saksbehandlere.
```

Agenten vil da:

1. stille avklarende spørsmål, ett om gangen
2. analysere koden for funksjonen
3. skrive tekst for riktig målgruppe og kjøre den gjennom klarspråk-skillen
4. ta skjermbilder med syntetiske testdata
5. validere FAQ-en og sjekke sidene i nettleseren
6. oppsummere endringene uten å committe

## Verktøy skillen bruker

| Hva | Hvor | Kommando |
| --- | --- | --- |
| Skjermbilder | `client/e2e/produktside/skjermbilder.spec.ts` | `cd client && pnpm run produktside:skjermbilder` |
| FAQ-innhold | `product-site/faq.md` | – |
| FAQ-validering | `product-site/scripts/valider-faq.mjs` | `node product-site/scripts/valider-faq.mjs` |
| Publisering | `.github/workflows/pages.yaml` | Kjører ved push til `main` |

## Hold skillen oppdatert

Tar dere et nytt valg om produktsiden, for eksempel at noe skal fjernes eller en ny side skal inn, legg det inn i `SKILL.md`. Da husker agenten det neste gang.
