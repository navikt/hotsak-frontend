import { http, HttpResponse } from 'msw'

import type { BrevTekst, Brevtype } from '../../types/types.internal'
import type { StoreHandlersFactory } from '../data'
import { delay, respondNoContent } from './response'
import type { SakParams } from './params'

type NyBrevtekst = Pick<BrevTekst, 'brevtype' | 'data'>

interface BrevutkastParams extends SakParams {
  brevtype: Brevtype
}

export const brevutkastHandlers: StoreHandlersFactory = ({ sakStore }) => [
  http.post<SakParams, NyBrevtekst>(`/api/sak/:sakId/brevutkast`, async ({ request, params }) => {
    const { brevtype, data } = await request.json()
    await sakStore.lagreBrevtekst(params.sakId, brevtype, data)

    await delay(1000)
    return respondNoContent()
  }),

  // TODO avventer dette til vi vet hvordan vi vil ha api for brevutkast
  /*http.put<SakParams, { klargjort: boolean }>(`/api/sak/:sakId/brevutkast/klargjoring`, async ({ request, params }) => {
    const { klargjort } = await request.json()
    await sakStore.lagreBrevstatus(params.sakId, klargjort)
  }),*/

  http.delete<BrevutkastParams>(`/api/sak/:sakId/brevutkast/:brevtype`, async ({ params }) => {
    await sakStore.fjernBrevtekst(params.sakId)
    await delay(500)
    return respondNoContent()
  }),

  http.get<BrevutkastParams>(`/api/sak/:sakId/brevutkast/:brevtype`, async ({ params }) => {
    const brevTekst = await sakStore.hentBrevtekst(params.sakId)
    await delay(800)
    if (brevTekst) {
      return HttpResponse.json({ ...brevTekst, opprettet: new Date().toISOString() })
    } else {
      return HttpResponse.json({
        sakId: params.sakId,
        brevtype: '',
        data: { brevtekst: '' },
        opprettet: new Date().toISOString(),
      })
    }
  }),
]
