import { rest } from 'msw'

import hjelpemiddeloversikt from '../mockdata/hjelpemiddeloversikt.json'

const hjelpemiddeloversiktHandlers = [
    rest.post(`/api/hjelpemiddeloversikt/`, (req, res, ctx) => {
        // @ts-ignore
        const brukersFodselsnummer = req.body.brukersFodselsnummer

         if(brukersFodselsnummer === '06115559891') {
            return res(ctx.status(200), ctx.json([]))
         }

         if(brukersFodselsnummer === '19044238651') { // 
            return res(ctx.status(200), ctx.json(hjelpemiddeloversikt[0]))
         }
         else if(brukersFodselsnummer === '13044238651') { // Mia Cathrine
            return res(ctx.status(200), ctx.json(hjelpemiddeloversikt[1]))
         }
         else {
            return res(ctx.status(200), ctx.json(hjelpemiddeloversikt[2]))
         }
        
    })
]

export default hjelpemiddeloversiktHandlers
