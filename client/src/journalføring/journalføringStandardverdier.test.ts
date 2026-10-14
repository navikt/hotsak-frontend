import { describe, expect, it } from 'vitest'

import { hentJournalføringStandardverdier } from './journalføringStandardverdier.ts'

describe('hentJournalføringStandardverdier', () => {
  it.each(['NAV 10-07.34', 'NAVe 10-07.34'])('returnerer standardverdier for %s', (brevkode) => {
    expect(hentJournalføringStandardverdier(brevkode)).toEqual({
      behandlingstema: 'ab0420',
      behandlingstype: 'ae0034',
      tilordnetEnhet: 'minOppgaveliste',
    })
  })

  it.each(['ukjent brevkode', '__proto__', undefined])('returnerer fallback for %s', (brevkode) => {
    expect(hentJournalføringStandardverdier(brevkode)).toEqual({
      behandlingstema: '',
      behandlingstype: '',
      tilordnetEnhet: 'enhetensOppgaveliste',
    })
  })
})
