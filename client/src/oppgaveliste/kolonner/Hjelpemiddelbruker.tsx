import React from 'react'

import { capitalizeName } from '../../utils/stringFormating'
import { TooltipWrapper } from '../../felleskomponenter/TooltipWrapper'
import { OppgaveBruker } from '../../types/types.internal'
import { TekstMedEllipsis } from '../../felleskomponenter/typografi'

interface HjelpemiddelbrukerProps {
  bruker: OppgaveBruker
}

const getFormattedName = (bruker: OppgaveBruker): string => {
  const { fornavn, mellomnavn, etternavn } = bruker

  return capitalizeName(`${etternavn}, ${fornavn} ${mellomnavn ? `${mellomnavn}` : ''}`)
}

export const Hjelpemiddelbruker = React.memo(({ bruker }: HjelpemiddelbrukerProps) => {
  const formatertNavn = getFormattedName(bruker)

  return (
    <TooltipWrapper visTooltip={formatertNavn.length > 20} content={formatertNavn}>
      <TekstMedEllipsis>{formatertNavn}</TekstMedEllipsis>
    </TooltipWrapper>
  )
})
