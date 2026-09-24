import { type OppgaveId, Oppgavetype, Statuskategori } from '../oppgave/oppgaveTypes.ts'
import { type JournalføringV2Response, type TilordnetEnhet } from './journalføringTypes.ts'

export type JournalføringFerdigVariant = 'ny-sak' | 'eksisterende-hotsak' | 'ekstern-fagsak'

export interface JournalføringFerdigModalmodell {
  tittel: string
  melding: string
  tilSakenKnappetekst?: 'Behandle saken' | 'Gå til saken'
}

export function finnModalvariant(sakType: 'ny' | 'eksisterende', skjulTilSaken = false): JournalføringFerdigVariant {
  if (skjulTilSaken) return 'ekstern-fagsak'
  return sakType === 'ny' ? 'ny-sak' : 'eksisterende-hotsak'
}

export function lagJournalføringFerdigModalmodell(
  variant: JournalføringFerdigVariant,
  tilordnetEnhet?: TilordnetEnhet
): JournalføringFerdigModalmodell {
  switch (variant) {
    case 'ekstern-fagsak':
      return {
        tittel: 'Dokumentene ble knyttet til eksisterende sak',
        melding:
          'Dokumentene ble journalført og knyttet til en eksisterende fagsak. Saken kan behandles videre i Gosys.',
      }
    case 'eksisterende-hotsak':
      return {
        tittel: 'Dokumentene ble knyttet til eksisterende sak',
        melding: `Dokumentene ble journalført og knyttet til en eksisterende sak i Hotsak. Du kan nå gå til dine oppgaver, enhetens oppgaver eller fortsette behandlingen av saken.`,
        tilSakenKnappetekst: 'Gå til saken',
      }
    case 'ny-sak':
      return {
        tittel: 'Journalføringen er fullført og ny sak er opprettet',
        melding: `Du kan nå gå til til dine oppgaver, enhetens oppgaver eller fortsette behandling av saken.`,
        tilSakenKnappetekst: tilordnetEnhet === 'minOppgaveliste' ? 'Behandle saken' : 'Gå til saken',
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
