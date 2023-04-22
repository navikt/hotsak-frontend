import { Dayjs } from 'dayjs'

import { lagTilfeldigFødselsdato, lagTilfeldigInteger } from './felles'

/**
 * NB! Implementasjonen lager ikke gyldige fødselsnumre.
 */
export function lagTilfeldigFødselsnummer(fødselsdatoEllerAlder: Dayjs | number): string {
  if (typeof fødselsdatoEllerAlder === 'number') {
    fødselsdatoEllerAlder = lagTilfeldigFødselsdato(fødselsdatoEllerAlder)
  }
  return fødselsdatoEllerAlder.format('DDMMYY') + lagTilfeldigInteger(0, 99999).toString().padStart(5, '0')
}
