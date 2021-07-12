import React from 'react'

import { CellContent } from '../table/rader/CellContent'

import { Tooltip } from '../Tooltip';
import { TekstMedEllipsis } from '../TekstMedEllipsis'
import { capitalize } from '../utils/stringFormating';

interface StatusProps {
  status: string,
  saksID: string
}

export const Status = React.memo(({ status, saksID }: StatusProps) => {

    const id = `status-${saksID}`;
    const formatertStatus = capitalize(status)
  return (
    <CellContent width={120}  data-for={id} data-tip={formatertStatus}>
      <TekstMedEllipsis>{capitalize(formatertStatus)}</TekstMedEllipsis>
      {status.length > 18 && <Tooltip id={id} />}
    </CellContent>
  )
})

