import { Ressurs, RessursStatus } from '../types/types.internal'

export function byggTomRessurs<T>(): Ressurs<T> {
  return {
    status: RessursStatus.IKKE_HENTET,
  }
}

export function byggDataRessurs<T>(data: T): Ressurs<T> {
  return {
    status: RessursStatus.SUKSESS,
    data,
  }
}

export function byggFeiletRessurs<T>(frontendFeilmelding: string): Ressurs<T> {
  return {
    frontendFeilmelding,
    status: RessursStatus.FEILET,
  }
}

export function byggHenterRessurs<T>(): Ressurs<T> {
  return {
    status: RessursStatus.HENTER,
  }
}
