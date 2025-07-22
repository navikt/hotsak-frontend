import { delay, graphql, HttpResponse } from 'msw'

// import alternativeProdukter from '../data/alternativeProductsPage_1.json'
import alternativeProdukter from '../data/alternativeProductsPage_2.json'
import type { StoreHandlersFactory } from '../data'
import type {
  FinnAlternativeProdukterSideQuery,
  FinnAlternativeProdukterSideQueryVariables,
} from '../../generated/alternativprodukter.ts'

export const alternativprodukterHandlers: StoreHandlersFactory = () => [
  graphql.query<FinnAlternativeProdukterSideQuery, FinnAlternativeProdukterSideQueryVariables>(
    'FinnAlternativeProdukterSide',
    async ({ variables }) => {
      const { hmsnrs } = variables
      const from = variables.from ?? 0
      const size = variables.size ?? 1000
      const content = alternativeProdukter.data.alternativeProductsPage.content.map((produkt: any) => ({
        ...produkt,
        alternativeFor: hmsnrs,
      }))

      const total = content.length
      // Simulerer henting av lagerstatus hvis antallet produkter returnert er <= 10.
      if (total >= 10 && size <= 10) {
        await delay(1000)
      }

      return HttpResponse.json({
        data: {
          alternativeProductsPage: { total, from, size, content: content.slice(from, from + size) },
        },
      })
    }
  ),
]
