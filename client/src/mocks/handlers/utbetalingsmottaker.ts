import { http, HttpResponse } from 'msw'

import type { KontonummerRequest, KontonummerResponse } from '../../types/types.internal'
import type { StoreHandlersFactory } from '../data'
import { lagTilfeldigNavn } from '../data/navn'
import { delay, respondInternalServerError } from './response'

export const utbetalingsmottakerHandlers: StoreHandlersFactory = ({ sakStore }) => [
  http.post<never, KontonummerRequest, KontonummerResponse | any>(`/api/utbetalingsmottaker`, async ({ request }) => {
    const { sakId, fnr } = await request.json()
    await delay(500)
    if (fnr === '404') {
      return HttpResponse.json({ fnr, navn: lagTilfeldigNavn().fulltNavn })
    }
    if (fnr === '500') {
      return respondInternalServerError()
    }
    const utbetalingsmottaker = await sakStore.oppdaterUtbetalingsmottaker(sakId, fnr)
    return HttpResponse.json(utbetalingsmottaker)
  }),
]
