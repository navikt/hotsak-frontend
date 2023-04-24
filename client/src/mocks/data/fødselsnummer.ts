import dayjs, { Dayjs } from 'dayjs'

import { Kjønn } from '../../types/types.internal'
import { lagTilfeldigFødselsdato, lagTilfeldigInteger } from './felles'

const template = 'DDMMYY'

/**
 * NB! Implementasjonen lager ikke gyldige fødselsnumre.
 */
export function lagTilfeldigFødselsnummer(fødselsdatoEllerAlder: Dayjs | number): string {
  if (typeof fødselsdatoEllerAlder === 'number') {
    fødselsdatoEllerAlder = lagTilfeldigFødselsdato(fødselsdatoEllerAlder)
  }
  return fødselsdatoEllerAlder.format(template) + lagTilfeldigInteger(0, 99999).toString().padStart(5, '0')
}

export function fødselsdatoFraFødselsnummer(fnr: string): Dayjs {
  return dayjs(fnr.slice(0, 6), template)
}

export function kjønnFraFødselsnummer(fnr: string): Kjønn {
  return Number(fnr[8]) % 2 === 0 ? Kjønn.KVINNE : Kjønn.MANN
}
