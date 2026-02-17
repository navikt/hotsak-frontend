import { format, parse } from 'date-fns'

import { Kjønn } from '../../types/types.internal'
import { lagTilfeldigFødselsdato, lagTilfeldigInteger } from './felles'

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

  const dag = fnr.slice(0, 2)
  const måned = fnr.slice(2, 4)
  const år = fnr.slice(4, 6)
  const årTall = parseInt(år)

  const fullYear = årTall > 25 ? 1900 + årTall : 2000 + årTall

  return parse(`${dag}${måned}${fullYear}`, 'ddMMyyyy', new Date())
}

export function kjønnFraFødselsnummer(fnr: string): Kjønn {
  return Number(fnr[8]) % 2 === 0 ? Kjønn.KVINNE : Kjønn.MANN
}

export class Fødselsnummer {
  private readonly value: string
  constructor(value: string | number) {
    if (typeof value === 'string') {
      this.value = value
    } else {
      this.value = ''
    }
  }

  fødselsdato() {
    return this.value
  }
}
