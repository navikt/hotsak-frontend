import { rest } from 'msw'
import saker from '../mockdata/saker.json'

const saksbildeHandlers = [
  rest.get(`/api/sak/:saksid`, (req, res, ctx) => {
    console.log('Params', req.params)
    return res(ctx.status(200), ctx.json(saker.filter((sak) => sak.saksid === req.params.saksid)[0]))
  }),
]
export default saksbildeHandlers
