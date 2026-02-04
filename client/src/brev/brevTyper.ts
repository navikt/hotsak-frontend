import { Brevtype } from '../types/types.internal'

export interface BrevMetadata {
  id: string
  type: Brevtype
  status: Brevstatus
  oppdatert?: string
  opprettet: string
  behandlingId: string
  sendt?: string
}

export enum Brevstatus {
  UTKAST = 'UTKAST',
  FERDIGSTILT = 'FERDIGSTILT',
  UTBOKS = 'UTBOKS',
  SENDT = 'SENDT',
}
