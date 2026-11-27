import { defineConfig, devices } from '@playwright/test'

// Tar skjermbilder til produktsiden (product-site/). Kjøres manuelt med `pnpm run produktside:skjermbilder`.
export default defineConfig({
  testDir: './e2e/produktside',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  timeout: 60_000,
  use: {
    baseURL: 'http://localhost:3001',
    ...devices['Desktop Chrome'],
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  },
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:3001',
    reuseExistingServer: false,
    timeout: 60_000,
  },
})
