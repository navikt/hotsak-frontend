import type { ISpørreundersøkelse } from './spørreundersøkelser'

export const savner_informasjon_v1: ISpørreundersøkelse = {
  skjema: 'savner_informasjon_v1',
  tittel: 'Hvilken informasjon trenger du?',
  beskrivelse: {
    header: 'Grunnen til at vi spør om dette',
    body: 'Teamene som jobber med Hotsak og digital behovsmelding bruker svaret ditt til å lære mer om hvordan vi kan forbedre søknaden, og gi deg som saksbehandler den informasjonen du trenger.',
  },
  spørsmål: [
    {
      type: 'fritekst',
      tekst: 'Forklar hva du savner av informasjon knyttet til dette hjelpemiddelet.',
      beskrivelse:
        'Det du skriver vil kun brukes av teamet som jobber med Hotsak og den digitale behovsmeldingen. Ikke skriv personopplysninger.',
      påkrevd: true,
    },
  ],
}
