import { Tag, type TagProps } from '@navikt/ds-react'

import {
  type BehandlingsutfallType,
  Bestillingsresultat,
  Henleggelsesårsak,
  OverførtTil,
  VedtaksResultat,
} from './behandling/behandlingTyper'

export function BehandlingsutfallTag({ utfall }: { utfall?: BehandlingsutfallType | null }) {
  if (!utfall) return null
  const { label, variant } = behandlingsutfallTagPropsByUtfall[utfall]
  return (
    <Tag size="small" variant={variant}>
      {label}
    </Tag>
  )
}

const behandlingsutfallTagPropsByUtfall: Record<
  BehandlingsutfallType,
  {
    label: string
    variant: TagProps['variant']
  }
> = {
  [VedtaksResultat.INNVILGET]: { label: 'Innvilget', variant: 'success-moderate' },
  [VedtaksResultat.DELVIS_INNVILGET]: { label: 'Delvis innvilget', variant: 'warning-moderate' },
  [VedtaksResultat.AVSLÅTT]: { label: 'Avslått', variant: 'error-moderate' },

  [Bestillingsresultat.GODKJENT]: { label: 'Godkjent', variant: 'success-moderate' },
  [Bestillingsresultat.AVVIST]: { label: 'Avvist', variant: 'error-moderate' },

  [Henleggelsesårsak.BRUKER_ER_DØD]: { label: 'Henlagt - Bruker er død', variant: 'neutral-moderate' },
  [Henleggelsesårsak.DUPLIKAT]: { label: 'Henlagt - Duplikat', variant: 'neutral-moderate' },
  [Henleggelsesårsak.FEIL_BRUKER]: { label: 'Henlagt - Feil bruker', variant: 'neutral-moderate' },
  [Henleggelsesårsak.FEIL_HJELPEMIDDEL]: { label: 'Henlagt - Feil hjelpemiddel', variant: 'neutral-moderate' },
  [Henleggelsesårsak.FLERE_SØKNADER_SAMME_BEHOV]: {
    label: 'Henlagt - Flere søknader samme behov',
    variant: 'neutral-moderate',
  },
  [Henleggelsesårsak.SØKNAD_TRUKKET]: { label: 'Henlagt - Søknad trukket', variant: 'neutral-moderate' },
  [Henleggelsesårsak.ANNET]: { label: 'Henlagt - Annet', variant: 'neutral-moderate' },

  [OverførtTil.GOSYS]: { label: 'Overført til Gosys', variant: 'neutral-moderate' },
}
