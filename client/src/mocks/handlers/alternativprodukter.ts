import { graphql, HttpResponse } from 'msw'

import alternativeProdukter from '../data/alternativProducts.json'
import type { StoreHandlersFactory } from '../data'

export const alternativprodukterHandlers: StoreHandlersFactory = () => [
  graphql.query('SjekkLagerstatusForProdukt', async ({ variables }) => {
    const { hmsnr } = variables
    console.log('Mock for sjekk å oppdatere lagerstatus for HMS-nr:', hmsnr)
    await new Promise((resolve) => setTimeout(resolve, 2000)) // simulerer at OeBS er tregt
    return HttpResponse.json({})
  }),
  graphql.query('SjekkLagerstatus', async ({ variables }) => {
    const { hmsnrs } = variables
    console.log('Mock for sjekk å oppdatere lagerstatus for HMS-nr:', hmsnrs)
    await new Promise((resolve) => setTimeout(resolve, 2000)) // simulerer at OeBS er tregt

    return HttpResponse.json({})
  }),
  graphql.query('FinnAlternativeProdukterSide', async ({ variables }) => {
    const { hmsnrs } = variables
    const content = alternativeProdukter.data.alternativeProducts.map((produkt: any) => ({
      ...produkt,
      alternativeFor: hmsnrs,
    }))

    return HttpResponse.json({ data: { alternativeProductsPage: { content } } })
  }),
]
