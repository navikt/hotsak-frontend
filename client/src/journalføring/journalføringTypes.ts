import type { Tema } from '../kodeverk/kodeverkTypes.ts'
import type { Oppgaveprioritet, Oppgavetype, Statuskategori } from '../oppgave/oppgaveTypes.ts'

export interface JournalføringV2SkjemaVerdier {
  tema: Tema
  behandlingstype: string
  behandlingstema: string
  stønadsklassifisering: string
  stønadsUnderkategori: string
  stønadType: string
  prioritet: Oppgaveprioritet
  kommentar: string
  mottattDato: string
  aktivFra: string
  frist: string
  journalføresPåFnr: string
  tilordnetEnhet: 'minOppgaveliste' | 'enhetensOppgaveliste' | 'medarbeidersOppgaveliste'
  enhetsmappe: string
  medarbeider: string
}

export type SakstypeKode = 'A' | 'K' | 'KT' | 'R' | 'S' | 'T'

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
  sakstyper: SakstypeKode[]
  stk3?: Stk3
}

export interface Stønadsklassifisering {
  tema: string
  stk1: string
  stk2: Stk2[]
  stk3: unknown[]
}

export type JournalførJournalpostRequest = Omit<JournalføringV2Request, 'dokumenter' | 'saksgrunnlag'>

export interface JournalførJournalpostResponse {
  sakId: string
  /**
   * Id for behandle sak-oppgaven som følger journalføring.
   */
  oppgaveId?: string
}

export interface JournalføringV2Saksgrunnlag {
  tema: Tema
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
  oppgaveId: string
  journalpostId: string
  tittel: string
  journalføresPåFnr: string
  saksgrunnlag?: JournalføringV2Saksgrunnlag
  sakId?: string
  fagsaksystem?: string
  dokumenter: Array<{ dokumentId: string; tittel: string; annetInnhold: string[] }>
}

export interface JournalføringV2Response {
  sakId: string
  journalpostId?: string
  oppgavegrunnlagId?: string
  oppgaver: Array<{
    oppgaveId: string
    oppgavetype: Oppgavetype
    statuskategori: Statuskategori
    isÅpen: boolean
    isAvsluttet: boolean
  }>
}
