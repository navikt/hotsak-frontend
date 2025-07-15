import Dexie, { Table } from 'dexie'

import type { HMDBFinnHjelpemiddelprodukterQuery } from '../../generated/grunndata.ts'
import products from './products.json'

type LagretHjelpemiddel = HMDBFinnHjelpemiddelprodukterQuery['products'][0]

export class HjelpemiddelStore extends Dexie {
  private readonly hjelpemidler!: Table<LagretHjelpemiddel, string>

  constructor() {
    super('HjelpemiddelStore')
    this.version(1).stores({
      hjelpemidler: 'hmsArtNr',
    })
  }

  async populer() {
    const count = await this.hjelpemidler.count()
    if (count !== 0) {
      return []
    }
    return this.hjelpemidler.bulkAdd(products.data.products, { allKeys: true }).catch(console.warn)
  }

  async finn(hmsnrs: string[]) {
    const hjelpemidler = await this.alle()
    const filtrerteHjelpemidler = hjelpemidler.filter(
      (hjelpemiddel) => hjelpemiddel.hmsArtNr && hmsnrs.includes(hjelpemiddel?.hmsArtNr)
    )

    return filtrerteHjelpemidler.length > 0 ? filtrerteHjelpemidler : mockHjelpemiddel
  }

  async alle() {
    return this.hjelpemidler.toArray()
  }

  async hent(hmsnr: string) {
    return (await this.hjelpemidler.get(hmsnr)) || mockHjelpemiddel
  }
}
const mockHjelpemiddel = {
  hmsArtNr: '112233',
  articleName: 'Hjelpemiddelnavn',
  isoCategoryTitle: 'ISO-kategori',
  productVariantURL: 'https://finnhjelpemiddel.nav.no/produkt/HMDB-65088',
  agreements: [
    {
      postTitle: 'Post 42: Posttittel',
    },
  ],
}
