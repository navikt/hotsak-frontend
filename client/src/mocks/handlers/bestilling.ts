import { http } from 'msw'

import { Saksstatus } from '../../types/types.internal'
import type { StoreHandlersFactory } from '../data'
import type { SakParams } from './params'
import { respondNoContent } from './response'

export const bestillingHandlers: StoreHandlersFactory = ({ sakStore }) => [
  http.put<SakParams>('/api/bestilling/:sakId/ferdigstilling', async ({ params }) => {
    await sakStore.oppdaterStatus(params.sakId, Saksstatus.FERDIGBEHANDLET)
    return respondNoContent()
  }),

  http.put<SakParams>('/api/bestilling/:sakId/avvisning', async ({ params }) => {
    await sakStore.oppdaterStatus(params.sakId, Saksstatus.FERDIGBEHANDLET)
    return respondNoContent()
  }),
]
