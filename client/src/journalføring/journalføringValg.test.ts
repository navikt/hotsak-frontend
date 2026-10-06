import { describe, expect, it } from 'vitest'

import { type Journalpost, JournalpostStatusType } from '../types/types.internal.ts'
import { Sakstype } from './journalføringTypes.ts'
import { byggDokumentPayload, byggJournalføringSak, finnTildeltSaksbehandler } from './journalføringValg.ts'

const journalpost: Journalpost = {
  journalpostId: 'journalpost-1',
  journalpostOpprettetTid: '2026-01-01T12:00:00Z',
  tittel: ' Overordnet tittel ',
  tema: { kode: 'HJE', term: 'Hjelpemidler' },
  kanal: { kode: 'SKAN_IM', term: 'Skanning' },
  fnrInnsender: '',
  journalstatus: JournalpostStatusType.MOTTATT,
  journalposttype: 'I',
  dokumenter: [
    { journalpostId: 'journalpost-1', dokumentId: 'dokument-1', tittel: ' Første tittel ', logiskeVedlegg: [] },
    { journalpostId: 'journalpost-1', dokumentId: 'dokument-2', tittel: ' Andre tittel ', logiskeVedlegg: [] },
  ],
  innsender: { fnr: '', navn: { fornavn: 'Test', etternavn: 'Test' } },
}

describe('byggDokumentPayload', () => {
  it('trimmer endret og opprinnelig dokumenttittel før innsending', () => {
    expect(
      byggDokumentPayload(journalpost, { 'dokument-1': ' \tNy  tittel\n' }, { 'dokument-2': ['Vedlegg'] })
    ).toEqual({
      tittel: 'Ny  tittel',
      dokumenter: [
        { dokumentId: 'dokument-1', tittel: 'Ny  tittel', annetInnhold: [] },
        { dokumentId: 'dokument-2', tittel: 'Andre tittel', annetInnhold: ['Vedlegg'] },
      ],
    })
  })

  it('trimmer journalposttittelen når dokumentlisten er tom', () => {
    expect(byggDokumentPayload({ ...journalpost, dokumenter: [] }, {}, {})).toEqual({
      tittel: 'Overordnet tittel',
      dokumenter: [],
    })
  })
})

describe('finnTildeltSaksbehandler', () => {
  it('bruker innlogget ansatt ved tilordning til min oppgaveliste', () => {
    expect(finnTildeltSaksbehandler('minOppgaveliste', 'ansatt-1')).toBe('ansatt-1')
  })

  it('bruker valgt medarbeider ved tilordning til medarbeiders oppgaveliste', () => {
    expect(finnTildeltSaksbehandler('medarbeidersOppgaveliste', 'ansatt-1', 'ansatt-2')).toBe('ansatt-2')
  })

  it('utelater saksbehandler ved tilordning til enhetens oppgaveliste', () => {
    expect(finnTildeltSaksbehandler('enhetensOppgaveliste', 'ansatt-1', 'ansatt-2')).toBeUndefined()
  })
})

describe('byggJournalføringSak', () => {
  it('bygger sak for Gosys generell uten fagsakfelter', () => {
    expect(byggJournalføringSak({ sakstype: Sakstype.GENERELL_SAK })).toEqual({
      sakstype: Sakstype.GENERELL_SAK,
    })
  })

  it('beholder fagsakfeltene for eksisterende saker', () => {
    expect(
      byggJournalføringSak({
        sakstype: Sakstype.FAGSAK,
        sakId: '1234A01',
        fagsaksystem: 'IT01',
      })
    ).toEqual({
      sakstype: Sakstype.FAGSAK,
      fagsakId: '1234A01',
      fagsaksystem: 'IT01',
    })
  })
})
