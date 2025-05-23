import type { ISpørreundersøkelse } from './spørreundersøkelser'

export const journalført_notat_feilregistrert_v1: ISpørreundersøkelse = {
  skjema: 'journalført_notat_feilregistrert_v1',
  tittel: 'Er du sikker på at du vil feilregistrere forvaltningsnotatet?',
  spørsmål: [
    {
      type: 'enkeltvalg',
      tekst: 'Hvorfor skal notatet feilregistreres?',
      beskrivelse: 'Årsak til feilregistrering brukes kun internt og blir ikke synlig for bruker.',
      påkrevd: true,
      alternativer: [
        'Journalført på feil bruker',
        'Notatet inneholder feil',
        {
          type: 'oppfølgingsspørsmål',
          tekst: 'Annet',
          spørsmål: [
            {
              type: 'fritekst',
              tekst: 'Utdyp hvorfor notatet skal feilregistreres. Ikke skriv personopplysninger.',
              påkrevd: true,
            },
          ],
          påkrevd: true,
        },
      ],
    },
  ],
}
