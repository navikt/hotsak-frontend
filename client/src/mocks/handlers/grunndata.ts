import { graphql } from 'msw'

import type { StoreHandlersFactory } from '../data'

export const grunndataHandlers: StoreHandlersFactory = ({ hjelpemiddelStore }) => [
  graphql.query('HentProdukt', async (req, res, ctx) => {
    const { hmsnr } = req.variables
    const hjelpemiddel = await hjelpemiddelStore.hent(hmsnr)
    return res(ctx.data({ produkter: hjelpemiddel ? [hjelpemiddel] : [] }))
  }),
]
