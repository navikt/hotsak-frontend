import { rest } from 'msw'

import type { KontonummerRequest, KontonummerResponse } from '../../types/types.internal'
import type { StoreHandlersFactory } from '../data'
import { lagTilfeldigNavn } from '../data/navn'

export const utbetalingsmottakerHandlers: StoreHandlersFactory = ({ barnebrillesakStore }) => [
  rest.post<KontonummerRequest, any, KontonummerResponse>(`/api/utbetalingsmottaker`, async (req, res, ctx) => {
    const { sakId, fnr } = await req.json<KontonummerRequest>()
    if (fnr === '404') {
      return res(ctx.delay(500), ctx.status(200), ctx.json({ fnr, navn: lagTilfeldigNavn().fulltNavn }))
    }
    if (fnr === '500') {
      return res(ctx.status(500))
    }
    const utbetalingsmottaker = await barnebrillesakStore.oppdaterUtbetalingsmottaker(sakId, fnr)
    return res(ctx.delay(500), ctx.status(200), ctx.json(utbetalingsmottaker))
  }),
]
