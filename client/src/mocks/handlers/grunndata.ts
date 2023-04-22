import { graphql } from 'msw'

import type { StoreHandlersFactory } from '../data'
import grunndata from '../data/grunndataGraphQL.json'

export const grunndataHandlers: StoreHandlersFactory = () => [
  graphql.query('HentProdukt', (req, res, ctx) => {
    const { hmsnr } = req.variables
    const filtrert = grunndata.filter((produkt) => produkt.hmsnr === hmsnr)
    return res(ctx.data({ produkter: filtrert }))
  }),
]
