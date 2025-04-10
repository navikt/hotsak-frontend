import type { ISpørreundersøkelse } from './spørreundersøkelser'

export const journalført_notat_feilregistrert_v1: ISpørreundersøkelse = {
  skjema: 'journalført_notat_feilregistrert_v1',
  tittel: 'Er du sikker på at du vil feilregistrere notatet?',
  spørsmål: [
    {
      type: 'enkeltvalg',
      tekst: 'Hvorfor skal notatet feilregistreres?',
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
