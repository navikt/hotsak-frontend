# Frontend for saksbehandling på Hjelpemiddelområdet

Koden er delt i to separate moduler:

- `server` – Go-backend
- `client` – React-frontend

## Kom i gang

### Forutsetninger

- Node ≥ 20
- Go (for serveren)

### PNPM

Prosjektet bruker **pnpm** som pakkehåndterer. Hvis du:

- aldri har brukt pnpm før, eller
- har klonet repoet tidligere da det brukte npm

gjør følgende først:

```bash
corepack enable
```

Deretter, én gang etter at du har hentet ned pnpm-endringene:

```bash
# i prosjektroten
rm -rf node_modules package-lock.json
pnpm install

# i client
cd client
rm -rf node_modules package-lock.json
pnpm install
```

Etter dette holder det med:

- `pnpm install` i rot når du får nye root-avhengigheter
- `cd client && pnpm install` når `client/package.json` endrer seg

### Client

For å kjøre frontend lokalt:

```bash
cd client
pnpm run dev
```

MSW brukes da for å interecepte request-er til API-et.

### Server

Installer Go:

```bash
brew install go
```

Legg til støtte for Go i Visual Studio Code [https://marketplace.visualstudio.com/items?itemName=golang.Go](https://marketplace.visualstudio.com/items?itemName=golang.Go).

## Kjør tester

Vi bruker Cypress sammen med MSW for å kjøre testene våre:

- Kjør cypress-tester i nettleser: start appen med `pnpm run dev`, deretter `pnpm run cypress:open` i en annen terminal.
- Kjør cypress-tester i headless nettleser: start appen med `pnpm run dev`, deretter `pnpm run cypress:run` i en annen
  terminal.

Tester kjøres også automatisk i GitHub Actions ved push.

## Deploy

Ved push til main kjøres det deploy til dev-gcp. Appen er tilgjenglig
på [https://hotsak.intern.dev.nav.no/](https://hotsak.intern.dev.nav.no/).
