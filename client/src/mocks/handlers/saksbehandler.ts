import { delay, http, HttpResponse } from 'msw'

import type { StoreHandlersFactory } from '../data'

export const saksbehandlerHandlers: StoreHandlersFactory = ({ saksbehandlerStore }) => [
  http.get('/api/saksbehandler', async () => {
    const innloggetSaksbehandler = await saksbehandlerStore.innloggetSaksbehandler()
    await delay(250)
    return HttpResponse.json(innloggetSaksbehandler)
  }),
]
