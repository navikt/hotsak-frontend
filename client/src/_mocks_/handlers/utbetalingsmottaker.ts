import { rest } from 'msw'

import { KontonummerRequest, KontonummerResponse } from '../../types/types.internal'
import { barnebrillesakStore } from '../mockdata/BarnebrillesakStore'
import { lagTilfeldigNavn } from '../mockdata/navn'

const utbetalingsmottakerHandlers = [
  rest.post<KontonummerRequest, any, KontonummerResponse>(`/api/utbetalingsmottaker`, async (req, res, ctx) => {
    const { sakId, fnr } = await req.json<KontonummerRequest>()
    if (fnr === '404') {
      return res(ctx.delay(500), ctx.status(200), ctx.json({ fnr, navn: lagTilfeldigNavn().navn }))
    }
    if (fnr === '500') {
      return res(ctx.status(500))
    }
    const utbetalingsmottaker = await barnebrillesakStore.oppdaterUtbetalingsmottaker(sakId, fnr)
    return res(ctx.delay(500), ctx.status(200), ctx.json(utbetalingsmottaker))
  }),
]

export default utbetalingsmottakerHandlers
