import { rest } from 'msw'

const saksbehandlingHandlers = [
  rest.get(`/api/oppgaver/`, (req, res, ctx) => {
    return res(

      ctx.status(200),
      ctx.json([
        {
          saksid: '1234567',
          søknadOm: 'Hjelpemidler',
          motattDato: '2021-06-25T13:55:45',
          personinformasjon: {
            fnr: '16120101181',
            fødselsdato: '2001-12-16',
            fornavn: 'Bananskall',
            etternavn: 'Eple',
            adresse: 'Veien 69',
            kjønn: 'MANN',
            funksjonsnedsettelse: ['hørsel', 'kognisjon'],
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
          søknadOm: 'Hjelpemidler',
          motattDato: '2021-07-09T14:55:45',
          personinformasjon: {
            fnr: '15084300133',
            fødselsdato: '1943-08-15',
            fornavn: 'Navn',
            mellomnavn: 'Mlm',
            etternavn: 'LangtesenNavnesen',
            adresse: 'Veien 69',
            kjønn: 'MANN',
            brukernummer: '454545',
            funksjonsnedsettelse: ['hørsel', 'kognisjon'],
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
          søknadOm: 'Hjelpemidler',
          motattDato: '2021-07-08T16:55:45',
          personinformasjon: {
            fnr: '15084300133',
            fødselsdato: '1943-08-15',
            fornavn: 'Navn',
            mellomnavn: 'Mlm',
            etternavn: 'Navnesen',
            adresse: 'Veien 69',
            kjønn: 'MANN',
            brukernummer: '454545',
            funksjonsnedsettelse: ['hørsel', 'kognisjon', 'bevegelse'],
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
