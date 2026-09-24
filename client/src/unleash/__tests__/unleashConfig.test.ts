import { describe, expect, it } from 'vitest'

import { unleashConfig, unleashEnabled } from '../unleashConfig.ts'

describe('unleashConfig', () => {
  it('is disabled when UNLEASH_ENABLED is not set (matches setupTests.ts default)', () => {
    expect(unleashEnabled).toBe(false)
  })

  it('disables refresh and metrics when Unleash is not enabled, relying only on bootstrap', () => {
    expect(unleashConfig.disableRefresh).toBe(true)
    expect(unleashConfig.disableMetrics).toBe(true)
  })

  it('points at the same-origin BFF proxy, never directly at Unleash', () => {
    expect(unleashConfig.url.toString()).toBe(`${window.location.origin}/api/unleash`)
  })

  it('lets bootstrap values win over any stale cached toggles', () => {
    expect(unleashConfig.bootstrapOverride).toBe(true)
    expect(unleashConfig.bootstrap?.length).toBeGreaterThan(0)
  })
})
