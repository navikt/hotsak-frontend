import React from 'react'

import { TekstMedEllipsis } from '../../felleskomponenter/TekstMedEllipsis'
import { Tooltip } from '../../felleskomponenter/Tooltip'

interface StatusProps {
  status: string
  saksID: string
}

export const Status = React.memo(({ status, saksID }: StatusProps) => {
  const id = `status-${saksID}`
  return (
    <div data-for={id} data-tip={status}>
      <TekstMedEllipsis>{status}</TekstMedEllipsis>
      {status.length > 18 && <Tooltip id={id} />}
    </div>
  )
})
