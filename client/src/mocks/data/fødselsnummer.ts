import { Kjønn } from '../../types/types.internal'
import { lagTilfeldigFødselsdato, lagTilfeldigInteger } from './felles'
import { format, parse } from 'date-fns'

const template = 'ddMMyy'

/**
 * NB! Implementasjonen lager ikke gyldige fødselsnumre.
 */
export function lagTilfeldigFødselsnummer(fødselsdatoEllerAlder: Date | number): string {
  if (typeof fødselsdatoEllerAlder === 'number') {
    fødselsdatoEllerAlder = lagTilfeldigFødselsdato(fødselsdatoEllerAlder)
  }
  return format(fødselsdatoEllerAlder, template) + lagTilfeldigInteger(0, 99999).toString().padStart(5, '0')
}

export function fødselsdatoFraFødselsnummer(fnr: string): Date {
  const monthNumber = +fnr.slice(2, 4)
  if (monthNumber >= 81 && monthNumber <= 92) {
    return parse(fnr.slice(0, 2) + (+fnr.charAt(2) - 8) + fnr.slice(3, 6), template, new Date())
  }
  if (monthNumber >= 41 && monthNumber <= 52) {
    return parse(fnr.slice(0, 2) + (+fnr.charAt(2) - 4) + fnr.slice(3, 6), template, new Date())
  }
  return parse(fnr.slice(0, 6), template, new Date())
}

export function kjønnFraFødselsnummer(fnr: string): Kjønn {
  return Number(fnr[8]) % 2 === 0 ? Kjønn.KVINNE : Kjønn.MANN
}
