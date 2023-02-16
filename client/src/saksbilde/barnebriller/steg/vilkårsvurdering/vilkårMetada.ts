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
