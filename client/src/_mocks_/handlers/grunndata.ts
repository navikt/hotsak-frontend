import { graphql } from 'msw'

import grunndata from '../mockdata/grunndataGraphQL.json'

const grunndataHandlers = [
  graphql.query('HentProdukt', (req, res, ctx) => {
      const {hmsnr} = req.variables 
      const filtrert = grunndata.filter(produkt => produkt.hmsnr === hmsnr)
    return res(ctx.data({produkter: filtrert}))
  }),
]

export default grunndataHandlers
