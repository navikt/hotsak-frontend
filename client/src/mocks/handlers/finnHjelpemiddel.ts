import { graphql, HttpResponse } from 'msw'

import type { StoreHandlersFactory } from '../data'

export const finnHjelpemiddelHandlers: StoreHandlersFactory = ({ hjelpemiddelStore }) => [
  graphql.query('HentProdukter', async ({ variables }) => {
    const { hmsnrs } = variables
    const hjelpemiddel = await hjelpemiddelStore.hent(hmsnrs[0])

    /*
    const mockHjelpemiddel = {
      hmsArtNr: '112233',
      articleName: 'Hjelpemiddelnavn',
      isoCategoryTitle: 'ISO kategori',
      productVariantURL: 'https://finnhjelpemiddel.nav.no/produkt/HMDB-65088',
      agreements: [
        {
          postTitle: 'Post 42: Posttittel',
        },
      ],
    }
    */

    return HttpResponse.json({
      data: { products: hjelpemiddel ? [hjelpemiddel] : [] },
    })
  }),
]
