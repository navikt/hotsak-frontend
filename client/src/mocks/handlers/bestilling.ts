import { http } from 'msw'

import type { StoreHandlersFactory } from '../data'
import { EndreHjelpemiddelRequest, OppgaveStatusType } from '../../types/types.internal'
import { respondNoContent } from './response'
import type { SakParams } from './params'

export const bestillingHandlers: StoreHandlersFactory = ({ sakStore }) => [
  http.put<SakParams>('/api/bestilling/:sakId/ferdigstilling', async ({ params }) => {
    await sakStore.oppdaterStatus(params.sakId, OppgaveStatusType.FERDIGSTILT)
    return respondNoContent()
  }),

  http.put<SakParams>('/api/bestilling/:sakId/avvisning', async ({ params }) => {
    await sakStore.oppdaterStatus(params.sakId, OppgaveStatusType.AVVIST)
    return respondNoContent()
  }),

  http.put<SakParams, EndreHjelpemiddelRequest>('/api/bestilling/:sakId', async ({ request }) => {
    await request.json()
    return respondNoContent()
  }),
]
