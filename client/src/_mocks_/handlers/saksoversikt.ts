import { rest } from 'msw'

import saksoversikt from '../mockdata/saksoversikt.json'

const saksoversiktHandlers = [
  rest.post<{ brukersFodselsnummer: any }>(`/api/saksoversikt`, (req, res, ctx) => {
    const brukersFodselsnummer = req?.body?.brukersFodselsnummer

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

export default saksoversiktHandlers
