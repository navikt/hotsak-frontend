import { rest } from 'msw'
import personInfo from '../mockdata/personInfo.json'


const personInfoHandlers = [
    rest.post(`/api/personinfo/`, (req, res, ctx) => {
         // @ts-ignore
         const brukersFodselsnummer = req.body.brukersFodselsnummer

        if(brukersFodselsnummer === '19044238651') { // Petter Andreas
            return res(ctx.status(200), ctx.json(personInfo[0]))
         }
         else if(brukersFodselsnummer === '13044238651') { // Mia Cathrine
            return res(ctx.status(200), ctx.json(personInfo[1]))
         }
         else {
            return res(ctx.status(200), ctx.json(personInfo[2]))
         }
    })
]

export default personInfoHandlers
