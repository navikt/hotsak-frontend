import React from 'react'

import { TekstMedEllipsis } from '../../felleskomponenter/TekstMedEllipsis'
import { Tooltip } from '../../felleskomponenter/Tooltip'

interface BostedProps {
  bosted?: string
  saksID: string
}

export const Bosted = React.memo(({ bosted, saksID }: BostedProps) => {
  const id = `bosted-${saksID}`
  return (
    <div data-for={id} data-tip={bosted}>
      <TekstMedEllipsis>{bosted ? bosted : '-'}</TekstMedEllipsis>
      {bosted && bosted.length > 18 && <Tooltip id={id} />}
    </div>
  )
})
