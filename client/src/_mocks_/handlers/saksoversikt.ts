import { rest } from 'msw'
import saksoversikt from '../mockdata/saksoversikt.json'


const saksoversiktHandlers = [
    rest.post(`/api/saksoversikt/`, (req, res, ctx) => {
         // @ts-ignore
         const brukersFodselsnummer = req.body.brukersFodselsnummer

        if(brukersFodselsnummer === '19044238651') { // Petter Andreas
            return res(ctx.status(200), ctx.json(saksoversikt[0]))
         }
         else if(brukersFodselsnummer === '13044238651') { // Mia Cathrine
            return res(ctx.status(200), ctx.json(saksoversikt[1]))
         }
         else {
            return res(ctx.status(200), ctx.json(saksoversikt[2]))
         }
    })
]

export default saksoversiktHandlers
