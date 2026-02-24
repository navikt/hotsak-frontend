import { Tag } from '@navikt/ds-react'
import { VedtaksResultat } from './behandling/behandlingTyper'

type TagVariant = 'success-moderate' | 'warning-moderate' | 'error-moderate' | 'neutral-moderate'

interface VedtaksresultatInfo {
  label: string
  variant: TagVariant
}

const vedtaksresultatInfo: Record<VedtaksResultat, VedtaksresultatInfo> = {
  [VedtaksResultat.INNVILGET]: { label: 'Innvilget', variant: 'success-moderate' },
  [VedtaksResultat.DELVIS_INNVILGET]: { label: 'Delvis innvilget', variant: 'warning-moderate' },
  [VedtaksResultat.AVSLÅTT]: { label: 'Avslått', variant: 'error-moderate' },
  [VedtaksResultat.GOSYS]: { label: 'Overført til Gosys', variant: 'neutral-moderate' },
}

export function VedtaksresultatTag({ vedtaksResultat }: { vedtaksResultat?: VedtaksResultat }) {
  if (!vedtaksResultat) return null

  const { label, variant } = vedtaksresultatInfo[vedtaksResultat]

  return (
    <Tag size="small" variant={variant}>
      {label}
    </Tag>
  )
}
