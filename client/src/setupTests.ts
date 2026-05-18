import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll } from 'vitest'

// Provide a minimal window.appSettings so modules that read it at import time don't crash.
// In jsdom, globalThis === window, so setting it here makes it available as window.appSettings.
;(globalThis as Record<string, unknown>).appSettings ??= {
  NAIS_CLUSTER_NAME: 'test',
  USE_MSW: 'false',
  MILJO: 'test',
}

const server = setupServer()

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
