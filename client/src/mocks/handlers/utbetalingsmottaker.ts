import { delay, http, HttpResponse } from 'msw'

import type { KontonummerRequest, KontonummerResponse } from '../../types/types.internal'
import type { StoreHandlersFactory } from '../data'
import { lagTilfeldigNavn } from '../data/navn'
import { respondInternalServerError } from './response'

export const utbetalingsmottakerHandlers: StoreHandlersFactory = ({ barnebrillesakStore }) => [
  http.post<never, KontonummerRequest, KontonummerResponse | null>(`/api/utbetalingsmottaker`, async ({ request }) => {
    const { sakId, fnr } = await request.json()
    await delay(500)
    if (fnr === '404') {
      return HttpResponse.json({ fnr, navn: lagTilfeldigNavn().fulltNavn })
    }
    if (fnr === '500') {
      return respondInternalServerError() as any // fixme
    }
    const utbetalingsmottaker = await barnebrillesakStore.oppdaterUtbetalingsmottaker(sakId, fnr)
    return HttpResponse.json(utbetalingsmottaker)
  }),
]
