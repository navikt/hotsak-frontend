import { rest } from 'msw'

const kontonummerHandlers = [
  rest.post<{ sakId: string; brukersFodselsnummer: string }>(`/api/personinfo/kontonr`, (req, res, ctx) => {
    const kontohaver = req?.body.brukersFodselsnummer

    if (kontohaver === '404') {
      return res(ctx.status(404))
    }

    if (kontohaver === '500') {
      return res(ctx.status(500))
    }
    return res(ctx.delay(500), ctx.status(200), ctx.json({ kontohaver: 'Far Farsen', kontonummer: '11112233333' }))
  }),
]

export default kontonummerHandlers
