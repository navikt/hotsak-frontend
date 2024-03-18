import { delay, http, HttpResponse } from 'msw'

import type { BeregnSatsRequest, BeregnSatsResponse } from '../../types/types.internal'
import { beregnSats } from '../data/beregnSats'
import type { StoreHandlersFactory } from '../data'

export const brillekalkulatorHandlers: StoreHandlersFactory = () => [
  http.post<never, BeregnSatsRequest, BeregnSatsResponse>(
    '/brillekalkulator-api/api/brillesedler',
    async ({ request }) => {
      const brilleseddel = await request.json()
      await delay(500)
      return HttpResponse.json(beregnSats(brilleseddel))
    }
  ),
]
