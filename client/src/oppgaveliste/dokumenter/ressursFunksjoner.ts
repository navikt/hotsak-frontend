import { Ressurs, RessursStatus } from '../../types/types.internal'

export const byggTomRessurs = <T>(): Ressurs<T> => {
  return {
    status: RessursStatus.IKKE_HENTET,
  }
}

export const byggDataRessurs = <T>(data: T): Ressurs<T> => {
  return {
    status: RessursStatus.SUKSESS,
    data,
  }
}

export const byggFeiletRessurs = <T>(frontendFeilmelding: string): Ressurs<T> => {
  return {
    frontendFeilmelding,
    status: RessursStatus.FEILET,
  }
}

export const byggHenterRessurs = <T>(): Ressurs<T> => {
  return {
    status: RessursStatus.HENTER,
  }
}
