import { rest } from 'msw'

import { innloggetSaksbehandler } from '../mockdata/saksbehandlere'

const tilgangHandlers = [
  rest.get('/api/saksbehandler', (req, res, ctx) => {
    return res(ctx.delay(250), ctx.status(200), ctx.json(innloggetSaksbehandler.s1))
  }),
]

export default tilgangHandlers
