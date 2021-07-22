import { rest } from 'msw'

const saksbildeHandlers = [
  rest.get(`/api/sak/*`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        saksid: '1234567',

        søknadGjelder: 'Hjelpemidler',
        hjelpemidler: [
          {
            hmsnr: '123456',
            rangering: '1',
            alleredeUtlevert: 'true',
            antall: '6',
            kategori: 'Terskeleliminatorer og Kjøreramper',
            beskrivelse: 'Topro Terskeleliminator',
            tilleggsinfo: [
              { tittel: 'behov', innhold: 'Problem med sittestilling / posisjonering' },
              { tittel: 'Tilsvarende ikke ok', innhold: 'Hun trenger å stabilisere bekkenet.' },
              { tittel: 'Begrunnelse', innhold: 'Eneste pute som passer rullestolen hennes.' },
              {
                tittel: 'info',
                innhold:
                  'Mia har scoliose og skjevt bekken med rotasjon mot høyre, benlengdeforskjell og nedsatt sittestabilitet. Scoliosen/bekkenskjevheten er ikke korrigerbar. Trenger en pute som kan tilpasses asymmetrien i bekkenet.',
              },
            ],
            tilbehør: [
              {
                hmsnr: '654321',
                antall: '1',
                navn: 'Navn på tilbehør',
              },
            ],
          },

          {
            hmsnr: '123456',
            rangering: '1',
            antall: '6',
            kategori: 'Manuelle rullestoler',
            beskrivelse: 'Cross 6 allround sb35 sd35-50 kort',
            tilleggsinfo: [
              { tittel: 'Bil', innhold: 'Rullestolen skal brukes som sete i bil' },
              { tittel: 'Sitteputevalg', innhold: 'Standard sittepute' },
            ],
            tilbehør: [
              {
                hmsnr: '000000',
                antall: '1',
                navn: 'Standard sittepute',
              },
            ],
          },
        ],
        formidler: {
          navn: 'Formidler navn',
          poststed: 'Poststed',
          arbeidssted: 'Arbeidssted',
          stilling: 'Ergo',
          postadresse: 'Formidlers adresse',
          telefon: '34343434',
          treffesEnklest: 'Mandag - fredag',
          epost: 'e@post.com',
        },
        greitÅViteFaktum: [
          { beskrivelse: 'Kun førsterangering', type: 'advarsel' },
          { beskrivelse: 'Personalia fra folkeregisteret', type: 'advarsel' },
          { beskrivelse: 'Ingen fritekst i søknaden', type: 'info' },
        ],

        motattDato: '2021-06-25T13:55:45',
        personinformasjon: {
          fnr: '16120101181',
          fødselsdato: '2001-12-16',
          fornavn: 'Bananskall',
          etternavn: 'Eple',
          adresse: 'Veien 69',
          kilde: 'PDL',
          signaturType: 'BRUKER_BEKREFTER',
          telefon: '45454545',
          bosituasjon: "HJEMME",
          funksjonsnedsettelse: ['hørsel', 'kognisjon'],
          bruksarena: "DAGLIGLIV",
          oppfylteVilkår: [
            'Mia Cathrine Svendsen har vesentlig nedsatt funksjon.  Funksjonsnedsettelsen varer over 2 år eller livet ut.',
            'Mia Cathrine Svendsen sitt behov kan ikke løses med enklere og rimeligere hjelpemidler eller ved andre tiltak som ikke dekkes av NAV.',
            'Hjelpemiddelet(ene) er nødvendig for å avhjelpe praktiske problemer i dagliglivet eller bli pleid i hjemmet. Mia Cathrine Svendsen vil være i stand til å bruke hjelpemidlene.',
          ],
          kjønn: 'MANN',
          kroppsmål: {
            høyde: '100',
            kroppsvekt: '69',
            lårlengde: '34',
            legglengde: '23',
            setebredde: '45',
          },
          brukernummer: '454545',
          postnummer: '2825',
          poststed: 'Gjøvik',
          gtNummer: '1234',
          gtType: 'KOMMUNE',
          egenAnsatt: 'false',
          brukerErDigital: 'true',
        },
        levering: {
          kontaktPerson: {
            navn: 'Nullable kontaktpersonnavn',
            telefon: 'Nullable kontaktperson tlf',
            kontaktpersonType: 'HJELPEMIDDELBRUKER',
          },
          leveringsmaate: 'FOLKEREGISTRERT_ADRESSE|ANNEN_ADRESSE|HJELPEMIDDELSENTRAL|ALLEREDE_LEVERT',
          adresse: 'nullable adresse',
          merknad: 'Ta også kontakt med meg dvs. formidler ved utlevering',
        },
        oppfølgingsansvarlig: {
          navn: 'Navn ',
          arbeidssted: 'arbeidssted',
          stilling: 'stilling',
          telefon: '45454545',
          ansvarFor: 'ansvar for',
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
      })
    )
  }),
]
 export default saksbildeHandlers
