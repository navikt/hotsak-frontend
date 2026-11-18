import type { Målform } from '../brev/brevTyper.ts'
import type { Tema } from '../kodeverk/kodeverkTypes.ts'
import type { Oppgaveprioritet, Oppgavetype, Statuskategori } from '../oppgave/oppgaveTypes.ts'

export enum OverstyrInnsynsregler {
  VISES_MANUELT_GODKJENT = 'VISES_MANUELT_GODKJENT',
  SKJULES_FEILSENDT = 'SKJULES_FEILSENDT',
  SKJULES_BRUKERS_ONSKE = 'SKJULES_BRUKERS_ONSKE',
}

export type TilordnetEnhet = 'minOppgaveliste' | 'enhetensOppgaveliste' | 'medarbeidersOppgaveliste'

export interface JournalføringSkjemaVerdier {
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
  tilordnetEnhet: TilordnetEnhet
  mappeId?: string
  medarbeider: string
  dokumenterKontrollert: boolean
  overstyrInnsynsregler: OverstyrInnsynsregler | ''
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

export interface JournalføringSaksgrunnlag {
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

export interface SvartidsbrevValg {
  antallUker: number
  målform: Målform
  årsak: string
}

export interface JournalføringRequest {
  oppgaveId: string
  journalpostId: string
  tittel: string
  brukerFnr: string
  avsenderFnr: string
  overstyrInnsynsregler: OverstyrInnsynsregler
  saksgrunnlag?: JournalføringSaksgrunnlag
  svartidsbrev?: {
    antallUker: string
    målform: Målform
    årsak: string
  }
  sak?: {
    sakstype: Sakstype
    fagsakId?: string
    fagsaksystem?: string
  }
  dokumenter: Array<{ dokumentId: string; tittel: string; annetInnhold: string[] }>
}

export enum Sakstype {
  FAGSAK = 'FAGSAK',
  GENERELL_SAK = 'GENERELL_SAK',
}

export interface JournalføringResponse {
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
