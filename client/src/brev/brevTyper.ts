import type { OppgaveId } from '../oppgave/oppgaveTypes'
import type { NavIdent } from '../tilgang/Ansatt'
import type { StilarkVersjon } from './breveditor/html/byggDokument.ts'

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
  BREVEDITOR_SVARTIDSBREV: 'BREVEDITOR_SVARTIDSBREV',

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

export interface Brevmottaker {
  id: string
  fnr: string
  mottakertype: Mottakertype
  brevId: string
  opprettet: Instant
  opprettetAv: NavIdent
  kanSlettes: boolean
}

export const BrevmalTekst = {
  [Brevmal.BREVEDITOR_VEDTAKSBREV]: 'Vedtaksbrev',
  [Brevmal.BREVEDITOR_SVARTIDSBREV]: 'Svartidsbrev',
  [Brevmal.BARNEBRILLER_INNHENTE_OPPLYSNINGER]: 'Barnebrillebrev',
  [Brevmal.BARNEBRILLER_VEDTAK_INNVILGELSE]: 'Barnebrillebrev',
  [Brevmal.BARNEBRILLER_VEDTAK_AVSLAG]: 'Barnebrillebrev',
  [Brevmal.BARNEBRILLER_VEDTAK_AVSLAG_MANGLENDE_OPPLYSNINGER]: 'Barnebrillebrev',
} as const

export function brevstatusTekst(status: Brevstatus): string {
  switch (status) {
    case Brevstatus.UTKAST:
      return 'Utkast'
    case Brevstatus.FERDIGSTILT:
      return 'Ferdigstilt'
    case Brevstatus.JOURNALFØRT:
      return 'Journalført'
    case Brevstatus.TIL_DISTRIBUSJON:
      return 'Til distribusjon'
    case Brevstatus.DISTRIBUERT:
      return 'Sendt'
  }
}

export interface BrevmottakerResponse {
  brevmottakere: Brevmottaker[]
}

export interface LeggTilMottakerRequest {
  fnr: string
  mottakertype: Mottakertype
}

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
  brevmalVersjon: StilarkVersjon
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
