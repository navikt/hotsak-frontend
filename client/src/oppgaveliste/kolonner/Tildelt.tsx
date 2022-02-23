import React from 'react'

import { TekstMedEllipsis } from '../../felleskomponenter/TekstMedEllipsis'
import { Tooltip } from '../../felleskomponenter/Tooltip'

interface TildeltProps {
  name: string
  saksid: string
}

export const Tildelt = ({ name, saksid }: TildeltProps) => {
  const id = `tildelt-${saksid}`

  return (
    <div data-tip={name} data-for={id}>
      <TekstMedEllipsis>{name}</TekstMedEllipsis>
      {name.length > 15 && <Tooltip id={id} />}
    </div>
  )
}
