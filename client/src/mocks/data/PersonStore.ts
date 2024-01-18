import Dexie, { Table } from 'dexie'

import { HjelpemiddelArtikkel, Person } from '../../types/types.internal'
import { lagTilfeldigBosted } from './bosted'
import { enheter } from './enheter'
import { lagTilfeldigFødselsdato, lagTilfeldigInteger, lagTilfeldigTelefonnummer } from './felles'
import { kjønnFraFødselsnummer, lagTilfeldigFødselsnummer } from './fødselsnummer'
import { lagTilfeldigNavn } from './navn'

type LagretPerson = Person

interface LagretHjelpemiddelArtikkel extends HjelpemiddelArtikkel {
  fnr: string
}

export class PersonStore extends Dexie {
  private readonly personer!: Table<LagretPerson, string>
  private readonly hjelpemidler!: Table<LagretHjelpemiddelArtikkel, string>

  constructor() {
    super('PersonStore')
    this.version(1).stores({
      personer: '++fnr',
      hjelpemidler: 'hmsnr,fnr',
    })
  }

  async populer() {
    const count = await this.personer.count()
    if (count !== 0) {
      return
    }

    const FNR = '20071359671'
    const statbilTestperson: Person = {
      fornavn: 'Stabil',
      etternavn: 'Testbruker',
      fnr: FNR,
      fødselsdato: lagTilfeldigFødselsdato(9).toISODateString(),
      kjønn: kjønnFraFødselsnummer(FNR),
      telefon: lagTilfeldigTelefonnummer(),
      kommune: {
        nummer: '9999',
        navn: lagTilfeldigBosted(),
      },
      enhet: enheter.agder,
    }

    return this.lagreAlle([statbilTestperson])
  }

  async lagreAlle(personer: Person[]) {
    return this.personer.bulkAdd(personer, { allKeys: true })
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
    ...navn,
    fnr,
    fødselsdato: fødselsdato.toISODateString(),
    kjønn: kjønnFraFødselsnummer(fnr),
    telefon: lagTilfeldigTelefonnummer(),
    kommune: {
      nummer: '9999',
      navn: lagTilfeldigBosted(),
    },
    enhet: enheter.agder,
  }
}
