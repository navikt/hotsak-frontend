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

export enum Brevstatus {
  UTKAST = 'UTKAST',
  FERDIGSTILT = 'FERDIGSTILT',
  UTBOKS = 'UTBOKS',
  SENDT = 'SENDT',
}

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
