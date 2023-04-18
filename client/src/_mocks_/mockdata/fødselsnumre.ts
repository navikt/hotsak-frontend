import { Dayjs } from 'dayjs'

import { lagTilfeldigFødselsdato, lagTilfeldigInteger } from './felles'

/**
 * NB! Implementasjonen lager ikke gyldige fødselsnumre.
 */
export function lagTilfeldigFødselsnummer(fødselsdato: Dayjs | number): string {
  if (typeof fødselsdato === 'number') {
    fødselsdato = lagTilfeldigFødselsdato(fødselsdato)
  }
  return fødselsdato.format('DDMMYY') + lagTilfeldigInteger(0, 99999).toString().padStart(5, '0')
}
