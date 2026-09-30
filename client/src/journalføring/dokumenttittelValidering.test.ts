import { describe, expect, it } from 'vitest'

import { type Dokument } from '../types/types.internal.ts'
import { harUgyldigeDokumenttitler, validerDokumenttittel } from './dokumenttittelValidering.ts'

const dokumenter: Dokument[] = [
  { journalpostId: 'journalpost-1', dokumentId: 'dokument-1', tittel: 'Opprinnelig tittel', logiskeVedlegg: [] },
  { journalpostId: 'journalpost-1', dokumentId: 'dokument-2', tittel: 'Annet dokument', logiskeVedlegg: [] },
]

describe('validerDokumenttittel', () => {
  it.each(['', '   ', '\n\t'])('avviser tom eller blank dokumenttittel (%j)', (tittel) => {
    expect(validerDokumenttittel(tittel)).toBe('Du må skrive en dokumenttittel')
  })

  it.each(['a', 'ab', '  ab  '])('avviser dokumenttittel med færre enn tre tegn (%j)', (tittel) => {
    expect(validerDokumenttittel(tittel)).toBe('Dokumenttittelen må ha minst 3 tegn')
  })

  it.each(['abc', '  abc  ', 'a b'])('godtar dokumenttittel med minst tre tegn (%j)', (tittel) => {
    expect(validerDokumenttittel(tittel)).toBeUndefined()
  })
})

describe('harUgyldigeDokumenttitler', () => {
  it('bruker opprinnelig tittel når den ikke er endret', () => {
    expect(harUgyldigeDokumenttitler(dokumenter, {})).toBe(false)
    expect(harUgyldigeDokumenttitler([{ ...dokumenter[0], tittel: ' ' }], {})).toBe(true)
  })

  it('avviser tom eller for kort endring selv om opprinnelig tittel er gyldig', () => {
    expect(harUgyldigeDokumenttitler(dokumenter, { 'dokument-1': '' })).toBe(true)
    expect(harUgyldigeDokumenttitler(dokumenter, { 'dokument-2': ' ab ' })).toBe(true)
  })

  it('godtar alle dokumenter når ugyldig opprinnelig tittel er rettet', () => {
    expect(harUgyldigeDokumenttitler([{ ...dokumenter[0], tittel: '' }], { 'dokument-1': 'Ny tittel' })).toBe(false)
  })
})
