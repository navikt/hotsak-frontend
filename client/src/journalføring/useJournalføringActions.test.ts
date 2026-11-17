import { describe, expect, it } from 'vitest'

import { OverstyrInnsynsregler } from './journalføringTypes.ts'
import { byggJournalføringRequest } from './useJournalføringActions.ts'

const journalføring = {
  tittel: 'Søknad',
  brukerFnr: '01010112345',
  overstyrInnsynsregler: OverstyrInnsynsregler.VISES_MANUELT_GODKJENT,
  avsenderFnr: '01010112345',
  dokumenter: [],
}

describe('byggJournalføringRequest', () => {
  it('utelater innsynsregler fra request i prod', () => {
    const request = byggJournalføringRequest(journalføring, 'oppgave-1', 'journalpost-1', true)

    expect(request).not.toHaveProperty('overstyrInnsynsregler')
    expect(request.dokumenter).toEqual([])
  })

  it('inkluderer innsynsregler fra request i andre miljøer', () => {
    const request = byggJournalføringRequest(journalføring, 'oppgave-1', 'journalpost-1', false)

    expect(request.overstyrInnsynsregler).toBe(OverstyrInnsynsregler.VISES_MANUELT_GODKJENT)
  })
})
