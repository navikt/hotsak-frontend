import React from 'react'

import { capitalizeName } from '../../utils/stringFormating'

import { TekstMedEllipsis } from '../../felleskomponenter/TekstMedEllipsis'
import { TooltipWrapper } from '../../felleskomponenter/TooltipWrapper'

interface FormidlerProps {
  formidlerNavn: string
}

export const FormidlerCelle = React.memo(({ formidlerNavn }: FormidlerProps) => {
  const formatertNavn = capitalizeName(formidlerNavn)

  return (
    <TooltipWrapper visTooltip={formatertNavn.length > 19} content={formatertNavn}>
      <TekstMedEllipsis>{formatertNavn}</TekstMedEllipsis>
    </TooltipWrapper>
  )
})
