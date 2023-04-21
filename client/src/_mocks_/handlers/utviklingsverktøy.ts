import { rest } from 'msw'

import { UUID } from '../../types/types.internal'
import { saksbehandlerStore } from '../mockdata/SaksbehandlerStore'

const utviklingsverktøyHandlers = [
  rest.put<{ saksbehandlerId: UUID }>('/utvikling/saksbehandler', async (req, res, ctx) => {
    const { saksbehandlerId } = await req.json()
    await saksbehandlerStore.byttInnloggetSaksbehandler(saksbehandlerId)
    return res(ctx.status(204))
  }),
  rest.get('/utvikling/saksbehandlere', async (req, res, ctx) => {
    const saksbehandlere = await saksbehandlerStore.alle()
    return res(ctx.status(200), ctx.json(saksbehandlere))
  }),
]

export default utviklingsverktøyHandlers
