import React from 'react'

import { CellContent } from '../../felleskomponenter/table/rader/CellContent'
import { capitalizeName } from '../../utils/stringFormating'

import { TekstMedEllipsis } from '../../felleskomponenter/TekstMedEllipsis'
import { Tooltip } from '../../felleskomponenter/Tooltip'
import { Personinfo } from '../../types/types.internal'

interface HjelpemiddelbrukerProps {
  person: Personinfo
  saksID: string
}

const getFormattedName = (personinfo: Personinfo): string => {
  const { fornavn, mellomnavn, etternavn } = personinfo

  return capitalizeName(`${etternavn}, ${fornavn} ${mellomnavn ? `${mellomnavn}` : ''}`)
}

export const Hjelpemiddelbruker = React.memo(({ person, saksID }: HjelpemiddelbrukerProps) => {
  const id = `hjelpemiddelbruker-${saksID}`
  const formatertNavn = getFormattedName(person)

  return (
    <CellContent width={140} data-for={id} data-tip={formatertNavn}>
      <TekstMedEllipsis>{formatertNavn}</TekstMedEllipsis>
      {formatertNavn.length > 19 && <Tooltip id={id} />}
    </CellContent>
  )
})
