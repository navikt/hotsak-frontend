import React from 'react'

import { CellContent } from '../table/rader/CellContent'

import { TekstMedEllipsis } from '../TekstMedEllipsis'
import { Tooltip } from '../Tooltip'
import { Personinfo } from '../types/types.internal'
import { capitalizeName } from '../utils/stringFormating'

interface HjelpemiddelbrukerProps {
  person: Personinfo
  saksID: string
}

const getFormattedName = (personinfo: Personinfo): string => {

    const {fornavn, mellomnavn, etternavn} = personinfo

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

