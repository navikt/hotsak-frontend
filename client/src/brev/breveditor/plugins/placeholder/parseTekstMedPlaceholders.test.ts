import { describe, expect, it } from 'vitest'

import { ELEMENT_PLACEHOLDER } from './PlaceholderElement.ts'
import { parseTekstMedPlaceholders, SpesiellePlaceholdere } from './parseTekstMedPlaceholders.ts'

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

  it('merker bare formidlernavn for etterutfylling', () => {
    expect(parseTekstMedPlaceholders('Hei [auto_formidler_navn], [auto_formidler_stilling]!')).toEqual([
      { text: 'Hei ' },
      {
        type: ELEMENT_PLACEHOLDER,
        placeholder: 'Formidlers navn',
        autoVerdi: SpesiellePlaceholdere.FORMIDLER_NAVN,
        deletable: true,
        children: [{ text: '\uFEFF' }],
      },
      { text: ', ' },
      {
        type: ELEMENT_PLACEHOLDER,
        placeholder: 'Formidlers stilling',
        deletable: true,
        children: [{ text: '\uFEFF' }],
      },
      { text: '!' },
    ])
  })

  it('beholder nøyaktig tekst for ukjente placeholdere uten verdi', () => {
    expect(parseTekstMedPlaceholders('Hei [skriv inn stilling]!')).toEqual([
      { text: 'Hei ' },
      {
        type: ELEMENT_PLACEHOLDER,
        placeholder: 'skriv inn stilling',
        deletable: true,
        children: [{ text: '\uFEFF' }],
      },
      { text: '!' },
    ])
  })
})
