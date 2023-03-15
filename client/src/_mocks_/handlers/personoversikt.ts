import { rest } from 'msw'

import personInfo from '../mockdata/personInfo.json'

const personInfoHandlers = [
  rest.post<{ brukersFodselsnummer: any }>(`/api/personinfo`, (req, res, ctx) => {
    const brukersFodselsnummer = req?.body?.brukersFodselsnummer

    if (brukersFodselsnummer === '19044238651') {
      // Petter Andreas
      return res(ctx.status(200), ctx.json(personInfo[0]))
    } else if (brukersFodselsnummer === '13044238651') {
      // Mia Cathrine
      return res(ctx.status(200), ctx.json(personInfo[1]))
    } else if (brukersFodselsnummer === '20071359671') {
      // Spencer
      return res(ctx.status(200), ctx.json(personInfo[3]))
    } else if (brukersFodselsnummer === '13041163393') {
      //sperret person med kode 6 eller 7
      return res(ctx.status(403), ctx.text('Du har ikke tilgang til å se informasjon om denne brukeren'))
    } else if (brukersFodselsnummer === '16120101181') {
      //sperret person med kode 6 eller 7
      return res(ctx.status(404), ctx.text('Person ikke funnet'))
    } else if (brukersFodselsnummer === '11098600142') {
      return res(ctx.status(500), ctx.text('Noe gikk fryktelig galt'))
    } else {
      const person = personInfo[2]
      person.fnr = brukersFodselsnummer
      return res(ctx.status(200), ctx.json(person))
    }
  }),
]

export default personInfoHandlers
