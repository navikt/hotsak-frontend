import { http, HttpResponse } from 'msw'

import { EndretHjelpemiddel, EndretHjelpemiddelBegrunnelse, OppgaveStatusType } from '../../types/types.internal'
import type { StoreHandlersFactory } from '../data'
import type { SakParams } from './params'
import { respondNoContent } from './response'

export const bestillingHandlers: StoreHandlersFactory = ({ sakStore }) => [
  http.put<SakParams>('/api/bestilling/:sakId/ferdigstilling', async ({ params }) => {
    await sakStore.oppdaterStatus(params.sakId, OppgaveStatusType.FERDIGSTILT)
    return respondNoContent()
  }),

  http.put<SakParams>('/api/bestilling/:sakId/avvisning', async ({ params }) => {
    await sakStore.oppdaterStatus(params.sakId, OppgaveStatusType.AVVIST)
    return respondNoContent()
  }),

  http.get<SakParams>('/api/bestilling/:sakId', async (/*{ params }*/) => {
    return HttpResponse.json({
      endredeHjelpemidler: [
        {
          hmsArtNr: '014112',
          hjelpemiddelId: '526f9e0d-2f5a-4946-acb3-afbfe72e227f',
          endretHmsArtNr: '014113',
          begrunnelse: EndretHjelpemiddelBegrunnelse.ANNET,
          begrunnelseFritekst: 'Annen kommentar om et spesielt behov som sikkert er nyttig.',
        },
      ],
    })
  }),

  // TODO Midlertidig dummy response frem til mockene er fiksa
  http.put<SakParams, EndretHjelpemiddel>('/api/bestilling/:sakId', async (/*{ request, params }*/) => {
    //await sakStore.endreHjelpemiddel(params.sakId, await request.json())
    return respondNoContent()
  }),
]
