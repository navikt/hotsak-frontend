import { graphql, HttpResponse } from 'msw'

import type { StoreHandlersFactory } from '../data'

export const grunndataHandlers: StoreHandlersFactory = ({ hjelpemiddelStore }) => [
  graphql.query('FinnHjelpemiddelprodukter', async ({ variables }) => {
    const { hmsnrs } = variables
    const hjelpemidler = (await hjelpemiddelStore.finn(hmsnrs)) || []

    return HttpResponse.json({
      data: { products: hjelpemidler },
    })
  }),
]
