import React from 'react'

import { CellContent } from '../table/rader/CellContent'

import { Tooltip } from '../Tooltip';
import { TekstMedEllipsis } from '../TekstMedEllipsis'

interface BostedProps {
  bosted: string,
  saksID: string
}

export const Bosted = React.memo(({ bosted, saksID }: BostedProps) => {

    const id = `bosted-${saksID}`;
  return (
    <CellContent width={120}  data-for={id} data-tip={bosted}>
      <TekstMedEllipsis>{bosted}</TekstMedEllipsis>
      {bosted.length > 18 && <Tooltip id={id} />}
    </CellContent>
  )
})

