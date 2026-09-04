import { type OppgaveId, Oppgavetype, Statuskategori } from '../oppgave/oppgaveTypes.ts'
import { type JournalføringV2Response } from './journalføringTypes.ts'

export type JournalføringFerdigVariant = 'ny-sak' | 'eksisterende-hotsak' | 'ekstern-fagsak'

export interface JournalføringFerdigModalmodell {
  melding: string
  visTilSaken: boolean
}

export function finnModalvariant(sakType: 'ny' | 'eksisterende', eksternFagsak: boolean): JournalføringFerdigVariant {
  if (eksternFagsak) return 'ekstern-fagsak'
  return sakType === 'ny' ? 'ny-sak' : 'eksisterende-hotsak'
}

export function lagJournalføringFerdigModalmodell(
  variant: JournalføringFerdigVariant,
  sakId?: string
): JournalføringFerdigModalmodell {
  switch (variant) {
    case 'ekstern-fagsak':
      return {
        melding: 'Journalføringen er fullført. Saken kan behandles videre i Gosys.',
        visTilSaken: false,
      }
    case 'eksisterende-hotsak':
      return {
        melding: `Journalposten ble koblet til sak ${sakId ?? '–'}.`,
        visTilSaken: true,
      }
    case 'ny-sak':
      return {
        melding: `Sak med sakId ${sakId ?? '–'} ble opprettet.`,
        visTilSaken: true,
      }
  }
}

export function finnOppgaveIdForSak(resultat: JournalføringV2Response | null): OppgaveId | undefined {
  return resultat?.oppgaver.find(
    ({ oppgavetype, statuskategori }) =>
      oppgavetype === Oppgavetype.BEHANDLE_SAK && statuskategori === Statuskategori.ÅPEN
  )?.oppgaveId
}

export function finnStiTilSak(resultat: JournalføringV2Response): string {
  const oppgaveIdForSak = finnOppgaveIdForSak(resultat)
  return oppgaveIdForSak ? `/oppgave/${oppgaveIdForSak}` : `/sak/${resultat.sakId}`
}
