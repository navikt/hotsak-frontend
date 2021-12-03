import { graphql } from 'msw'

import grunndata from '../mockdata/grunndataGraphQL.json'

const grunndataHandlers = [
  graphql.query('HentProdukt', (req, res, ctx) => {
    return res(ctx.data(grunndata))
  }),
]

export default grunndataHandlers
