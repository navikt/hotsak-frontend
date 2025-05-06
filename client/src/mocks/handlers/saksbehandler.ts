import { http, HttpResponse } from 'msw'

import type { StoreHandlersFactory } from '../data'
import type { InnloggetSaksbehandler } from '../../state/authentication.ts'
import { delay } from './response.ts'

export const saksbehandlerHandlers: StoreHandlersFactory = ({ saksbehandlerStore }) => [
  http.get<never, never, InnloggetSaksbehandler>('/api/saksbehandler', async () => {
    const innloggetSaksbehandler = await saksbehandlerStore.innloggetSaksbehandler()
    await delay(75)
    return HttpResponse.json(innloggetSaksbehandler)
  }),
]
