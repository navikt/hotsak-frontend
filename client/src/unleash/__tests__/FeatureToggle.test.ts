import { describe, expect, it } from 'vitest'

import { FEATURE_TOGGLE_BOOTSTRAP, FeatureToggle } from '../FeatureToggle.ts'

describe('FEATURE_TOGGLE_BOOTSTRAP', () => {
  it('has a bootstrap value for every feature toggle', () => {
    const toggleNames = Object.values(FeatureToggle)
    expect(Object.keys(FEATURE_TOGGLE_BOOTSTRAP).sort()).toEqual([...toggleNames].sort())
  })

  it('starter av (false) for pilotstyrte flagg inntil Unleash har evaluert konteksten', () => {
    expect(FEATURE_TOGGLE_BOOTSTRAP[FeatureToggle.journalforing]).toBe(false)
  })
})
