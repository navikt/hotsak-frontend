import { GrunnlagMetadata } from '../../../../types/types.internal'

const vilkårMetadata = [
  {
    identifikator: 'Under18ÅrPåBestillingsdato v1',
    beskrivelse: 'Her kommer en litt med utfyllende tekst som sier noe juridisk korrekt om vilkåret.',
    basertPå: ['Barnets alder (PDL)', 'Bestillingsdato'],
  },
  {
    identifikator: 'MedlemAvFolketrygden v1',
    beskrivelse: 'Her kommer en litt med utfyllende tekst som sier noe juridisk korrekt om vilkåret.',
    basertPå: ['Medlemskap på bestillingsdato'],
  },
  {
    identifikator: 'bestiltHosOptiker',
    beskrivelse: 'Her kommer en litt med utfyllende tekst som sier noe juridisk korrekt om vilkåret.',
    basertPå: ['Bestillingsbekreftelsen'],
  },
  {
    identifikator: 'komplettBrille',
    beskrivelse: 'Her kommer en litt med utfyllende tekst som sier noe juridisk korrekt om vilkåret.',
    basertPå: ['Bestillingsbekreftelsen'],
  },
  {
    identifikator: 'HarIkkeVedtakIKalenderåret v1',
    beskrivelse: 'Her kommer en litt med utfyllende tekst som sier noe juridisk korrekt om vilkåret.',
    basertPå: ['Bestillingsdato', 'Vedtakshistorikk (Hotsak, Krav-appen)'],
  },
  {
    identifikator: 'Brillestyrke v1',
    beskrivelse: 'Her kommer en litt med utfyllende tekst som sier noe juridisk korrekt om vilkåret.',
    basertPå: ['Brillestyrke'],
  },
  {
    identifikator: 'BestillingsdatoTilbakeITid v1',
    beskrivelse:
      'Kravet må settes fram innen seks måneder regnet fra den datoen brillen ble bestilt. Fristen på 6 måneder gjelder fra da kravet tidligst kunne vært fremsatt (Folketrygdloven § 22-13, 2 ledd). Brillen må være bestilt etter at forskriften trådte i kraft 1. august 2022.',
    basertPå: ['Bestillingsdato'],
  },
  {
    identifikator: 'Bestillingsdato v1',
    beskrivelse: 'Her kommer en litt med utfyllende tekst som sier noe juridisk korrekt om vilkåret.',
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
        'Man kan kun søke om tilskudd til briller 6 måneder tilbake i tid. Bestillingsdato kan ikke være før denne.',
    },
  ],
  [
    'høyreSfære',
    {
      etikett: 'Høyre sfære',
      beskrivelse: '',
    },
  ],
  [
    'høyreSylinder',
    {
      etikett: 'Høyre sylinder',
      beskrivelse: '',
    },
  ],
  [
    'venstreSfære',
    {
      etikett: 'Venstre sfære',
      beskrivelse: '',
    },
  ],
  [
    'venstreSylinder',
    {
      etikett: 'Venstre sylinder',
      beskrivelse: '',
    },
  ],
])
