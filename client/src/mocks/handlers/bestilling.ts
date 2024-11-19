import { http, HttpResponse } from 'msw'

import { EndretHjelpemiddel, OppgaveStatusType } from '../../types/types.internal'
import type { StoreHandlersFactory } from '../data'
import type { SakParams } from './params'
import { respondNoContent, respondNotFound } from './response'

export const bestillingHandlers: StoreHandlersFactory = ({ sakStore, endreHjelpemiddelStore }) => [
  http.put<SakParams>('/api/bestilling/:sakId/ferdigstilling', async ({ params }) => {
    await sakStore.oppdaterStatus(params.sakId, OppgaveStatusType.FERDIGSTILT)
    return respondNoContent()
  }),

  http.put<SakParams>('/api/bestilling/:sakId/avvisning', async ({ params }) => {
    await sakStore.oppdaterStatus(params.sakId, OppgaveStatusType.AVVIST)
    return respondNoContent()
  }),

  http.get<SakParams>('/api/bestilling/:sakId', async ({ params }) => {
    const endredeHjelpemidler = await endreHjelpemiddelStore.hent(params.sakId)

    if (!endredeHjelpemidler) {
      return respondNotFound()
    }

    return HttpResponse.json(endredeHjelpemidler)
  }),

  http.put<SakParams, EndretHjelpemiddel>('/api/bestilling/:sakId', async ({ request, params }) => {
    await endreHjelpemiddelStore.endreHjelpemiddel(params.sakId, await request.json())
    return respondNoContent()
  }),
]
