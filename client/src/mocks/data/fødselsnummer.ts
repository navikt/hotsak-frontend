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
  return parse(fnr.slice(0, 6), template, new Date())
}

export function kjønnFraFødselsnummer(fnr: string): Kjønn {
  return Number(fnr[8]) % 2 === 0 ? Kjønn.KVINNE : Kjønn.MANN
}
