import { Dayjs } from 'dayjs'

import { Utbetalingsperiode } from './types.external'

export interface Oppgave {
  opprettetDato: Dayjs
  motattDato: string
  saksid: string
  personinformasjon: Personinfo
  funksjonsnedsettelse: string[]
  status: StatusType
  saksbehandler?: Saksbehandler
  søknadOm: string
}

export interface Saksbehandler {
    oid: string
    epost: string
    navn: string
  }

export enum StatusType {
  MOTTATT = 'mottatt',
  OVERFØRT_GOSYS = 'overført_gosys',
  INNVILGET = 'innvilget',
}

/* ---- */

export interface Error {
    message: string
    statusCode?: number
    technical?: string
  }
  
export type Kjønn = 'mann' | 'kvinne' | 'ukjent'

export interface Personinfo {
  fornavn: string
  mellomnavn: string | null
  etternavn: string
  fødselsdato: string | undefined
  kjønn: Kjønn
  fnr: string
  brukernummer?: string
  adresse: string
  postnummer: string
  poststed: string
  gtNummer: string
  gtType: string
  egenAnsatt: boolean
  brukerErDigital: boolean
}
