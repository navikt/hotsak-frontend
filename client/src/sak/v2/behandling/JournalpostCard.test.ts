import { describe, expect, it } from 'vitest'

import { formaterLogiskeVedlegg, skalDokumentkortVæreÅpent } from './JournalpostCard.tsx'

describe('formaterLogiskeVedlegg', () => {
  it('viser en kommaseparert liste over logiske vedlegg', () => {
    expect(
      formaterLogiskeVedlegg([
        { vedleggId: '1', tittel: 'Vedlegg 1' },
        { vedleggId: '2', tittel: 'Vedlegg 2' },
      ])
    ).toBe('Vedlegg 1, Vedlegg 2')
  })

  it('viser at dokumentet ikke har logiske vedlegg', () => {
    expect(formaterLogiskeVedlegg([])).toBe('Ingen logiske vedlegg')
  })

  it('slår sammen dokumentkortet for digitale søknader med høyst ett dokument', () => {
    expect(skalDokumentkortVæreÅpent(false, 0)).toBe(false)
    expect(skalDokumentkortVæreÅpent(false, 1)).toBe(false)
    expect(skalDokumentkortVæreÅpent(false, 2)).toBe(true)
  })

  it('åpner dokumentkortet for papirsøknader', () => {
    expect(skalDokumentkortVæreÅpent(true, 0)).toBe(true)
  })
})
