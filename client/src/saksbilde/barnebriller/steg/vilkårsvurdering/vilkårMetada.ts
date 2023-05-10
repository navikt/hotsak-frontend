import { GrunnlagMetadata } from '../../../../types/types.internal'

const vilkårMetadata = [
  {
    identifikator: 'Under18ÅrPåBestillingsdato v1',
    overstyrbarAvSaksbehandler: false,
    basertPå: ['Bestillingsdato', 'Barnets alder (PDL)'],
  },
  {
    identifikator: 'MedlemAvFolketrygden v1',
    overstyrbarAvSaksbehandler: true,
    basertPå: ['Medlemskap på bestillingsdato'],
  },
  {
    identifikator: 'bestiltHosOptiker',
    overstyrbarAvSaksbehandler: false,
    beskrivelse: 'For at en virksomhet/nettbutikk skal kunne godkjennes, må det være en optiker tilknyttet denne.',
    basertPå: ['Bestillingsbekreftelsen'],
  },
  {
    identifikator: 'komplettBrille',
    overstyrbarAvSaksbehandler: false,
    beskrivelse: 'Bestillingen må inneholde glass, det gis ikke støtte til kun innfatning.',
    basertPå: ['Bestillingsbekreftelsen'],
  },
  {
    identifikator: 'HarIkkeVedtakIKalenderåret v1',
    overstyrbarAvSaksbehandler: false,
    basertPå: ['Bestillingsdato', 'Vedtakshistorikk (Hotsak, Krav-appen)'],
  },
  {
    identifikator: 'Brillestyrke v1',
    overstyrbarAvSaksbehandler: false,
    basertPå: ['Brillestyrke'],
  },
  {
    identifikator: 'BestillingsdatoTilbakeITid v1',
    overstyrbarAvSaksbehandler: false,
    beskrivelse:
      'Kravet må settes fram innen seks måneder regnet fra den datoen brillen ble bestilt. Fristen på 6 måneder gjelder fra da kravet tidligst kunne vært fremsatt (Folketrygdloven § 22-13, 2.).',
    basertPå: ['Bestillingsdato'],
  },
  {
    identifikator: 'Bestillingsdato v1',
    overstyrbarAvSaksbehandler: false,
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
      etikett: 'Tidligere vedtak i perioden',
      lagtInnAvSaksbehandler: false,
      beskrivelse: '',
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
    'lanseringsdatoForManuellInnsending',
    {
      etikett: 'Fristen på 6 måneder gjelder fra',
      lagtInnAvSaksbehandler: false,
      beskrivelse: 'Lanseringsdato for Søknad om tilskudd ved kjøp av briller til barn',
    },
  ],
  [
    'forenkletSjekkResultat',
    {
      etikett: 'Forenklet sjekk av medlemskap på bestillingsdato',
      lagtInnAvSaksbehandler: false,
      beskrivelse: 'Automatisk sjekk',
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
