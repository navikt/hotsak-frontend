import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useGjelderOptions } from './useKodeverkOppgave.ts'

vi.mock('swr/immutable', () => ({
  default: () => ({
    data: [
      { behandlingstema: { kode: 'ab0002', term: 'Briller til barn' } },
      { behandlingstema: { kode: 'ab0001', term: 'Briller/linser' } },
      { behandlingstema: { kode: 'ab0003', term: 'Briller' } },
    ],
  }),
}))

describe('useGjelderOptions', () => {
  it('sorterer «/» som mellomrom', () => {
    const { result } = renderHook(() => useGjelderOptions())

    expect(result.current.map((option) => option.label)).toEqual(['Briller', 'Briller/linser', 'Briller til barn'])
  })
})
