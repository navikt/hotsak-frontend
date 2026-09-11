import { http, HttpResponse } from 'msw'

import {
  type LagretPunchetHjelpemiddel,
  type PunchedeHjelpemidlerResponse,
  type PunchetHjelpemiddel,
} from '../../journalføring/journalføringTypes.ts'
import { type StoreHandlersFactory } from '../data'
import { type SakParams } from './params'
import { delay, respondBadRequest, respondNotFound, respondNoContent } from './response'

interface HjelpemiddelParams extends SakParams {
  hjelpemiddelId: string
}

interface PunchetHjelpemiddelRequest extends PunchetHjelpemiddel {
  id?: string
}

function erGyldigHjelpemiddel(hjelpemiddel: PunchetHjelpemiddelRequest) {
  return /^\d{6}$/.test(hjelpemiddel.hmsnummer) && Number.isInteger(hjelpemiddel.antall) && hjelpemiddel.antall > 0
}

export const punchedeHjelpemidlerHandlers: StoreHandlersFactory = ({ punchedeHjelpemidlerStore }) => [
  http.get<SakParams, never, PunchedeHjelpemidlerResponse>(
    '/api/sak/:sakId/punchede-hjelpemidler',
    async ({ params }) => {
      const hjelpemidler = await punchedeHjelpemidlerStore.hent(params.sakId)
      await delay(200)
      return HttpResponse.json({
        erPunchetPapirsøknad: await punchedeHjelpemidlerStore.finnes(params.sakId),
        hjelpemidler,
      })
    }
  ),
  http.put<SakParams, PunchetHjelpemiddelRequest, LagretPunchetHjelpemiddel>(
    '/api/sak/:sakId/punchede-hjelpemidler',
    async ({ params, request }) => {
      const hjelpemiddel = await request.json()
      if (!erGyldigHjelpemiddel(hjelpemiddel)) {
        return respondBadRequest()
      }
      const lagret = hjelpemiddel.id
        ? await punchedeHjelpemidlerStore.oppdater(params.sakId, hjelpemiddel as LagretPunchetHjelpemiddel)
        : await punchedeHjelpemidlerStore.opprett(params.sakId, hjelpemiddel)
      if (!lagret) {
        return respondNotFound()
      }
      return HttpResponse.json(lagret)
    }
  ),
  http.delete<HjelpemiddelParams>('/api/sak/:sakId/punchede-hjelpemidler/:hjelpemiddelId', async ({ params }) => {
    const slettet = await punchedeHjelpemidlerStore.slett(params.sakId, params.hjelpemiddelId)
    return slettet ? respondNoContent() : respondNotFound()
  }),
]
