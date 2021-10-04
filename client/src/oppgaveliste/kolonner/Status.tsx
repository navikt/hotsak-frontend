import React from 'react'

import { CellContent } from '../../felleskomponenter/table/rader/CellContent'

import { TekstMedEllipsis } from '../../felleskomponenter/TekstMedEllipsis'
import { Tooltip } from '../../felleskomponenter/Tooltip'

interface StatusProps {
  status: string
  saksID: string
}

export const Status = React.memo(({ status, saksID }: StatusProps) => {
  const id = `status-${saksID}`
  // const formatertStatus = capitalize(status)
  return (
    <CellContent width={150} data-for={id} data-tip={status}>
      <TekstMedEllipsis>{status}</TekstMedEllipsis>
      {status.length > 18 && <Tooltip id={id} />}
    </CellContent>
  )
})
