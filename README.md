# Frontend for saksbehandling på Hjelpemiddelområdet

Koden er delt i to separate moduler med hver sin package.json
En for NodeJS-backenden (server) og en for React-frontenden (client)

## Kom i gang

For installere alle avhengigheter i prosjektet kan du køre

```bash
npm install
```

etterfulgt av

```bash
npm run install:all
```

For å installere pakker til server kan du kjøre

```bash
npm install <pakkenavn> --prefix server
```

eller CD inn i server mappa og kjør npm install på vanlig måte derfra.
Samme gjelder for client, bare bruk prefix client i stedet.

## Kjør lokalt

For å kjøre lokalt med mockede data kan du kjøre

```bash
npm run dev
```

fra rot i prosjektet. MSW brukes da for å interecepte requests til APIet.

## Kjør tester

Vi bruker Cypress sammen med MSW for å kjøre testene våre:

- Kjør cypress-tester i nettleser: start appen med `npm run dev`, deretter `npm run cypress:open` i en annen terminal.
- Kjør cypress-tester i headless nettleser: start appen med `npm run dev`, deretter `npm run cypress:run` i en annen
  terminal.

Tester kjøres også automatisk i Github Actions ved push.

## Deploy

Ved push til main kjøres det deploy til dev-gcp. Appen er tilgjenglig
på [https://hotsak.intern.dev.nav.no/](https://hotsak.intern.dev.nav.no/).
