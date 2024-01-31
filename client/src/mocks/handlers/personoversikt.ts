import { rest } from 'msw'

import type { StoreHandlersFactory } from '../data'

export const personoversiktHandlers: StoreHandlersFactory = ({ personStore }) => [
  rest.post<{ brukersFodselsnummer: string }>(`/api/person`, async (req, res, ctx) => {
    const { brukersFodselsnummer } = await req.json()
    const person = await personStore.hent(brukersFodselsnummer)
    if (!person) {
      return res(ctx.status(404), ctx.text('Person ikke funnet'))
    }
    return res(ctx.delay(1000), ctx.status(200), ctx.json(person))
  }),
]
