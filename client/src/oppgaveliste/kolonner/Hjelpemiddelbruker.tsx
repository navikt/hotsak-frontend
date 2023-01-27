import React from 'react'

import { capitalizeName } from '../../utils/stringFormating'

import { TekstMedEllipsis } from '../../felleskomponenter/TekstMedEllipsis'
import { Tooltip } from '../../felleskomponenter/Tooltip'
import { OppgaveBruker } from '../../types/types.internal'

interface HjelpemiddelbrukerProps {
  bruker: OppgaveBruker
  saksID: string
}

const getFormattedName = (bruker: OppgaveBruker): string => {
  const { fornavn, mellomnavn, etternavn } = bruker

  return capitalizeName(`${etternavn}, ${fornavn} ${mellomnavn ? `${mellomnavn}` : ''}`)
}

export const Hjelpemiddelbruker = React.memo(({ bruker, saksID }: HjelpemiddelbrukerProps) => {
  const id = `hjelpemiddelbruker-${saksID}`
  const formatertNavn = getFormattedName(bruker)

  return (
    <div data-for={id} data-tip={formatertNavn}>
      <TekstMedEllipsis>{formatertNavn}</TekstMedEllipsis>
      {formatertNavn.length > 23 && <Tooltip id={id} />}
    </div>
  )
})
