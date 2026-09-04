import type { ISpørreundersøkelse } from './spørreundersøkelser'

const IKKE_PERSONOPPLYSNINGER =
  'Ikke skriv personopplysninger (navn, telefonnummer e.l), verken om bruker, formidler eller andre.'

export const journalføringingsoppgave_overført_gosys_v1: ISpørreundersøkelse = {
  skjema: 'journalføringingsoppgave_overført_gosys_v1',
  tittel: 'Vil du overføre oppgaven til Gosys?',
  beskrivelse: {
    header: 'Hva skjer med oppgaven hvis den overføres?',
    body: 'Hvis du overfører oppgaven til Gosys, vil den dukke opp som en vanlig journalføringsoppgave. Journalføring og videre saksbehandling må gjøres manuelt i Gosys og Infotrygd.',
  },
  spørsmål: [
    {
      type: 'enkeltvalg',
      tekst: 'Hvorfor overfører du oppgaven til Gosys?',
      beskrivelse:
        'Vi i Digihot spør for å lære mer om hvorfor oppgaver overføres. Valgene du gjør her blir ikke synlige i Gosys.',
      alternativer: [
        {
          type: 'oppfølgingsspørsmål',
          tekst: 'Behov for å sende brev',
          spørsmål: [
            {
              type: 'enkeltvalg',
              tekst: 'Hva har du behov for å sende brev om?',
              alternativer: [
                'Innhente signatur eller nytt fullmaktsskjema',
                'Innhente nødvendig dokumentasjon i saken',
                'Varsel om svartid',
                {
                  type: 'oppfølgingsspørsmål',
                  tekst: 'Annet',
                  spørsmål: [
                    {
                      type: 'fritekst',
                      tekst: 'Oppgi hva du har behov for å sende brev om.',
                      beskrivelse: IKKE_PERSONOPPLYSNINGER,
                      påkrevd: true,
                    },
                  ],
                },
              ],
              påkrevd: true,
            },
          ],
        },
        {
          type: 'oppfølgingsspørsmål',
          tekst: 'Saken skal ikke behandles i Hotsak pr. i dag',
          spørsmål: [
            {
              type: 'enkeltvalg',
              tekst: 'Hvilket område gjelder saken?',
              alternativer: [
                'Arbeidsliv',
                'Utdanning',
                'Tilskudd',
                {
                  type: 'oppfølgingsspørsmål',
                  tekst: 'Annet',
                  spørsmål: [
                    {
                      type: 'fritekst',
                      tekst: 'Oppgi hvilket område saken gjelder.',
                      beskrivelse: IKKE_PERSONOPPLYSNINGER,
                      påkrevd: true,
                    },
                  ],
                },
              ],
              påkrevd: true,
            },
          ],
        },
        {
          type: 'oppfølgingsspørsmål',
          tekst: 'Feil førsteside - ikke 10-07.03-sak',
          spørsmål: [
            {
              type: 'fritekst',
              tekst: 'Oppgi hva saken egentlig gjelder.',
              beskrivelse: IKKE_PERSONOPPLYSNINGER,
              påkrevd: true,
            },
          ],
        },
        {
          type: 'oppfølgingsspørsmål',
          tekst: 'Feil i skanning',
          spørsmål: [
            {
              type: 'enkeltvalg',
              tekst: 'Hva er feil med skanningen?',
              alternativer: [
                'Saken er sendt inn på feil bruker (slette)',
                'Saken inneholder dokumenter tilhørende flere brukere (splitte)',
                'Bilder med for dårlig kvalitet (reskanning)',
                {
                  type: 'oppfølgingsspørsmål',
                  tekst: 'Annet',
                  spørsmål: [
                    {
                      type: 'fritekst',
                      tekst: 'Oppgi hva som er feil med skanningen.',
                      beskrivelse: IKKE_PERSONOPPLYSNINGER,
                      påkrevd: true,
                    },
                  ],
                },
              ],
              påkrevd: true,
            },
          ],
        },
        {
          type: 'oppfølgingsspørsmål',
          tekst: 'Annet',
          spørsmål: [
            {
              type: 'fritekst',
              tekst: 'Hva er grunnen til at du vil overføre oppgaven?',
              beskrivelse: IKKE_PERSONOPPLYSNINGER,
              påkrevd: true,
            },
          ],
        },
      ],
      påkrevd: 'Du må velge minst én årsak',
    },
  ],
}
