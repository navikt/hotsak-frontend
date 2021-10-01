import React from 'react'

import { TekstMedEllipsis } from '../../felleskomponenter/TekstMedEllipsis'
import { Tooltip } from '../../felleskomponenter/Tooltip'
import { CellContent } from '../../felleskomponenter/table/rader/CellContent'

interface GjelderProps {
  søknadOm: string
  saksID: string
}

export const Gjelder = React.memo(({ søknadOm, saksID }: GjelderProps) => {
  const id = `gjelder-${saksID}`

  return (
    <CellContent width={128} data-for={id} data-tip={søknadOm}>
      <TekstMedEllipsis>{søknadOm}</TekstMedEllipsis>
      {søknadOm.length > 18 && <Tooltip id={id} />}
    </CellContent>
  )
})
