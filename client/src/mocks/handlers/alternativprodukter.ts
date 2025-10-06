import { delay, graphql, HttpResponse } from 'msw'

import type {
  FinnAlternativeProdukterSideQuery,
  FinnAlternativeProdukterSideQueryVariables,
  HentProduktInfoQuery,
  HentProduktInfoQueryVariables,
} from '../../generated/alternativprodukter.ts'
import { Produktinfo } from '../../saksbilde/hjelpemidler/useAlternativeProdukter.ts'
import type { StoreHandlersFactory } from '../data'
import alternativeProdukter from '../data/alternativeProductsPage_2.json'
import { lagUUID } from '../data/felles.ts'
import produktInfo from '../data/fetchAlternativeProducts.json'

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

  graphql.query<HentProduktInfoQuery, HentProduktInfoQueryVariables>('HentProduktInfo', async ({ variables }) => {
    const { hmsnrs } = variables

    const hmsnrsArray = Array.isArray(hmsnrs) ? hmsnrs : [hmsnrs]

    const produkt = produktInfo.data.fetchAlternativeProducts.at(0)

    const content: Produktinfo[] = hmsnrsArray.map((hmsnr) => {
      return {
        ...produkt,
        id: produkt!.id ?? lagUUID(),
        hmsArtNr: hmsnr,
      }
    })

    return HttpResponse.json({
      data: {
        fetchAlternativeProducts: content,
      },
    })
  }),
]
