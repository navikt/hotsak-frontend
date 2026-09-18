import { type OppgaveId, Oppgavetype, Statuskategori } from '../oppgave/oppgaveTypes.ts'
import { type JournalføringV2Response } from './journalføringTypes.ts'

export type JournalføringFerdigVariant = 'ny-sak' | 'eksisterende-hotsak' | 'ekstern-fagsak'

export interface JournalføringFerdigModalmodell {
  tittel: string
  melding: string
  visTilSaken: boolean
}

export function finnModalvariant(sakType: 'ny' | 'eksisterende', skjulTilSaken = false): JournalføringFerdigVariant {
  if (skjulTilSaken) return 'ekstern-fagsak'
  return sakType === 'ny' ? 'ny-sak' : 'eksisterende-hotsak'
}

export function lagJournalføringFerdigModalmodell(variant: JournalføringFerdigVariant): JournalføringFerdigModalmodell {
  switch (variant) {
    case 'ekstern-fagsak':
      return {
        tittel: 'Dokumentene ble knyttet til eksisterende sak',
        melding:
          'Dokumentene ble journalført og knyttet til en eksisterende fagsak. Saken kan behandles videre i Gosys.',
        visTilSaken: false,
      }
    case 'eksisterende-hotsak':
      return {
        tittel: 'Dokumentene ble knyttet til eksisterende sak',
        melding: `Dokumentene ble journalført og knyttet til en eksisterende sak i Hotsak. Du kan nå gå til dine oppgaver, enhetens oppgaver eller fortsette behandlingen av saken.`,
        visTilSaken: true,
      }
    case 'ny-sak':
      return {
        tittel: 'Journalføringen er fullført og ny sak er opprettet',
        melding: `Du kan nå gå til til dine oppgaver, enhetens oppgaver eller fortsette behandling av saken.`,
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
