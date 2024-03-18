import { delay, http, HttpResponse } from 'msw'

import type { BrevTekst, Brevtype } from '../../types/types.internal'
import type { StoreHandlersFactory } from '../data'
import { respondCreated, respondOK } from './response'

type NyBrevtekst = Pick<BrevTekst, 'brevtype' | 'data'>

export const brevtekstHandlers: StoreHandlersFactory = ({ barnebrillesakStore }) => [
  http.post<{ sakId: string }, NyBrevtekst>(`/api/sak/:sakId/brevutkast`, async ({ request, params }) => {
    const { brevtype, data } = await request.json()
    await barnebrillesakStore.lagreBrevtekst(params.sakId, brevtype, data.brevtekst)
    return respondCreated()
  }),

  http.delete<{ sakId: string; brevtype: Brevtype }>(`/api/sak/:sakId/brevutkast/:brevtype`, async ({ params }) => {
    await barnebrillesakStore.fjernBrevtekst(params.sakId)
    await delay(500)
    return respondOK()
  }),

  http.get<{ sakId: string; brevtype: Brevtype }>(`/api/sak/:sakId/brevutkast/:brevtype`, async ({ params }) => {
    const brevTekst = await barnebrillesakStore.hentBrevtekst(params.sakId)
    await delay(500)
    if (brevTekst) {
      return HttpResponse.json(brevTekst)
    } else {
      return HttpResponse.json({ sakId: params.sakId, brevtype: '', data: { brevtekst: '' } })
    }
  }),
]
