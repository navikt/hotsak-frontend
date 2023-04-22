import { rest } from 'msw'

import type { UUID } from '../../types/types.internal'
import type { StoreHandlersFactory } from '../data'

export const utviklingsverktøyHandlers: StoreHandlersFactory = ({ saksbehandlerStore }) => [
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
