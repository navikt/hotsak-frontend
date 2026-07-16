import type { OppgaveId } from '../oppgave/oppgaveTypes'
import type { NavIdent } from '../tilgang/Ansatt'
import type { Brevtype } from '../types/types.internal'

export interface BrevMetadata {
  id: string
  type: Brevtype
  status: Brevstatus
  oppdatert?: string
  opprettet: string
  behandlingId: string
  sendt?: string
}

export const Brevstatus = {
  UTKAST: 'UTKAST',
  FERDIGSTILT: 'FERDIGSTILT',
  JOURNALFØRT: 'JOURNALFØRT',
  TIL_DISTRIBUSJON: 'TIL_DISTRIBUSJON',
  DISTRIBUERT: 'DISTRIBUERT',
} as const
export type Brevstatus = Enum<typeof Brevstatus>

export const Brevmal = {
  // Breveditor
  BREVEDITOR_VEDTAKSBREV: 'BREVEDITOR_VEDTAKSBREV',

  // Barnebriller
  BARNEBRILLER_INNHENTE_OPPLYSNINGER: 'BARNEBRILLER_INNHENTE_OPPLYSNINGER',
  BARNEBRILLER_VEDTAK_INNVILGELSE: 'BARNEBRILLER_VEDTAK_INNVILGELSE',
  BARNEBRILLER_VEDTAK_AVSLAG: 'BARNEBRILLER_VEDTAK_AVSLAG',
  BARNEBRILLER_VEDTAK_AVSLAG_MANGLENDE_OPPLYSNINGER: 'BARNEBRILLER_VEDTAK_AVSLAG_MANGLENDE_OPPLYSNINGER',
} as const
export type Brevmal = Enum<typeof Brevmal>

export const Mottakertype = {
  BRUKER: 'BRUKER',
  VERGE: 'VERGE',
  FORMIDLER: 'FORMIDLER',
} as const
export type Mottakertype = Enum<typeof Mottakertype>

export const Målform = {
  BOKMÅL: 'BOKMÅL',
  NYNORSK: 'NYNORSK',
} as const
export type Målform = Enum<typeof Målform>

export interface UtsendingsInfo {
  varselSendt: {
    type: string
    tittel: string
    adresse: string
    tidspunkt: string
  }[]
  fysiskpostSendt: string
  digitalpostSendt: string
}

export type Brevdata = Record<string, unknown>

export interface Brevutkast<T extends Brevdata = Brevdata> {
  brevmal: Brevmal
  brevmalVersjon: '0' | string
  målform: Målform
  data: T
}

export interface Brev<T extends Brevdata = Brevdata> extends Brevutkast<T> {
  brevId: string
  sakId: string
  behandlingId?: string
  opprettet: Instant
  opprettetAv?: NavIdent
  endret?: Instant
  endretAv?: NavIdent
  ferdigstilt?: Instant
  ferdigstiltAv?: NavIdent
  brevstatus: Brevstatus
  distribusjon: Brevdistribusjon[]
  serienummer: number
}

export interface Brevdistribusjon {
  brevId: string
  mottakertype: Mottakertype
  fnr: string
  journalført?: Instant
  journalpostId?: string
  skalDistribueres?: boolean
  distribusjonId?: string
  distribuert?: Instant
}

export interface OpprettBrevutkastRequest<T extends Brevdata = Brevdata> {
  brevutkast: Brevutkast<T>
  behandlingId?: string
}

export interface OppdaterBrevutkastRequest<T extends Brevdata = Brevdata> {
  brevutkast: Brevutkast<T>
  serienummer: number
}

export interface FerdigstillBrevutkastRequest {
  oppgaveId: OppgaveId
}

export interface BrevForSak {
  brev: Brev[]
}
