import { rest } from 'msw'

import type { StoreHandlersFactory } from '../data'

export const saksbehandlerHandlers: StoreHandlersFactory = ({ saksbehandlerStore }) => [
  rest.get('/api/saksbehandler', async (req, res, ctx) => {
    const innloggetSaksbehandler = await saksbehandlerStore.innloggetSaksbehandler()
    return res(ctx.delay(250), ctx.status(200), ctx.json(innloggetSaksbehandler))
  }),
]
