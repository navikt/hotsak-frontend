import { describe, expect, it } from 'vitest'

import { Oppgavetype, Statuskategori } from '../oppgave/oppgaveTypes.ts'
import type { JournalføringV2Response } from './journalføringTypes.ts'
import { finnOppgaveIdForSak, finnStiTilSak } from './JournalføringFerdigModal.tsx'

const resultat: JournalføringV2Response = {
  sakId: 'sak-1',
  oppgaveId: 'ny-sak-oppgave',
  oppgaver: [
    {
      oppgaveId: 'ferdig-behandle-sak',
      oppgavetype: Oppgavetype.BEHANDLE_SAK,
      statuskategori: Statuskategori.AVSLUTTET,
      isÅpen: false,
    },
    {
      oppgaveId: 'annen-oppgave',
      oppgavetype: Oppgavetype.GODKJENNE_VEDTAK,
      statuskategori: Statuskategori.ÅPEN,
      isÅpen: true,
    },
    {
      oppgaveId: 'åpen-behandle-sak',
      oppgavetype: Oppgavetype.BEHANDLE_SAK,
      statuskategori: Statuskategori.ÅPEN,
      isÅpen: true,
    },
  ],
}

describe('finnOppgaveIdForSak', () => {
  it('finner den åpne behandle-sak-oppgaven for eksisterende sak', () => {
    expect(finnOppgaveIdForSak(resultat)).toBe('åpen-behandle-sak')
  })

  it('bruker oppgaven som ble opprettet for ny sak', () => {
    expect(finnOppgaveIdForSak(resultat)).toBe('ny-sak-oppgave')
  })

  it('navigerer til saken når det ikke finnes en åpen behandle-sak-oppgave', () => {
    const resultatUtenÅpenBehandleSak = {
      ...resultat,
      oppgaver: resultat.oppgaver.filter(({ oppgaveId }) => oppgaveId !== 'åpen-behandle-sak'),
    }

    expect(finnStiTilSak(resultatUtenÅpenBehandleSak)).toBe('/sak/sak-1')
  })
})
