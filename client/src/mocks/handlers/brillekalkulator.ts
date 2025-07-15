import { http, HttpResponse } from 'msw'

import type { BeregnSatsRequest, BeregnSatsResponse } from '../../types/types.internal'
import { beregnSats } from '../data/beregnSats'
import type { StoreHandlersFactory } from '../data'
import { delay } from './response'

export const brillekalkulatorHandlers: StoreHandlersFactory = () => [
  http.post<never, BeregnSatsRequest, BeregnSatsResponse>('/brille-api/api/brillesedler', async ({ request }) => {
    const brilleseddel = await request.json()
    await delay(500)
    return HttpResponse.json(beregnSats(brilleseddel))
  }),
]
