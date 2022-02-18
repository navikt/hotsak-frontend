import { rest } from 'msw'

import hjelpemiddeloversikt from '../mockdata/hjelpemiddeloversikt.json'

const hjelpemiddeloversiktHandlers = [
    rest.post(`/api/hjelpemiddeloversikt/`, (req, res, ctx) => {
        // @ts-ignore
         if(req.body.brukersFødselsnummer === '06115559891') {
            return res(ctx.status(200), ctx.json([]))
         }
        return res(ctx.status(200), ctx.json(hjelpemiddeloversikt))
    })
]

export default hjelpemiddeloversiktHandlers
