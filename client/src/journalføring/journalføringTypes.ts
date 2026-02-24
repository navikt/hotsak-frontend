import type { OppgaveId } from '../oppgave/oppgaveTypes.ts'

export interface JournalførJournalpostRequest {
  oppgaveId: OppgaveId
  journalpostId: string
  tittel: string
  journalføresPåFnr: string
  sakId?: string
}

export interface JournalførJournalpostResponse {
  /**
   * Id for behandle sak-oppgaven som følger journalføring.
   */
  oppgaveId: OppgaveId
  sakId: string
}
