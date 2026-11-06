import { describe, expect, it } from 'vitest'

import { ELEMENT_PLACEHOLDER } from './PlaceholderElement.ts'
import { parseTekstMedPlaceholders } from './parseTekstMedPlaceholders.ts'

describe('parseTekstMedPlaceholders', () => {
  it('forhåndsutfyller forventet behandlingstid', () => {
    expect(
      parseTekstMedPlaceholders('Ventetiden er [auto_antall_uker_svartid].', {
        auto_antall_uker_svartid: '12 uker',
      })
    ).toEqual([
      { text: 'Ventetiden er ' },
      {
        type: ELEMENT_PLACEHOLDER,
        placeholder: 'Forventet behandlingstid',
        deletable: true,
        children: [{ text: '12 uker' }],
      },
      { text: '.' },
    ])
  })
})
