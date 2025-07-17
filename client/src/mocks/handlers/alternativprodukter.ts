import { graphql, HttpResponse } from 'msw'

// import alternativeProdukter from '../data/alternativeProductsPage_1.json'
import alternativeProdukter from '../data/alternativeProductsPage_2.json'
import type { StoreHandlersFactory } from '../data'

export const alternativprodukterHandlers: StoreHandlersFactory = () => [
  graphql.query('FinnAlternativeProdukterSide', async ({ variables }) => {
    const { hmsnrs } = variables
    const content = alternativeProdukter.data.alternativeProductsPage.content.map((produkt: any) => ({
      ...produkt,
      alternativeFor: hmsnrs,
    }))

    return HttpResponse.json({ data: { alternativeProductsPage: { content } } })
  }),
]
