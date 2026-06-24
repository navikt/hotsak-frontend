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

- Use `function` for top-level functions in modules.
- Use arrow functions for inline-functions and callbacks.
- Always use functional components in React, with the `function` keyword.
- Use CSS-modules and import as `import classes from './Component.module.css'`
- Prefer named exports.
- Always import types with `type` prefix, like `import { type Sak } from './sakTyper.ts'`

## Git

- **Aldri kjør `git commit` eller `git push`** uten at brukeren eksplisitt ber om det.
- Gjør ferdig alle kodeendringer, vis en oppsummering, og la brukeren selv gjennomgå og commite.

- **Vitest** for unit tests (jsdom, globals enabled). Run: `pnpm run test`.
- **Playwright** for E2E tests (Chromium, uses MSW in dev mode). Run: `pnpm run e2e`.
- E2E tests live in `client/e2e/`, unit tests next to source in `__tests__/` dirs.
- Dev server uses MSW to intercept API requests; no real backend needed locally.
- Use accessible roles/labels for Playwright selectors (getByRole, getByLabel) — no data-testid.
