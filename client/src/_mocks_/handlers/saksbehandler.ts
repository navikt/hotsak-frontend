import { rest } from 'msw'

import { saksbehandlerStore } from '../mockdata/SaksbehandlerStore'

const saksbehandlerHandlers = [
  rest.get('/api/saksbehandler', async (req, res, ctx) => {
    const innloggetSaksbehandler = await saksbehandlerStore.innloggetSaksbehandler()
    return res(ctx.delay(250), ctx.status(200), ctx.json(innloggetSaksbehandler))
  }),
]

export default saksbehandlerHandlers
