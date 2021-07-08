import { rest } from 'msw'

const saksbehandlingHandlers = [
  rest.get(`/api/oppgaver/`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          saksid: '1234567',
          funksjonsnedsettelse: ['hørsel', 'kognisjon'],
          søknadOm: 'Hjelpemidler',
          personinformarsjon: {
            fornavn: 'Navn',
            mellomnavn: 'Mlm',
            etternavn: 'Navnesen',
            adresse: 'Veien 69',
            kjønn: 'MANN',
            brukernummer: '454545',
            postnummer: '2825',
            poststed: 'Gjøvik',
            gtNummer: '1234',
            gtType: 'KOMMUNE',
            egenAnsatt: 'false',
            brukerErDigital: 'true',
          },
          saksbehandler: {
            epost: 'a.b@nav.no',
            objectId: '23ea7485-1324-4b25-a763-assdfdfa',
            navn: 'Anders Bertolomeus',
          },
          status: 'mottatt',
          enhet: [
            {
              enhetsnummer: '6969',
              enhetsnavn: 'Enhetsnavn',
            },
          ],
        },
        {
          saksid: '1234568',
          funksjonsnedsettelse: ['hørsel', 'kognisjon'],
          søknadOm: 'Hjelpemidler',
          personinformarsjon: {
            fornavn: 'Navn',
            mellomnavn: 'Mlm',
            etternavn: 'Navnesen',
            adresse: 'Veien 69',
            kjønn: 'MANN',
            brukernummer: '454545',
            postnummer: '2825',
            poststed: 'Gjøvik',
            gtNummer: '1234',
            gtType: 'KOMMUNE',
            egenAnsatt: 'false',
            brukerErDigital: 'true',
          },
          saksbehandler: null,
          status: 'mottatt',
          enhet: [
            {
              enhetsnummer: '6969',
              enhetsnavn: 'Enhetsnavn',
            },
          ],
        },
        {
          saksid: '1234569',
          funksjonsnedsettelse: ['hørsel', 'kognisjon'],
          søknadOm: 'Hjelpemidler',
          personinformarsjon: {
            fornavn: 'Navn',
            mellomnavn: 'Mlm',
            etternavn: 'Navnesen',
            adresse: 'Veien 69',
            kjønn: 'MANN',
            brukernummer: '454545',
            postnummer: '2825',
            poststed: 'Gjøvik',
            gtNummer: '1234',
            gtType: 'KOMMUNE',
            egenAnsatt: 'false',
            brukerErDigital: 'true',
          },
          saksbehandler: null,
          status: 'mottatt',
          enhet: [
            {
              enhetsnummer: '6969',
              enhetsnavn: 'Enhetsnavn',
            },
          ],
        },
      ])
    )
  }),
]

export default saksbehandlingHandlers
