# Frontend for saksbehandling på Hjelpemiddelområdet

Koden er delt i to separate moduler med hver sin package.json
En for nodeJS backenden (server) og en for frontend (client)

For å installere pakker til server kjør

### `npm install <pakkenavn> --prefix server`

eller CD inn i server mapa og kjør npm install på vanlig måte derfra.

Samme gjelder for client, bare bruk prefix client i stedet.

For lokal kjøring er backend mocket ut med Mock Service Worker. Mockene ligger i _mocks_ mappen.

Kjør opp appen ved å kjøre følgende kommando fra toppnivå.

### `npm run dev`

Alternativ CD inn i client og kjørt npm start

## Kjør med MSW

For å kjøre lokalt med mockede data, kan du kjøre

```
npm run dev
```

fra rot i prosjektet. MSW brukes da for å interecepte requests til APIet.

## Tester

Vi bruker Cypress sammen med MSW for å kjøre testene våre:

- Kjør cypress-tester i nettleser: start appen med `npm run dev`, deretter `npm run cypress:open` i en annen terminal.
- Kjør cypress-tester i headless nettleser: start appen med `npm run dev`, deretter `npm run cypress:run` i en annen terminal.

Tester kjøres også automatisk i Github Actions ved push.

## Deploy

Ved push til main kjøres det deploy til dev-gcp. Appen er tilgjenglig på https://hm-saksbehandling.dev.intern.nav.no/
