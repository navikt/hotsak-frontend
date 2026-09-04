import { describe, expect, it } from 'vitest'

import { Oppgavetype, Statuskategori } from '../oppgave/oppgaveTypes.ts'
import type { JournalføringV2Response } from './journalføringTypes.ts'
import {
  finnModalvariant,
  finnOppgaveIdForSak,
  finnStiTilSak,
  lagJournalføringFerdigModalmodell,
} from './journalføringFerdigModalUtils.ts'

const resultat: JournalføringV2Response = {
  sakId: 'sak-1',
  oppgaver: [
    {
      oppgaveId: 'ferdig-behandle-sak',
      oppgavetype: Oppgavetype.BEHANDLE_SAK,
      statuskategori: Statuskategori.AVSLUTTET,
      isÅpen: false,
      isAvsluttet: true,
    },
    {
      oppgaveId: 'annen-oppgave',
      oppgavetype: Oppgavetype.GODKJENNE_VEDTAK,
      statuskategori: Statuskategori.ÅPEN,
      isÅpen: true,
      isAvsluttet: false,
    },
    {
      oppgaveId: 'åpen-behandle-sak',
      oppgavetype: Oppgavetype.BEHANDLE_SAK,
      statuskategori: Statuskategori.ÅPEN,
      isÅpen: true,
      isAvsluttet: false,
    },
  ],
}

describe('finnOppgaveIdForSak', () => {
  it('finner den åpne behandle-sak-oppgaven for eksisterende sak', () => {
    expect(finnOppgaveIdForSak(resultat)).toBe('åpen-behandle-sak')
  })
})

describe('finnStiTilSak', () => {
  it('navigerer til den åpne behandle-sak-oppgaven når den finnes', () => {
    expect(finnStiTilSak(resultat)).toBe('/oppgave/åpen-behandle-sak')
  })

  it('navigerer til saken når det ikke finnes en åpen behandle-sak-oppgave', () => {
    const resultatUtenÅpenBehandleSak = {
      ...resultat,
      oppgaver: resultat.oppgaver.filter(({ oppgaveId }) => oppgaveId !== 'åpen-behandle-sak'),
    }

    expect(finnStiTilSak(resultatUtenÅpenBehandleSak)).toBe('/sak/sak-1')
  })
})

describe('finnModalvariant', () => {
  it('gir ekstern-fagsak uavhengig av sakType når eksternFagsak er sann', () => {
    expect(finnModalvariant('eksisterende', true)).toBe('ekstern-fagsak')
    expect(finnModalvariant('ny', true)).toBe('ekstern-fagsak')
  })

  it('gir ny-sak for ny sak uten ekstern fagsak', () => {
    expect(finnModalvariant('ny', false)).toBe('ny-sak')
  })

  it('gir eksisterende-hotsak for eksisterende sak uten ekstern fagsak', () => {
    expect(finnModalvariant('eksisterende', false)).toBe('eksisterende-hotsak')
  })
})

describe('lagJournalføringFerdigModalmodell', () => {
  it('viser Gosys-melding og skjuler «Til saken» for ekstern fagsak', () => {
    const modell = lagJournalføringFerdigModalmodell('ekstern-fagsak', 'sak-1')

    expect(modell.melding).toBe('Journalføringen er fullført. Saken kan behandles videre i Gosys.')
    expect(modell.visTilSaken).toBe(false)
  })

  it('viser koblingsmelding og «Til saken» for eksisterende Hotsak-sak', () => {
    const modell = lagJournalføringFerdigModalmodell('eksisterende-hotsak', 'sak-1')

    expect(modell.melding).toBe('Journalposten ble koblet til sak sak-1.')
    expect(modell.visTilSaken).toBe(true)
  })

  it('viser opprettelsesmelding og «Til saken» for ny sak', () => {
    const modell = lagJournalføringFerdigModalmodell('ny-sak', 'sak-1')

    expect(modell.melding).toBe('Sak med sakId sak-1 ble opprettet.')
    expect(modell.visTilSaken).toBe(true)
  })

  it('faller tilbake til «–» når sakId mangler', () => {
    expect(lagJournalføringFerdigModalmodell('ny-sak').melding).toBe('Sak med sakId – ble opprettet.')
  })
})
