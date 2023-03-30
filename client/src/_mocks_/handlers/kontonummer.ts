import { rest } from 'msw'

import { mutableSaker as saker } from './modell'

const kontonummerHandlers = [
  rest.post<{ sakId: string; fnr: string }>(`/api/utbetalingsmottaker`, (req, res, ctx) => {
    const fnr = req?.body.fnr
    const sakIdx = saker.findIndex((sak) => sak.saksid === req.body.sakId.toString())

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    saker[sakIdx]['utbetalingsmottaker'] = {
      fnr: fnr,
      navn: 'Far Farsen',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      kontonummer: '11112233333',
    }

    if (fnr === '404') {
      return res(ctx.delay(500), ctx.status(200), ctx.json({ fnr, navn: 'Mor morsen' }))
    }

    if (fnr === '500') {
      return res(ctx.status(500))
    }
    return res(ctx.delay(500), ctx.status(200), ctx.json({ fnr, navn: 'Far Farsen', kontonummer: '11112233333' }))
  }),
]

export default kontonummerHandlers
