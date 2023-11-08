import React from 'react'

import { TekstMedEllipsis } from '../../felleskomponenter/typografi'
import { TooltipWrapper } from '../../felleskomponenter/TooltipWrapper'

interface StatusProps {
  status: string
}

export const Status = React.memo(({ status }: StatusProps) => {
  return (
    <TooltipWrapper visTooltip={status.length > 18} content={status}>
      <TekstMedEllipsis>{status}</TekstMedEllipsis>
    </TooltipWrapper>
  )
})
