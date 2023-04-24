import { rest } from 'msw'

import { StoreHandlersFactory } from '../data'

export const saksoversiktHandlers: StoreHandlersFactory = ({ saksoversiktStore }) => [
  rest.post<{ brukersFodselsnummer: any }>(`/api/saksoversikt`, async (req, res, ctx) => {
    const brukersFodselsnummer = (await req.json()).brukersFodselsnummer

    const saksoversikt = await saksoversiktStore.alle()

    if (brukersFodselsnummer === '19044238651') {
      // Petter Andreas
      return res(ctx.status(200), ctx.json(saksoversikt[0]))
    } else if (brukersFodselsnummer === '13044238651') {
      // Mia Cathrine
      return res(ctx.status(200), ctx.json(saksoversikt[1]))
    } else if (brukersFodselsnummer === '1234') {
      return res(ctx.status(500))
    } else if (brukersFodselsnummer === '6666') {
      return res(ctx.status(200), ctx.json({ hotsakSaker: [] }))
    } else {
      return res(ctx.status(200), ctx.json(saksoversikt[2]))
    }
  }),
]
