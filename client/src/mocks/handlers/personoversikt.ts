import { rest } from 'msw'

import type { StoreHandlersFactory } from '../data'

export const personoversiktHandlers: StoreHandlersFactory = ({ personStore }) => [
  rest.post<{ brukersFodselsnummer: string }>(`/api/personinfo`, async (req, res, ctx) => {
    const { brukersFodselsnummer } = await req.json()
    const person = await personStore.hent(brukersFodselsnummer)
    if (!person) {
      return res(ctx.status(404), ctx.text('Person ikke funnet'))
    }
    return res(ctx.delay(1000), ctx.status(200), ctx.json(person))
  }),
  rest.post<{ brukersFodselsnummer: string }>(`/api/personinfo/tilgangsattributter`, async (req, res, ctx) => {
    return res(
      ctx.delay(500),
      ctx.status(200),
      ctx.json({
        //adressebeskyttelseGradering: [Adressebeskyttelse.FORTROLIG],
        erSkjermetPerson: false,
      })
    )
  }),
]
