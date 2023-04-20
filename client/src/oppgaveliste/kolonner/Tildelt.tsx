import React from 'react'

import { TekstMedEllipsis } from '../../felleskomponenter/TekstMedEllipsis'
import { TooltipWrapper } from '../../felleskomponenter/TooltipWrapper'

interface TildeltProps {
  name: string
}

export const Tildelt = ({ name }: TildeltProps) => {
  return (
    <TooltipWrapper visTooltip={name.length > 15} content={name}>
      <TekstMedEllipsis>{name}</TekstMedEllipsis>
    </TooltipWrapper>
  )
}
