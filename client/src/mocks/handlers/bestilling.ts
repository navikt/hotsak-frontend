import { http } from 'msw'

import { OppgaveStatusType } from '../../types/types.internal'
import type { StoreHandlersFactory } from '../data'
import type { SakParams } from './params'
import { respondNoContent } from './response'

export const bestillingHandlers: StoreHandlersFactory = ({ sakStore, endreHjelpemiddelStore }) => [
  http.put<SakParams>('/api/bestilling/:sakId/ferdigstilling', async ({ params }) => {
    await sakStore.oppdaterStatus(params.sakId, OppgaveStatusType.FERDIGSTILT)
    return respondNoContent()
  }),

  http.put<SakParams>('/api/bestilling/:sakId/avvisning', async ({ params }) => {
    await sakStore.oppdaterStatus(params.sakId, OppgaveStatusType.AVVIST)
    return respondNoContent()
  }),
]
