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
  [Henleggelsesårsak.DUPLIKAT]: { label: 'Henlagt - Duplikat', variant: 'error-moderate' },
  [Henleggelsesårsak.FEIL_BRUKER]: { label: 'Henlagt - Feil bruker', variant: 'error-moderate' },
  [Henleggelsesårsak.TRUKKET_AV_BEGRUNNER]: { label: 'Henlagt', variant: 'error-moderate' },
  [Henleggelsesårsak.FLERE_SØKNADER_SAMME_BEHOV]: {
    label: 'Henlagt',
    variant: 'error-moderate',
  },
  [Henleggelsesårsak.SØKNAD_TRUKKET]: { label: 'Henlagt', variant: 'error-moderate' },
  [Henleggelsesårsak.ANNET]: { label: 'Henlagt', variant: 'error-moderate' },

  [OverførtTil.GOSYS]: { label: 'Overført til Gosys', variant: 'neutral-moderate' },
}
