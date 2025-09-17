import Dexie, { Table } from 'dexie'

import {
  HMDBMediaSourceType,
  HMDBMediaType,
  type HMDBFinnHjelpemiddelprodukterQuery,
} from '../../generated/grunndata.ts'
import products from './products.json'
import { lagTilfeldigHmsArtNr, lagUUID } from './felles.ts'

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

    // @ts-ignore
    return this.hjelpemidler.bulkAdd(products.data.products, { allKeys: true }).catch(console.warn)
  }

  async finn(hmsnrs: string[]) {
    const hjelpemidler = await this.alle()
    const filtrerteHjelpemidler = hjelpemidler.filter(
      (hjelpemiddel) => hjelpemiddel.hmsArtNr && hmsnrs.includes(hjelpemiddel.hmsArtNr)
    )

    return filtrerteHjelpemidler.length > 0 ? filtrerteHjelpemidler : [lagHjelpemiddel(hmsnrs[0])]
  }

  async alle() {
    return this.hjelpemidler.toArray()
  }

  async hent(hmsArtNr: string) {
    return (await this.hjelpemidler.get(hmsArtNr)) || lagHjelpemiddel(hmsArtNr)
  }
}

function lagHjelpemiddel(hmsArtNr: string = lagTilfeldigHmsArtNr()): LagretHjelpemiddel {
  return {
    id: lagUUID(),
    articleName: 'Dummyartikkel fra FinnHjelpemiddel for ' + hmsArtNr,
    hmsArtNr,
    isoCategoryTitleShort: 'isoCategoryTitleShort',
    supplier: {
      name: 'Leverandøren AS',
    },
    agreements: [
      {
        postTitle: 'postTitle',
      },
    ],
    media: [
      {
        uri: 'orig/60048.jpg',
        type: HMDBMediaType.Image,
        source: HMDBMediaSourceType.Import,
        priority: 1,
      },
    ],
    productVariantURL: 'https://finnhjelpemiddel.intern.dev.nav.no/produkt/hmsartnr/' + hmsArtNr,
  }
}
