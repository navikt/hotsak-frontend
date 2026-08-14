import { formatISO } from 'date-fns'
import Dexie, { Table } from 'dexie'

import type { Person } from '../../types/types.internal'
import { lagTilfeldigBosted } from './bosted'
import { lagTilfeldigFødselsdato, lagTilfeldigInteger, lagTilfeldigTelefonnummer } from './felles'
import { kjønnFraFødselsnummer, lagTilfeldigFødselsnummer } from './fødselsnummer'
import { lagTilfeldigNavn } from './navn'

type LagretPerson = Person

export class PersonStore extends Dexie {
  private readonly personer!: Table<LagretPerson, string>

  constructor() {
    super('PersonStore')
    this.version(1).stores({
      personer: 'fnr',
    })
  }

  async populer() {
    const count = await this.personer.count()
    if (count !== 0) {
      return
    }

    const fnr = '20071359671'
    const navn = {
      fornavn: 'Stabil',
      etternavn: 'Person',
    }
    const stabilPerson: Person = {
      fnr,
      navn,
      fødselsdato: formatISO(lagTilfeldigFødselsdato(9), { representation: 'date' }),
      telefonnummer: lagTilfeldigTelefonnummer(),
      kjønn: kjønnFraFødselsnummer(fnr),
      kommune: {
        nummer: '9999',
        navn: lagTilfeldigBosted(),
      },
      isSkjermet: false,
      vergemål: [],
    }

    return this.lagreAlle([stabilPerson])
  }

  async lagreAlle(personer: Person[]) {
    const unikePersoner = [...new Map(personer.map((person) => [person.fnr, person])).values()]
    return this.personer.bulkPut(unikePersoner, { allKeys: true })
  }

  async hent(fnr: string) {
    return this.personer.get(fnr)
  }
}

export function lagPerson(alder: number = lagTilfeldigInteger(5, 95)): Person {
  const fødselsdato = lagTilfeldigFødselsdato(alder)
  const fnr = lagTilfeldigFødselsnummer(fødselsdato)
  const navn = lagTilfeldigNavn()
  return {
    fnr,
    navn,
    fødselsdato: formatISO(fødselsdato, { representation: 'date' }),
    telefonnummer: lagTilfeldigTelefonnummer(),
    kjønn: kjønnFraFødselsnummer(fnr),
    kommune: {
      nummer: '9999',
      navn: lagTilfeldigBosted(),
    },
    isSkjermet: false,
    vergemål: [],
  }
}
