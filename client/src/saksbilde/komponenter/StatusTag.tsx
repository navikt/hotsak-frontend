import { Tag, type TagProps } from '@navikt/ds-react'

import { SaksstatusLabel, Saksstatus, VedtakStatusLabel, VedtakStatusType } from '../../types/types.internal'
import classes from './StatusTag.module.css'

export function StatusTag({ saksstatus, vedtaksstatus }: { saksstatus: Saksstatus; vedtaksstatus?: VedtakStatusType }) {
  return (
    <Tag
      className={classes.root}
      data-testid="tag-sak-status"
      size="small"
      variant={tagVariant(saksstatus, vedtaksstatus)}
    >
      {saksstatus === Saksstatus.FERDIGBEHANDLET && vedtaksstatus
        ? VedtakStatusLabel.get(vedtaksstatus)
        : SaksstatusLabel.get(saksstatus)}
    </Tag>
  )
}

function tagVariant(saksstatus: Saksstatus, vedtaksstatus?: VedtakStatusType): TagProps['variant'] {
  switch (saksstatus) {
    case Saksstatus.AVVENTER_DOKUMENTASJON:
      return 'warning'
    case Saksstatus.FERDIGBEHANDLET:
      if (vedtaksstatus === VedtakStatusType.INNVILGET) return 'success'
      if (vedtaksstatus === VedtakStatusType.AVSLÅTT) return 'error'
      else return 'info'
    default:
      return 'info'
  }
}
