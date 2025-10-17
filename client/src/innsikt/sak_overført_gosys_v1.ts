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
      beskrivelse:
        'Vi i Digihot spør for å lære mer om hvorfor saker overføres. Valgene du gjør her blir ikke synlige i Gosys.',
      alternativer: [
        {
          type: 'oppfølgingsspørsmål',
          tekst: 'Hotsak fungerer ikke godt nok, eller mangler nødvendige funksjoner',
          spørsmål: [
            {
              type: 'flervalg',
              tekst: 'Hva har du behov for å kunne gjøre i Hotsak for å behandle denne saken?',
              alternativer: [
                'Henlegge saken',
                'Sende brev for å innhente opplysninger',
                'Sende avslagsbrev',
                'Sende brev om delvis innvilgelse',
                'Sende brev om innvilgelse',
                {
                  type: 'oppfølgingsspørsmål',
                  tekst: 'Annet',
                  spørsmål: [
                    {
                      type: 'fritekst',
                      tekst: 'Hva har du behov for å kunne gjøre i Hotsak for å behandle denne saken?',
                      beskrivelse: 'Vi er interessert i å lære mer om hvordan Hotsak kan bli et bedre system for dere',
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
          tekst: 'Må kontakte formidler/bruker',
          tips: {
            tittel: 'Kan du bruke notatfunksjonen i Hotsak og behandle saken her?',
            tekst:
              'Du trenger ikke overføre saken selv om du må kontakte formidler/bruker. Du kan i stedet lage et forvaltningsnotat direkte i Hotsak, og legge inn opplysningene der. Hvis informasjonen er kommet via e-post, følg rutinen for journalføring av e-post',
          },
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
                      tekst:
                        'Oppgi hvorfor du vil kontakte formidler/bruker. Ikke skriv personopplysninger (navn, telefonnummer e.l), verken om bruker, formidler eller andre. ',
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
          tekst: 'Må vurderes av noen som ikke jobber i Hotsak',
          tips: {
            tittel: 'Bør flere ta i bruk Hotsak?',
            tekst:
              'I tiden fremover vil stadig flere typer saker sendes til Hotsak. Derfor bør så mange som mulig ta i bruk Hotsak, slik at dere ikke må bruke tid på å overføre saker til Gosys og journalføre dem der.',
          },
          spørsmål: [
            {
              type: 'fritekst',
              tekst: 'Har du noen tanker om hvorfor ikke flere jobber i Hotsak?',
              beskrivelse:
                'Vi er interessert i å lære med om hvordan dere jobber og hvordan Hotsak fungerer for dere. Ikke skriv navn eller andre personopplysninger.',
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
              tekst:
                'Hva er grunnen til at du vil overføre saken? Ikke skriv personopplysninger (navn, telefonnummer e.l), verken om bruker, formidler eller andre.',
              påkrevd: true,
            },
          ],
        },
      ],
      påkrevd: true,
    },
  ],
}
