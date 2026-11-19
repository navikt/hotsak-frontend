---
name: hotsak-erfaringer
description: Erfaringer, avklaringer og feedback fra tidligere arbeid i hotsak-frontend. Last alltid inn før du planlegger, endrer kode, skriver tester eller reviewer i dette repoet, og oppdater etter fullført oppgave eller ny feedback.
---

# Erfaringer fra hotsak-frontend

Kompakt erfaringslogg. Gjelder i tillegg til `AGENTS.md`. Ved konflikt vinner siste uttrykkelige beskjed fra utvikleren.

## Arbeidsform (feedback fra utvikleren)

- Aldri `git commit` eller `git push` uten uttrykkelig beskjed. Utvikleren reviewer og committer selv.
- Hold deg til scope. Ikke rør urelaterte filer eller utviklerens egne ucommitede endringer. Ved «bare lag tester»: ikke endre produksjonskode uten å spørre.
- Ikke skriv om tekst utvikleren sier hen fikser selv. Kopier ordrett.
- Komplekse eller uklare oppgaver: lag en trinnvis plan, still konkrete spørsmål og vent på bekreftelse før du implementerer.
- Velg den enkleste lesbare løsningen. Unngå unødvendig state, defensiv kode, abstraksjoner og refaktorering.
- Review: vær ærlig og direkte. Vurder kompleksitet, lesbarhet og om testene er verdt vedlikeholdet. Ikke let etter feil for å finne feil.
- Ikke endre `pnpm-lock.yaml` eller avhengigheter uten at oppgaven krever det. Spør først.

## Kodekonvensjoner

- Bruk Aksel-komponenter og tokens. Sjekk Aksel-skill eller -dokumentasjon før du lager egen styling.
- Hold komponenter små. Flytt logikk til hooks når det gjør koden klarere eller lettere å teste, ikke ellers.
- Bruk norske domenenavn som beskriver tilstanden (`erPapirsøknad`, ikke `erSkanIm`).
- Boolske flagg fra asynkrone data skal bare være `true` når data bekrefter tilstanden, for eksempel `manglerIOebs` (som er `false` under lasting og ved feil). Da unngår du blinkende varsler og sperrer.
- Bruk SWR sin `isLoading` og cache i stedet for egen state. Samme SWR-nøkkel deler kallet.
- Bruk typede, diskriminerte modeller framfor sentinel-verdier eller duplisert state.
- Modaler i saksbildet: state og `modalVelger` i `sak/Sak.tsx`, og `InfoModal` for rene beskjeder (se `ResultatManglerModal`). Hurtigtaster i `sak/hotkeys/useSakHotkeys.ts` må følge de samme reglene som knappene.
- Skjema: validering hører til den aktive flyten. Vis feil på feltet. Ikke send skjemaet ved Enter. Journalføring sendes med knappen og venter på svaret.
- Scrolling er avgrenset til panelet: bare innholdet (for eksempel dokument-iframe) skal scrolle, ikke det resizable panelet.
- Eksperimentell eller dev-only funksjonalitet skal styres med miljø eller toggle. Sjekk at nye felt ikke sendes med i payload i prod.

## Tester

- Test synlig oppførsel og meningsfull logikk. Ikke speil implementasjonen, og fjern utdaterte tester.
- Playwright: bruk spesifikke tilgjengelige selektorer. Tekster som «Endre» og «Lagret» finnes mange steder og gir feil i strict mode.
- Oppgavelisten viser ikke brukernavn. Finn rader med «gjelder»-teksten (`åpneSakSomMatcher` i `e2e/helpers.ts`).

## Mock-data (MSW + Dexie)

- Hold ID-er og koblinger mellom sak, journalpost og person konsistente. Unngå `bulkAdd` med dupliserte nøkler, og ikke koble alle journalposter til alle saker.
- `PersonStore` bruker fnr som nøkkel, og siste lagring vinner. En testperson trenger derfor et eget fnr.
- Mock-personer får et tilfeldig `brukernummer`. Saken «Test: bruker finnes ikke i OeBS» (`bruker_mangler_i_oebs.json`, flagget `brukerManglerIOebs`) dekker bruker uten brukernummer.
- Mock-hjelpere som brukes av både MSW og Vite-middleware må være rene og uten assets. PDF-er og iframes som hentes direkte på URL, går ikke gjennom MSW.

## Verktøy og sandkasse (cplt)

- Tester: `pnpm run test:copilot` og `pnpm run e2e:copilot`. Disse leser ikke `.env`.
- `client/.env` er sperret (content exclusion). Ikke prøv å lese den. `pnpm run build` og `vite build` feiler derfor. Verifiser med `tsc -b` og `pnpm run lint`.
- `/usr/local/bin/pnpm` (corepack) gir EPERM i cplt. Kjør `export PATH=~/Library/pnpm/bin:$PATH` først. Playwright sin webServer starter `pnpm run dev`. Gir også `~/Library/pnpm/bin/node` EPERM, kan ingen tester kjøres. Si fra og be utvikleren kjøre dem.
- I cplt er `~/.npmrc` ulesbar, så pnpm henter `@navikt/*` fra npmjs og skriver om `client/pnpm-lock.yaml`. Sjekk `git status` etter pnpm-kjøringer og tilbakestill lock-filen med `git checkout -- client/pnpm-lock.yaml`.

## Vedlikehold av denne skillen

- Oppdater etter en fullført oppgave eller ny feedback, bare når lærdommen er varig og gjelder flere oppgaver: en korreksjon fra utvikleren, en avklaring som gjentar seg, en konvensjon eller en felle som kostet tid.
- Ikke ta med enkeltdetaljer som piksler, ordlyd, enkeltbugs eller oppgavehistorikk.
- Hold filen under 90 linjer. Slå sammen eller erstatt eldre punkter før du legger til nye, og slett det som ikke lenger stemmer.
- Én linje per punkt. Si fra i svaret når skillen er endret, så utvikleren kan reviewe det.
