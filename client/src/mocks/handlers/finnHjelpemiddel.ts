import { graphql, HttpResponse } from 'msw'

import type { StoreHandlersFactory } from '../data'

export const finnHjelpemiddelHandlers: StoreHandlersFactory = ({ hjelpemiddelStore }) => [
  graphql.query('HentProdukter', async ({ variables }) => {
    const { hmsnrs } = variables
    const hjelpemidler = (await hjelpemiddelStore.finn(hmsnrs)) || []

    return HttpResponse.json({
      data: { products: hjelpemidler },
    })
  }),
]
