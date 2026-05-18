# AGENTS.md

## Teknologier og rammeverk

- [pnpm](https://pnpm.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Aksel](https://aksel.nav.no/)
- [React](https://reactjs.org/)

## Bygg prosjektet

- `cd client`
- `pnpm run build`
-

## Kjør prosjektet i dev-modus

- `cd client`
- `pnpm run dev`

## Code style

- Bruk `function` for funksjoner på modul-nivå.
- Bruk arrow functions for inline-funksjoner og callbacks.
- Bruk alltid functional components i React.
- Bruk CSS modules og importer som `import classes from './Component.module.css'`
- Bruk named exports hvis mulig.

## Testing

- **Vitest** for unit tests (jsdom, globals enabled). Run: `pnpm run test`.
- **Playwright** for E2E tests (Chromium, uses MSW in dev mode). Run: `pnpm run e2e`.
- E2E tests live in `client/e2e/`, unit tests next to source in `__tests__/` dirs.
- Dev server uses MSW to intercept API requests; no real backend needed locally.
- Use accessible roles/labels for Playwright selectors (getByRole, getByLabel) — no data-testid.
