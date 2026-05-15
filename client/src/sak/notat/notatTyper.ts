import type { MålformType, Saksbehandler } from '../../types/types.internal'

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
  målform: MålformType
}

export type FerdigstillNotatRequest = Omit<
  Notat,
  'opprettet' | 'oppdatert' | 'ferdigstilt' | 'feilregistrert' | 'journalpostId' | 'saksbehandler'
>

export interface NotatUtkast {
  id?: string
  tittel?: string
  tekst?: string
  type: NotatType
  klassifisering?: NotatKlassifisering | null
}

export interface NotatFormValues {
  tittel: string
  tekst: string
}

export interface ForvaltningsnotatFormValues extends NotatFormValues {
  klassifisering?: NotatKlassifisering | null
  bekreftSynlighet: boolean
}
