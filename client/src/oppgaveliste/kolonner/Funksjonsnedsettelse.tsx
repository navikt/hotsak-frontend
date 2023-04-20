import React from 'react'

import { capitalize } from '../../utils/stringFormating'

import { TekstMedEllipsis } from '../../felleskomponenter/TekstMedEllipsis'
import { TooltipWrapper } from '../../felleskomponenter/TooltipWrapper'

interface FunksjonsnedsettelseProps {
  funksjonsnedsettelser: string[]
}

export const Funksjonsnedsettelse = React.memo(({ funksjonsnedsettelser }: FunksjonsnedsettelseProps) => {
  const funksjonsnedsettelse = capitalize(funksjonsnedsettelser.join(', '))

  return (
    <TooltipWrapper visTooltip={funksjonsnedsettelse.length > 18} content={funksjonsnedsettelse}>
      <TekstMedEllipsis>{funksjonsnedsettelse}</TekstMedEllipsis>
    </TooltipWrapper>
  )
})
