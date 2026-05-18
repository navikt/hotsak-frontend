# Frontend for saksbehandling på Hjelpemiddelområdet

Koden er delt i to separate moduler:

- `server` – Go-backend
- `client` – React-frontend

## Kom i gang

### Forutsetninger

- Node ≥ 24
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

### Enhetstester (Vitest)

```bash
pnpm run test        # watch-modus
pnpm run test:ci     # kjør én gang (CI)
```

### E2E-tester (Playwright)

E2E-testene bruker Playwright med Chromium og kjører mot dev-serveren (MSW mocker API-et).

```bash
# Installer Playwright-nettlesere (kun første gang)
cd client && pnpm exec playwright install chromium

# Kjør E2E-tester (starter dev-server automatisk)
pnpm run e2e

# Kjør E2E-tester med UI (headed modus)
pnpm run e2e:ui
```

Tester kjøres også automatisk i GitHub Actions ved push til main.

## Deploy

Ved push til main kjøres det deploy til dev-gcp. Appen er tilgjenglig
på [https://hotsak.intern.dev.nav.no/](https://hotsak.intern.dev.nav.no/).
