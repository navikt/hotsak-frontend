import { HttpResponse } from 'msw'
import { graphql } from 'msw/graphql'

import type {
  HMDBFinnHjelpemiddelprodukterQuery,
  HMDBFinnHjelpemiddelprodukterQueryVariables,
} from '../../generated/grunndata.ts'
import type { StoreHandlersFactory } from '../data'
import { respondNotFound } from './response'

const grunndataGraphql = graphql.link('/grunndata-api/graphql')

export const grunndataHandlers: StoreHandlersFactory = ({ hjelpemiddelStore }) => [
  grunndataGraphql.query<HMDBFinnHjelpemiddelprodukterQuery, HMDBFinnHjelpemiddelprodukterQueryVariables>(
    'FinnHjelpemiddelprodukter',
    async ({ variables }) => {
      const hmsnrs = Array.isArray(variables.hmsnrs) ? variables.hmsnrs : [variables.hmsnrs]
      const ikkeFunnetHmsNr = ['404404', '404000']
      if (hmsnrs.some((hmsnr) => ikkeFunnetHmsNr.includes(hmsnr))) {
        return respondNotFound()
      }

      const hjelpemidler = (await hjelpemiddelStore.finn(hmsnrs)) || []

      return HttpResponse.json({
        data: { products: hjelpemidler },
      })
    }
  ),
]
