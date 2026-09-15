import { describe, expect, it } from 'vitest'

import { Sakstype } from './journalføringTypes.ts'
import { byggJournalføringSak } from './journalføringValg.ts'

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
