import { rest } from 'msw'

import type { StoreHandlersFactory } from '../data'
import { hjelpemiddeloversikt } from '../data/hjelpemiddeloversikt'

export const hjelpemiddeloversiktHandlers: StoreHandlersFactory = () => [
  rest.post<{ brukersFodselsnummer: any }>(`/api/hjelpemiddeloversikt`, async (req, res, ctx) => {
    const { brukersFodselsnummer } = await req.json()

    if (brukersFodselsnummer === '06115559891') {
      return res(ctx.status(200), ctx.json([]))
    }

    if (brukersFodselsnummer === '19044238651') {
      // Petter Andreas
      return res(ctx.status(200), ctx.json(hjelpemiddeloversikt[0]))
    } else if (brukersFodselsnummer === '13044238651') {
      // Mia Cathrine
      return res(ctx.status(200), ctx.json(hjelpemiddeloversikt[1]))
    } else if (brukersFodselsnummer === '500') {
      return res(ctx.status(500), ctx.text('Å nei og nei. Dette kunne virkelig ikke gått verre'))
    } else {
      return res(ctx.status(200), ctx.json(hjelpemiddeloversikt[2]))
    }
  }),
]
