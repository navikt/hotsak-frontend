import { describe, expect, it } from 'vitest'

import { isBreveditorbrev } from './brevSelectors.ts'
import { type Brev, BreveditorbrevUtenVedtak, Brevmal } from './brevTyper.ts'

describe('isBreveditorbrev', () => {
  it.each([Brevmal.BREVEDITOR_VEDTAKSBREV, ...BreveditorbrevUtenVedtak])('inkluderer %s', (brevmal) => {
    expect(isBreveditorbrev({ brevmal } as Brev)).toBe(true)
  })

  it('utelater brev som bruker en annen editor', () => {
    expect(isBreveditorbrev({ brevmal: Brevmal.BARNEBRILLER_INNHENTE_OPPLYSNINGER } as Brev)).toBe(false)
  })
})
