import { type Målform } from '../../brev/brevTyper'
import { type ISvar } from '../../innsikt/Besvarelse'
import { type Saksbehandler } from '../../types/types.internal'

export const NotatKlassifisering = {
  INTERNE_SAKSOPPLYSNINGER: 'INTERNE_SAKSOPPLYSNINGER',
  EKSTERNE_SAKSOPPLYSNINGER: 'EKSTERNE_SAKSOPPLYSNINGER',
} as const

export type NotatKlassifisering = keyof typeof NotatKlassifisering

export const NotatType = {
  KOMMENTAR: 'KOMMENTAR',
  INTERNT: 'INTERNT',
  JOURNALFØRT: 'JOURNALFØRT',
} as const

export type NotatType = keyof typeof NotatType

export interface Saksnotater {
  notater: Notat[]
  totalElements: number
}

export interface Notat {
  id: string
  sakId: string
  saksbehandler: Saksbehandler
  klassifisering?: NotatKlassifisering | null
  type: NotatType
  tittel: string
  tekst: string
  opprettet: string
  oppdatert: string
  ferdigstilt?: string
  feilregistrert?: string
  journalpostId?: string
  dokumentId?: string
  målform: Målform
}

export interface NotatFormValues {
  tittel: string
  tekst: string
}

export interface ForvaltningsnotatFormValues extends NotatFormValues {
  klassifisering?: NotatKlassifisering | null
  bekreftSynlighet: boolean
}

interface NotatRequest {
  type: NotatType
  tittel: string
  tekst: string
  målform: Målform
  klassifisering?: NotatKlassifisering | null
}

export type OpprettNotatRequest = NotatRequest

export type OppdaterNotatRequest = NotatRequest

export type FerdigstillNotatRequest = NotatRequest | undefined

export interface FeilregistrerNotatRequest {
  tilbakemelding?: ISvar[]
}
