import styled from 'styled-components'

import { Tag } from '@navikt/ds-react'

import { OppgaveStatusLabel, OppgaveStatusType, VedtakStatusLabel, VedtakStatusType } from '../../types/types.internal'

export const StatusTag = ({
  sakStatus,
  vedtakStatus,
}: {
  sakStatus: OppgaveStatusType
  vedtakStatus?: VedtakStatusType
}) => {
  return (
    <TagWrapper>
      <Tag data-testid="tag-sak-status" size="small" variant={tagVariant(sakStatus, vedtakStatus)}>
        {sakStatus === OppgaveStatusType.VEDTAK_FATTET && vedtakStatus
          ? VedtakStatusLabel.get(vedtakStatus)
          : OppgaveStatusLabel.get(sakStatus)}
      </Tag>
    </TagWrapper>
  )
}

const tagVariant = (status: OppgaveStatusType, vedtakStatus?: VedtakStatusType) => {
  switch (status) {
    case OppgaveStatusType.AVVENTER_DOKUMENTASJON:
      return 'warning'
    case OppgaveStatusType.VEDTAK_FATTET:
      if (vedtakStatus && vedtakStatus === VedtakStatusType.INNVILGET) return 'success'
      if (vedtakStatus && vedtakStatus === VedtakStatusType.AVSLÅTT) return 'error'
      else return 'info'
    case OppgaveStatusType.AVVIST:
    case OppgaveStatusType.RETURNERT:
      return 'error'
    default:
      return 'info'
  }
}

const TagWrapper = styled.div`
  white-space: nowrap;
  //margin: auto;
  //padding-right: var(--a-spacing-4);
`
