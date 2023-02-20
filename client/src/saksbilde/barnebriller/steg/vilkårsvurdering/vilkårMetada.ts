import { GrunnlagMetadata } from '../../../../types/types.internal'

const vilkårMetadata = [
  {
    identifikator: 'Under18ÅrPåBestillingsdato v1',
    basertPå: ['Barnets alder (PDL)', 'Bestillingsdato'],
  },
  {
    identifikator: 'MedlemAvFolketrygden v1',
    basertPå: ['Medlemskap på bestillingsdato'],
  },
  {
    identifikator: 'bestiltHosOptiker',
    basertPå: ['Bestillingsbekreftelsen'],
  },
  {
    identifikator: 'komplettBrille',
    basertPå: ['Bestillingsbekreftelsen'],
  },
  {
    identifikator: 'HarIkkeVedtakIKalenderåret v1',
    basertPå: ['Bestillingsdato', 'Vedtakshistorikk (Hotsak, Krav-appen)'],
  },
  {
    identifikator: 'Brillestyrke v1',
    basertPå: ['Brillestyrke'],
  },
  {
    identifikator: 'BestillingsdatoTilbakeITid v1',
    basertPå: ['Bestillingsdato'],
  },
  {
    identifikator: 'Bestillingsdato v1',
    basertPå: ['Bestillingsdato'],
  },
]

export function metadataFor(vilkårID: string) {
  return vilkårMetadata.find((vilkår) => vilkår.identifikator === vilkårID)
}

export const grunnlagMetadata = new Map<string, GrunnlagMetadata>([
  [
    'bestillingsdato',
    {
      etikett: 'Bestillingsdato',
      beskrivelse:
        "Lagt inn av saksbehandler. Hvis informasjonen er lagt inn feil, må du legge inn riktig under 'Registrer søknad'.",
    },
  ],
  [
    'eksisterendeVedtakDato',
    {
      etikett: 'Eksisterende vedtaksdato',
      beskrivelse: 'Dato for når barnet sist har bestilt brille på denne ordningen.',
    },
  ],
  [
    'barnetsAlder',
    {
      etikett: 'Barnets alder',
      beskrivelse: 'Alder på barnet. Beregnet ut fra fødselsdato hente fra PDL.',
    },
  ],
  [
    'datoOrdningenStartet',
    {
      etikett: 'Ikrafttredelsesdato',
      beskrivelse: 'Dato for når ordningen trådte i kraft (1.8 2022).',
    },
  ],
  [
    'seksMånederSiden',
    {
      etikett: 'Siste gyldige bestillingsdato',
      beskrivelse:
        'Man kan kun søke om tilskudd til briller 6 måneder tilbake i tid. Bestillingsdato kan ikke være før denne.@',
    },
  ],
])
