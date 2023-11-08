import React from 'react'

import { TekstMedEllipsis } from '../../felleskomponenter/typografi'
import { TooltipWrapper } from '../../felleskomponenter/TooltipWrapper'

interface BostedProps {
  bosted?: string
}

export const Bosted = React.memo(({ bosted }: BostedProps) => {
  const bostedTekst = bosted ? bosted : '-'

  return (
    <TooltipWrapper visTooltip={bostedTekst.length > 18} content={bostedTekst}>
      <TekstMedEllipsis>{bostedTekst}</TekstMedEllipsis>
    </TooltipWrapper>
  )
})
