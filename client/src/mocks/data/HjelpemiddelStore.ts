import Dexie, { Table } from 'dexie'

import { HMDBHentProdukterQuery } from '../../generated/finnhjelpemiddel'
import products from './products.json'

type LagretHjelpemiddel = HMDBHentProdukterQuery['products'][0]

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

  async hent(hmsnr: string) {
    const hmsArtNr = hmsnr
    return (await this.hjelpemidler.get(hmsArtNr)) || mockHjelpemiddel
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
