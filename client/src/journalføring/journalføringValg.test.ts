import { describe, expect, it } from 'vitest'

import { Sakstype } from './journalføringTypes.ts'
import { byggJournalføringSak, finnTildeltSaksbehandler } from './journalføringValg.ts'

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
