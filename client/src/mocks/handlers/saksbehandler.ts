import { http, HttpResponse } from 'msw'

import type { StoreHandlersFactory } from '../data'
import type { InnloggetAnsatt } from '../../tilgang/Ansatt.ts'
import { delay } from './response.ts'

export const saksbehandlerHandlers: StoreHandlersFactory = ({ saksbehandlerStore }) => [
  http.get<never, never, InnloggetAnsatt>('/api/saksbehandler', async () => {
    await delay(75)
    const innloggetSaksbehandler = await saksbehandlerStore.innloggetSaksbehandler()
    return HttpResponse.json(innloggetSaksbehandler)
  }),
]
