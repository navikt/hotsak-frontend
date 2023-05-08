import { GrunnlagMetadata } from '../../../../types/types.internal'

const vilkårMetadata = [
  {
    identifikator: 'Under18ÅrPåBestillingsdato v1',
    basertPå: ['Bestillingsdato', 'Barnets alder (PDL)'],
  },
  {
    identifikator: 'MedlemAvFolketrygden v1',
    basertPå: ['Medlemskap på bestillingsdato'],
  },
  {
    identifikator: 'bestiltHosOptiker',
    beskrivelse: 'For at en virksomhet/nettbutikk skal kunne godkjennes, må det være en optiker tilknyttet denne.',
    basertPå: ['Bestillingsbekreftelsen'],
  },
  {
    identifikator: 'komplettBrille',
    beskrivelse: 'Bestillingen må inneholde glass, det gis ikke støtte til kun innfatning.',
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
    beskrivelse:
      'Kravet må settes fram innen seks måneder regnet fra den datoen brillen ble bestilt. Fristen på 6 måneder gjelder fra da kravet tidligst kunne vært fremsatt (Folketrygdloven § 22-13, 2.).',
    basertPå: ['Bestillingsdato'],
  },
  {
    identifikator: 'Bestillingsdato v1',
    beskrivelse: 'Brillen må være bestilt etter at forskriften trådte i kraft, 1. august 2022.',
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
      lagtInnAvSaksbehandler: true,
      beskrivelse: '',
    },
  ],
  [
    'eksisterendeVedtakDato',
    {
      etikett: 'Eksisterende vedtaksdato',
      lagtInnAvSaksbehandler: false,
      beskrivelse: 'Dato for når barnet sist har bestilt brille på denne ordningen.',
    },
  ],
  [
    'barnetsAlder',
    {
      etikett: 'Barnets fødselsdato',
      lagtInnAvSaksbehandler: false,
      beskrivelse: 'Hentet fra PDL.',
    },
  ],
  [
    'datoOrdningenStartet',
    {
      etikett: 'Forskriften trådte i kraft',
      lagtInnAvSaksbehandler: false,
      beskrivelse: 'Forskrift om stønad til briller til barn',
    },
  ],
  [
    'seksMånederSiden',
    {
      etikett: 'Fristen på 6 måneder gjelder fra',
      lagtInnAvSaksbehandler: false,
      beskrivelse: '',
    },
  ],
  [
    'høyreSfære',
    {
      etikett: 'Høyre sfære',
      lagtInnAvSaksbehandler: false,
      beskrivelse: '',
    },
  ],
  [
    'høyreSylinder',
    {
      etikett: 'Høyre sylinder',
      lagtInnAvSaksbehandler: false,
      beskrivelse: '',
    },
  ],
  [
    'venstreSfære',
    {
      etikett: 'Venstre sfære',
      lagtInnAvSaksbehandler: false,
      beskrivelse: '',
    },
  ],
  [
    'venstreSylinder',
    {
      etikett: 'Venstre sylinder',
      lagtInnAvSaksbehandler: true,
      beskrivelse: '',
    },
  ],
])
