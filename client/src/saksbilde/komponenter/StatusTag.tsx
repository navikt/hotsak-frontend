import { Tag, type TagProps } from '@navikt/ds-react'

import { OppgaveStatusLabel, OppgaveStatusType, VedtakStatusLabel, VedtakStatusType } from '../../types/types.internal'
import classes from './StatusTag.module.css'

export function StatusTag({
  saksstatus,
  vedtaksstatus,
}: {
  saksstatus: OppgaveStatusType
  vedtaksstatus?: VedtakStatusType
}) {
  return (
    <Tag
      className={classes.root}
      data-testid="tag-sak-status"
      size="small"
      variant={tagVariant(saksstatus, vedtaksstatus)}
    >
      {saksstatus === OppgaveStatusType.VEDTAK_FATTET && vedtaksstatus
        ? VedtakStatusLabel.get(vedtaksstatus)
        : OppgaveStatusLabel.get(saksstatus)}
    </Tag>
  )
}

function tagVariant(saksstatus: OppgaveStatusType, vedtaksstatus?: VedtakStatusType): TagProps['variant'] {
  switch (saksstatus) {
    case OppgaveStatusType.AVVENTER_DOKUMENTASJON:
      return 'warning'
    case OppgaveStatusType.VEDTAK_FATTET:
      if (vedtaksstatus === VedtakStatusType.INNVILGET) return 'success'
      if (vedtaksstatus === VedtakStatusType.AVSLÅTT) return 'error'
      else return 'info'
    case OppgaveStatusType.AVVIST:
      return 'error'
    default:
      return 'info'
  }
}
