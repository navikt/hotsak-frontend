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
         else if(brukersFodselsnummer === '13041163393') { //sperret person med kode 6 eller 7
            return res(ctx.status(403), ctx.text('Du har ikke tilgang til å søke opp denne personen'))
         } else if(brukersFodselsnummer === '16120101181') { //sperret person med kode 6 eller 7
            return res(ctx.status(404), ctx.text('Person ikke funnet'))
         } else if(brukersFodselsnummer === '11098600142') {
            return res(ctx.status(500), ctx.text('Noe gikk fryktelig galt'))
         }
         else {
            return res(ctx.status(200), ctx.json(personInfo[2]))
         }
    })
]

export default personInfoHandlers
