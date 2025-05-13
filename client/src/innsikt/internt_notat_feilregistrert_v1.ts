import type { ISpørreundersøkelse } from './spørreundersøkelser'

export const internt_notat_feilregistrert_v1: ISpørreundersøkelse = {
  skjema: 'internt_notat_feilregistrert_v1',
  tittel: 'Er du sikker på at du vil feilregistrere det interne notatet?',
  spørsmål: [
    {
      type: 'enkeltvalg',
      tekst: 'Hvorfor skal notatet feilregistreres?',
      påkrevd: true,
      alternativer: [
        'Opprettet på feil bruker',
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
