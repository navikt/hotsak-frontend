import { rest } from 'msw'
import oppgaveliste from '../mockdata/oppgaveliste.json'

const saksbehandlingHandlers = [
  rest.put('/api/vedtak/:saksnummer', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({}))
  }),
  rest.get(`/api/oppgaver/`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(oppgaveliste))
  }),
]

export default saksbehandlingHandlers
