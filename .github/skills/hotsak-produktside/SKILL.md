---
name: hotsak-produktside
description: Oppdater produktsiden for Hotsak i product-site/ (GitHub Pages). Bruk når nye funksjoner skal beskrives, spørsmål og svar skal utvides, skjermbilder skal tas på nytt eller sidene skal ryddes. Beskriver målgrupper, struktur, FAQ-formatet, skjermbildeskriptet og valg som ikke skal reverseres.
---

# Produktsiden for Hotsak

Produktsiden ligger i `product-site/` og publiseres til <https://navikt.github.io/hotsak-frontend/> av `.github/workflows/pages.yaml` ved push til `main`. Det er ren HTML og CSS uten byggesteg. Aksel brukes ikke her, siden har egne CSS-variabler i `styles.css`.

## Før du starter

1. Last inn `hotsak-erfaringer` og følg den.
2. Avklar med utvikleren: hvilken funksjon eller endring, hvilken side den hører til og hvem som skal lese teksten. Still spørsmålene ett om gangen.
3. Analyser koden for funksjonen. Beskriv det brukeren ser og kan velge, med de samme ordene som står i Hotsak. Ikke gjett på forretningsregler. Spør hvis koden ikke gir svaret.

## Målgrupper og tone

- **Forsiden (`index.html`)**: produktledere, designere, ledere og ansatte på hjelpemiddelsentralene. Kort overblikk over hva Hotsak kan gjøre. Ingen tekniske detaljer, bortsett fra avsnittet om teknologistacken.
- **Journalføring (`journalforing.html`) og Spørsmål og svar (`faq.html` + `faq.md`)**: saksbehandlere. Konkret og handlingsrettet: hva du ser, hva du velger og hva som skjer.
- **Kontakt oss (`kontakt.html`)**: Slack-kanalen #digihot og Teams-kanalen «DigiHoT - innspill, spørsmål og info» (bare navnet, ingen lenke). GitHub-lenken står nederst, liten og diskret.
- All tekst på norsk bokmål. Kjør ny og endret tekst gjennom skillen `klarsprak` før du er ferdig.

## Struktur

- Alle sider har samme header (bare logo og navn) og venstremeny: Om Hotsak, Journalføring, Spørsmål og svar, Kontakt oss. Ny side = kopier en eksisterende underside og legg lenken inn i menyen på **alle** sidene, med `aria-current="page"` på den aktive.
- Forsiden bruker `.hero-grid` og `.showcase-grid` (to like kolonner, én kolonne under 1200 px). Smale, høye bilder får klassen `portrait`.
- Skjermbilder ligger i `.browser-frame` med `figcaption`. På innholdssider brukes `browser-frame content-figure`.
- Eksterne lenker: `target="_blank" rel="noreferrer"` og «(åpnes i ny fane)» i lenketeksten.
- Journalføringssiden har ankre som FAQ lenker til: `#oppgaver`, `#dokumenter`, `#flyter`, `#gosys-generell`, `#innsyn`, `#overforing`. Ikke endre dem uten å oppdatere `faq.md`.

## Valg som ikke skal reverseres

Utvikleren har bedt om å fjerne disse. Ikke legg dem tilbake:

- Overskriften «Utforsk Hotsak» i venstremenyen.
- Knappene «Se hva Hotsak kan gjøre» og «Se kildekoden» og teksten «Siden beskriver funksjonene i Hotsak …» i hero.
- Rotert hero-bilde. Bilder skal aldri overlappe tekst.
- Footeren, kontaktbåndet nederst på forsiden og lenken «Snakk med teamet om Hotsak».
- GitHub-lenken i headeren.
- SVG-illustrasjoner av skjermbilder. Bruk ekte skjermbilder (`favicon.svg` og `og-image.svg` beholdes).

## Spørsmål og svar (FAQ)

- Innholdet ligger i `product-site/faq.md`, slik at produktleder kan redigere uten HTML. `faq.js` henter fila og viser den med `faq-parser.mjs`.
- `#` = gruppe, `##` = spørsmål, teksten under = svar. Tillatt: avsnitt, `**fet**`, `*kursiv*`, `[lenke](adresse)` og punktlister med `- `. Alt annet gir feil.
- Hvert spørsmål får en id fra teksten, så `faq.html#<id>` åpner spørsmålet direkte.
- Valider alltid: `node product-site/scripts/valider-faq.mjs`. Samme sjekk kjører i jobben «Valider spørsmål og svar» i `pages.yaml` på pull requests og før publisering. Den sjekker også at relative lenker og ankre finnes.
- Utvider du Markdown-støtten, endre `faq-parser.mjs` (brukes både i nettleseren og i valideringen) og oppdater `product-site/FAQ-GUIDE.md`.
- Nye funksjoner bør ofte få både et avsnitt på riktig side og 1–3 spørsmål i FAQ som lenker til avsnittet.

## Skjermbilder

Skjermbildene tas med syntetiske testdata fra MSW. Det er ingen ekte personopplysninger.

```bash
cd client
pnpm run produktside:skjermbilder            # alle bilder
pnpm run produktside:skjermbilder -g briller   # bare testene som matcher navnet
```

- Spesifikasjonen ligger i `client/e2e/produktside/skjermbilder.spec.ts` og skriver til `product-site/assets/<navn>.png`. Den er holdt utenfor vanlig e2e med `testIgnore` i `playwright.config.ts`.
- Hjelpefunksjonen `taBilde` skjuler utviklerverktøyet og Unleash-knappen og fjerner fokusrammer. Bruk `clip` for å vise bare det relevante panelet.
- Åpne oppgaver via oppgavelista (`åpneOppgaveSomMatcher`): «Ta oppgaven» og så «Åpne». Da blir feltene redigerbare. Direkte URL-er til saker kan feile i mock.
- Ikke vent på `networkidle` (SSE gjør at den aldri blir ferdig). Vent på et konkret element.
- Chromium uten skjerm viser ikke PDF-er, så dokumentpaneler blir tomme. Beskjær dem bort.
- Gode testdata: oppgaven «Terskeleliminator» (saksbilde), søk på `01010199999` (personoversikt), oppgaven «Briller til barn», journalføringsoppgave med «Journalføring» og «Hjelpemidler».
- Se på hvert bilde etterpå. Oppdater `width`/`height` på `<img>` når størrelsen endres, og skriv en `alt`-tekst som beskriver hva bildet viser.

## Sjekk før du er ferdig

1. `node product-site/scripts/valider-faq.mjs`
2. Start en statisk server (`cd product-site && python3 -m http.server`) og se på alle sidene i 1440 px og under 900 px. `fetch('faq.md')` virker ikke fra `file://`.
3. Sjekk at ingen bilder overlapper tekst, at menyen er lik på alle sider og at det ikke er feil i konsollen.
4. Kjør `klarsprak` på ny tekst.
5. Ikke commit. Oppsummer endringene for utvikleren.
