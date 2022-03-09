import { rest } from 'msw'
import saksoversikt from '../mockdata/saksoversikt.json'


const saksoversiktHandlers = [
    rest.post(`/api/saksoversikt/`, (req, res, ctx) => {
        // @ts-ignore
         /*if(req.body.brukersFodselsnummer === '06115559891') {
            return res(ctx.status(200), ctx.json([]))
         }*/
        return res(ctx.status(200), ctx.json(saksoversikt))
    })
]

export default saksoversiktHandlers
