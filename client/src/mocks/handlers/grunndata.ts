import { graphql, HttpResponse } from 'msw'

import type { StoreHandlersFactory } from '../data'
import { respondNotFound } from './response'

export const grunndataHandlers: StoreHandlersFactory = ({ hjelpemiddelStore }) => [
  graphql.query('FinnHjelpemiddelprodukter', async ({ variables }) => {
    const { hmsnrs } = variables
    if (hmsnrs.some(['404404', '404000'])) {
      return respondNotFound()
    }

    const hjelpemidler = (await hjelpemiddelStore.finn(hmsnrs)) || []

    return HttpResponse.json({
      data: { products: hjelpemidler },
    })
  }),
]
