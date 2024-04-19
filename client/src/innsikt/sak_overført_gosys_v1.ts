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
      tekst: 'Hvorfor overfører du saken til Gosys?',
      beskrivelse: 'Brukes kun internt av teamet som utvikler Hotsak og vises ikke i Gosys.',
      type: 'enkeltvalg',
      svar: [
        {
          tekst: 'Må kontakte formidler/bruker',
          type: 'oppfølgingsspørsmål',
          spørsmål: {
            tekst: 'Hvilke opplysninger / hva må du vite?',
            type: 'flervalg',
            svar: [
              'Avklaring: er det en byttesak?',
              'Begrunnelse: bruker har tilsvarende hjelpemiddel fra før, hvorfor trenger de en til?',
              'Begrunnelse for tilbehør',
              'Mer om brukers behov og situasjon',
              'Trenger pristilbud',
              {
                tekst: 'Annet',
                type: 'oppfølgingsspørsmål',
                spørsmål: {
                  tekst: 'Utdyp hvorfor du vil kontakte formidler/bruker',
                  type: 'fritekst',
                  påkrevd: true,
                },
              },
            ],
            påkrevd: true,
          },
        },
        {
          tekst: 'Må ha skriftlig vedtak',
          type: 'oppfølgingsspørsmål',
          spørsmål: {
            tekst: 'Hva slags type vedtak?',
            type: 'enkeltvalg',
            svar: ['Avslag', 'Delvis innvilgelse', 'Innvilges med brev'],
            påkrevd: true,
          },
        },
        'Må vurderes av noen som ikke jobber i Hotsak',
        {
          tekst: 'Skal henlegges',
          type: 'oppfølgingsspørsmål',
          spørsmål: {
            tekst: 'Hvorfor skal saken henlegges?',
            type: 'enkeltvalg',
            svar: [
              'Duplikat-sak',
              'MORS',
              {
                tekst: 'Annet',
                type: 'oppfølgingsspørsmål',
                spørsmål: {
                  tekst: 'Utdyp hvorfor saken skal henlegges',
                  beskrivelse: '',
                  type: 'fritekst',
                  påkrevd: true,
                },
              },
            ],
            påkrevd: true,
          },
        },
        {
          tekst: 'Annet',
          type: 'oppfølgingsspørsmål',
          spørsmål: {
            tekst: 'Gi en kort forklaring for hvorfor du ikke kan behandle saken. Unngå personopplysninger.',
            type: 'fritekst',
            påkrevd: true,
          },
        },
      ],
      påkrevd: true,
    },
  ],
}
