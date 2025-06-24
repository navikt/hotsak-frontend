import { graphql, HttpResponse } from 'msw'
import alternativeProdukter from '../data/alternativProducts.json'

import type { StoreHandlersFactory } from '../data'

export const finnAlternativProduktHandlers: StoreHandlersFactory = () => [
  graphql.query('SjekkLagerstatus', async ({ variables }) => {
    const { hmsnrs, enhetnr } = variables
    console.log('Mock for sjekk å oppdatere lagerstatus for HMS-nr:', hmsnrs, 'på enhet:', enhetnr)
    await new Promise((resolve) => setTimeout(resolve, 2000)) // simulerer at OeBS er tregt
    return HttpResponse.json({
      data: {
        productStocs: [
          {
            hmsArtNr: '199200',
            id: '4b48b40f-a875-42a0-9622-6cac479bfec1',
            status: 'ACTIVE',
            warehouseStock: [
              {
                location: 'Nord-Trøndelag',
                minmax: false,
                available: 0,
              },
            ],
          },
        ],
      },
    })
  }),
  graphql.query('FinnAlternativer', async ({ variables }) => {
    const { hmsnrs } = variables
    const produkterMedAlternativeFor = alternativeProdukter.data.alternativeProducts.map((produkt: any) => ({
      ...produkt,
      alternativeFor: hmsnrs,
    }))

    return HttpResponse.json({ data: { alternativeProducts: produkterMedAlternativeFor } })
  }),
]
