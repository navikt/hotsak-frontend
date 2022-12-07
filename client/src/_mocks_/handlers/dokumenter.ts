import { rest } from 'msw'

import dokumentliste from '../mockdata/dokumentliste.json'

const dokumentHandlers = [
  rest.get(`/api/dokumenter`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(dokumentliste))
  }),
]

export default dokumentHandlers
