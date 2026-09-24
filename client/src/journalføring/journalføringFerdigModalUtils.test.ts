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
  it('gir ekstern-fagsak når «Til saken» skal skjules', () => {
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
    const modell = lagJournalføringFerdigModalmodell('ekstern-fagsak')

    expect(modell.melding).toBe(
      'Dokumentene ble journalført og knyttet til en eksisterende fagsak. Saken kan behandles videre i Gosys.'
    )
    expect(modell.tilSakenKnappetekst).toBeUndefined()
  })

  it('viser koblingsmelding og «Gå til saken» for eksisterende Hotsak-sak', () => {
    const modell = lagJournalføringFerdigModalmodell('eksisterende-hotsak')

    expect(modell.melding).toBe(
      'Dokumentene ble journalført og knyttet til en eksisterende sak i Hotsak. Du kan nå gå til dine oppgaver, enhetens oppgaver eller fortsette behandlingen av saken.'
    )
    expect(modell.tilSakenKnappetekst).toBe('Gå til saken')
  })

  it('viser «Behandle saken» for ny sak på min oppgaveliste', () => {
    const modell = lagJournalføringFerdigModalmodell('ny-sak', 'minOppgaveliste')

    expect(modell.tilSakenKnappetekst).toBe('Behandle saken')
  })

  it.each(['enhetensOppgaveliste', 'medarbeidersOppgaveliste'] as const)(
    'viser «Gå til saken» for ny sak på %s',
    (tilordnetEnhet) => {
      const modell = lagJournalføringFerdigModalmodell('ny-sak', tilordnetEnhet)

      expect(modell.tilSakenKnappetekst).toBe('Gå til saken')
    }
  )

  it('viser «Gå til saken» for ny sak uten tilordningsvalg', () => {
    const modell = lagJournalføringFerdigModalmodell('ny-sak')

    expect(modell.tilSakenKnappetekst).toBe('Gå til saken')
  })
})
