import { rest } from 'msw'

import { StoreHandlersFactory } from '../data'
import endringslogg from '../data/endringslogg.json'

const endringsloggKopi: Array<{
  id: string
  dato: string
  tittel: string
  innhold: string
  lest?: string | null
}> = endringslogg.map((innslag) => ({
  ...innslag,
}))

export const endringsloggHandlers: StoreHandlersFactory = () => [
  rest.post<{ endringslogginnslagId: string }>('/api/endringslogg/leste', (req, res, ctx) => {
    const innslag = endringsloggKopi.find(({ id }) => id === req.body.endringslogginnslagId)
    if (innslag) {
      innslag.lest = new Date().toISOString()
    }
    return res(ctx.status(204))
  }),
  rest.get('/api/endringslogg', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(endringsloggKopi))
  }),
]
