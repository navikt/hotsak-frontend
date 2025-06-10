import { graphql, HttpResponse } from 'msw'
import alternativeProdukter from '../data/alternativProducts.json'

import type { StoreHandlersFactory } from '../data'

export const finnAlternativProduktHandlers: StoreHandlersFactory = () => [
  graphql.query('FinnAlternativer', async ({ variables }) => {
    const { hmsnrs } = variables
    const produkterMedAlternativeFor = alternativeProdukter.data.alternativeProducts.map((produkt: any) => ({
      ...produkt,
      alternativeFor: hmsnrs,
    }))
    return HttpResponse.json({ data: { alternativeProducts: produkterMedAlternativeFor } })
  }),
]
