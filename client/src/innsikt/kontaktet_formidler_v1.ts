import type { ISpørreundersøkelse } from './spørreundersøkelser'

const påkrevd = 'Du må svare på spørsmålet før du innvilger søknaden.'

export const kontaktet_formidler_v1: ISpørreundersøkelse = {
  skjema: 'barnebrillesak_overført_gosys_v1',
  tittel: 'Spørreundersøkelse',
  spørsmål: [
    {
      type: 'enkeltvalg',
      tekst: 'Har du kontaktet formidler for å innhente mer informasjon?',
      alternativer: [
        {
          type: 'oppfølgingsspørsmål',
          tekst: 'Ja',
          spørsmål: [
            {
              type: 'flervalg',
              tekst: 'Hva slags informasjon fikk du fra formidler?',
              påkrevd,
              alternativer: [
                'At det var en byttesak. Bruker har tilsvarende hjelpemiddel fra før.',
                'Begrunnelse for hvorfor bruker trengte en til. Bruker har tilsvarende hjelpemiddel fra før.',
                'Begrunnelse for tilbehør.',
                'Mer informasjon om brukers behov og situasjon.',
                'At rimeligere tiltak er vurdert.',
                {
                  type: 'oppfølgingsspørsmål',
                  tekst: 'Annet',
                  spørsmål: [
                    {
                      type: 'fritekst',
                      tekst: 'Utdyp svaret ditt her. Ikke skriv personopplysninger.',
                      påkrevd,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'oppfølgingsspørsmål',
          tekst: 'Nei',
          spørsmål: [
            {
              type: 'flervalg',
              tekst: 'Hvorfor trengte du ikke å kontakte formidler?',
              påkrevd,
              alternativer: [
                'Jeg hadde nok opplysninger.',
                'På sentralen vår skal vi ikke innhente informasjon på saker under et visst beløp.',
                'Jeg har tillit til kommunen, som vi har fått beskjed om at vi skal ha.',
                {
                  type: 'oppfølgingsspørsmål',
                  tekst: 'Annet',
                  spørsmål: [
                    {
                      type: 'fritekst',
                      tekst: 'Utdyp svaret ditt her. Ikke skriv personopplysninger.',
                      påkrevd,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      påkrevd,
    },
  ],
}
