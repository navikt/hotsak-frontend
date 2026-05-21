import { isNavIdent, type Ansatt, type NavIdent } from './Ansatt'
import { useAnsatt } from './useAnsatt'

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

export function useUtførtAv(utførtAvId?: UtførtAvId): UtførtAv {
  const { data: ansatt } = useAnsatt(utførtAvId)

  if (utførtAvId && !isNavIdent(utførtAvId)) {
    return 'Automatisk prosess'
  }

  if (ansatt) {
    return {
      id: ansatt.navIdent,
      navn: `${ansatt.fornavn} ${ansatt.etternavn}`,
      epost: ansatt.epost,
    }
  }

  return ''
}
