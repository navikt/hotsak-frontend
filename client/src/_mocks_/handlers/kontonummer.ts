import { rest } from 'msw'

const kontonummerHandlers = [
  rest.post<{ kontohaver: string }>(`/api/personinfo/kontonr`, (req, res, ctx) => {
    const kontohaver = req?.body.kontohaver

    if (kontohaver === '11223344556') {
      return res(ctx.status(404))
    }
    return res(ctx.status(200), ctx.json({ kontohaver, kontonummer: '11112233333' }))
  }),
]

export default kontonummerHandlers
