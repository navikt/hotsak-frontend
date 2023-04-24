import Dexie, { Table } from 'dexie'

import { HMDBHentProduktQuery } from '../../generated/hjelpemiddeldatabasen'
import grunndataGraphQL from './grunndataGraphQL.json'

type LagretHjelpemiddel = HMDBHentProduktQuery['produkter'][0]

export class HjelpemiddelStore extends Dexie {
  private readonly hjelpemidler!: Table<LagretHjelpemiddel, string>

  constructor() {
    super('HjelpemiddelStore')
    this.version(1).stores({
      hjelpemidler: 'hmsnr',
    })
  }

  async populer() {
    const count = await this.hjelpemidler.count()
    if (count !== 0) {
      return []
    }
    return this.hjelpemidler.bulkAdd(grunndataGraphQL, { allKeys: true }).catch(console.warn)
  }

  async hent(hmsnr: string) {
    return this.hjelpemidler.get(hmsnr)
  }
}
