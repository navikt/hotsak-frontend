import { rest } from 'msw'

import { innloggetSaksbehandler } from './saksbehandler'

const tilgangHandlers = [
  rest.get('/api/saksbehandler', (req, res, ctx) => {
    return res(ctx.delay(250), ctx.status(200), ctx.json(innloggetSaksbehandler.s1))
  }),
]

export default tilgangHandlers
