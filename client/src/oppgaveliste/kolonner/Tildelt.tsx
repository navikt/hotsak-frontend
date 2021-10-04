import React from 'react'

import { CellContent } from '../../felleskomponenter/table/rader/CellContent'

import { TekstMedEllipsis } from '../../felleskomponenter/TekstMedEllipsis'
import { Tooltip } from '../../felleskomponenter/Tooltip'

interface TildeltProps {
  name: string
  saksid: string
}

export const Tildelt = ({ name, saksid }: TildeltProps) => {
  const id = `tildelt-${saksid}`

  return (
    <CellContent width={128} data-tip={name} data-for={id}>
      <TekstMedEllipsis>{name}</TekstMedEllipsis>
      {name.length > 15 && <Tooltip id={id} />}
    </CellContent>
  )
}
