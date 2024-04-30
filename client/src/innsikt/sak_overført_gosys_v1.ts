import type { ISpørreundersøkelse } from './spørreundersøkelser'

export const sak_overført_gosys_v1: ISpørreundersøkelse = {
  skjema: 'sak_overført_gosys_v1',
  tittel: 'Vil du overføre saken til Gosys?',
  beskrivelse: {
    header: 'Hva skjer med saken hvis den overføres?',
    body: 'Hvis du overfører saken til Gosys, vil den dukke opp som en vanlig journalføringsoppgave. Journalføring og videre saksbehandling må gjøres manuelt i Gosys og Infotrygd. Merk at det kan ta noen minutter før saken dukker opp i Gosys.',
  },
  spørsmål: [
    {
      type: 'enkeltvalg',
      tekst: 'Hvorfor overfører du saken til Gosys?',
      beskrivelse: 'Årsaken du velger vil vises i Gosys. Eventuell fritekst vises ikke i Gosys, og brukes kun internt.',
      alternativer: [
        {
          type: 'oppfølgingsspørsmål',
          tekst: 'Må kontakte formidler/bruker',
          spørsmål: [
            {
              type: 'flervalg',
              tekst: 'Hvilke opplysninger / hva må du vite?',
              alternativer: [
                'Avklaring: er det en byttesak?',
                'Begrunnelse: bruker har tilsvarende hjelpemiddel fra før, hvorfor trenger de en til?',
                'Begrunnelse: tilbehør',
                'Mer om brukers behov og situasjon',
                'Trenger pristilbud',
                {
                  type: 'oppfølgingsspørsmål',
                  tekst: 'Annet',
                  spørsmål: [
                    {
                      type: 'fritekst',
                      tekst: 'Utdyp hvorfor du vil kontakte formidler/bruker. Ikke skriv personopplysninger.',
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
          tekst: 'Må ha skriftlig vedtak',
          spørsmål: [
            {
              type: 'enkeltvalg',
              tekst: 'Hva slags type vedtak?',
              alternativer: ['Avslag', 'Delvis innvilgelse', 'Innvilges med brev'],
              påkrevd: true,
            },
          ],
        },
        'Må vurderes av noen som ikke jobber i Hotsak',
        {
          type: 'oppfølgingsspørsmål',
          tekst: 'Skal henlegges',
          spørsmål: [
            {
              type: 'enkeltvalg',
              tekst: 'Hvorfor skal saken henlegges?',
              alternativer: [
                'Duplikat-sak',
                'MORS',
                {
                  type: 'oppfølgingsspørsmål',
                  tekst: 'Annet',
                  spørsmål: [
                    {
                      type: 'fritekst',
                      tekst: 'Utdyp hvorfor saken skal henlegges. Ikke skriv personopplysninger.',
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
              tekst: 'Hva er grunnen til at du vil overføre saken? Ikke skriv personopplysninger.',
              påkrevd: true,
            },
          ],
        },
      ],
      påkrevd: true,
    },
  ],
}
