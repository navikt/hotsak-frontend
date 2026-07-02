import type { OppgaveId, Oppgaveprioritet, Oppgavetype } from '../oppgave/oppgaveTypes.ts'

export interface Stk3 {
  kode: string
  tekst: string
  behandlingstype?: string
  behandlingstema?: string
}

export interface Stk2 {
  kode: string
  tekst: string
  behandlingstype?: string[]
  behandlingstema?: string[]
  sakstyper: string[]
  stk3?: Stk3
}

export interface Stønadsklassifisering {
  tema: string
  stk1: string
  stk2: Stk2[]
  stk3: unknown[]
}

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
  prioritet: Oppgaveprioritet
  oppgavetype: Oppgavetype
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
  mappeId?: string
}

export interface JournalføringV2Request {
  oppgaveId: OppgaveId
  journalpostId: string
  tittel: string
  journalføresPåFnr: string
  saksgrunnlag: JournalføringV2Saksgrunnlag
  sakId?: string
  dokumenter: Array<{ dokumentId: string; tittel: string; annetInnhold: string[] }>
}

export interface JournalføringV2Response {
  oppgaveId: OppgaveId
  sakId: string
}
