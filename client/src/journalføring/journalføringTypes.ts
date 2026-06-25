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

export interface JournalføringV2Saksgrunnlag {
  tema: string
  prioritet: string
  oppgavetype: string
  behandlingstype: string
  behandlingstema: string
  stønadsklassifisering?: string
  stønad?: string
  kommentar?: string
  mottattDato: string
  aktivDato: string
  fristDato: string
  tildeltEnhet: string
  tildeltSaksbehandler?: string
}

export interface JournalføringV2Request {
  saksgrunnlag: JournalføringV2Saksgrunnlag
  sakId?: string
  dokumenter: Array<{ dokumentId: string; tittel: string }>
}

export interface JournalføringV2Response {
  oppgaveId: OppgaveId
  sakId: string
}
