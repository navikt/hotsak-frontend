import { describe, expect, it } from 'vitest'

import { select } from '../select'

describe('select', () => {
  it('returns a property selector when given a property key', () => {
    const selector = select<{ navn: string; alder: number }, 'navn'>('navn')

    expect(selector({ navn: 'Kari', alder: 31 })).toBe('Kari')
  })

  it('returns the same selector function when given a function', () => {
    const fn = (item: { verdi: number }) => item.verdi * 2
    const selector = select(fn)

    expect(selector).toBe(fn)
    expect(selector({ verdi: 3 })).toBe(6)
  })

  it('handles falsy property values', () => {
    const selector = select<{ aktiv: boolean }, 'aktiv'>('aktiv')

    expect(selector({ aktiv: false })).toBe(false)
  })
})
