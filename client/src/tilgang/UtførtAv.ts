import type { Ansatt, NavIdent } from './Ansatt'

export type System = string
export type Systemnavn = string

export type UtførtAv = Ansatt | System
export type UtførtAvId = NavIdent | Systemnavn

export function isUtførtAvSystem(utførtAv: UtførtAv): utførtAv is System {
  return typeof utførtAv === 'string'
}

export function isUtførtAvAnsatt(utførtAv: UtførtAv): utførtAv is Ansatt {
  return typeof utførtAv === 'object' && 'id' in utførtAv && 'navn' in utførtAv
}

export function uførtAvId(utførtAv: UtførtAv): UtførtAvId {
  if (isUtførtAvSystem(utførtAv)) {
    return utførtAv
  } else {
    return utførtAv.id
  }
}

export function utførtAvNavn(utførtAv: UtførtAv): string {
  if (isUtførtAvSystem(utførtAv)) {
    return 'Automatisk prosess'
  } else if (isUtførtAvAnsatt(utførtAv)) {
    return utførtAv.navn
  } else {
    return 'Ukjent'
  }
}
