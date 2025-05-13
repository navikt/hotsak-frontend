import { http, HttpResponse } from 'msw'

import type { StoreHandlersFactory } from '../data'
import type { InnloggetAnsatt } from '../../tilgang/Ansatt.ts'
import { delay, respondNoContent } from './response.ts'

export const ansatteHandlers: StoreHandlersFactory = ({ saksbehandlerStore }) => [
  http.get<never, never, InnloggetAnsatt>('/api/ansatte/meg', async () => {
    await delay(75)
    const innloggetSaksbehandler = await saksbehandlerStore.innloggetSaksbehandler()
    return HttpResponse.json(innloggetSaksbehandler)
  }),
  http.post<never, { valgtEnhetsnummer: string }>('/api/ansatte/enhet', async () => {
    return respondNoContent()
  }),
]
