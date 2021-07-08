import React from 'react'

import { TekstMedEllipsis } from '../../TekstMedEllipsis'
import { Tooltip } from '../../Tooltip'
import { CellContent } from './CellContent'

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
