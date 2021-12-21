import React from 'react'

import { CellContent } from '../../felleskomponenter/table/rader/CellContent'

import { TekstMedEllipsis } from '../../felleskomponenter/TekstMedEllipsis'
import { Tooltip } from '../../felleskomponenter/Tooltip'
import { capitalize } from '../../utils/stringFormating'

interface GjelderProps {
  søknadOm: string
  saksID: string
}

export const Gjelder = React.memo(({ søknadOm, saksID }: GjelderProps) => {
  const id = `gjelder-${saksID}`

  return (
    <CellContent width={168} data-for={id} data-tip={søknadOm}>
      <TekstMedEllipsis>{capitalize(søknadOm)}</TekstMedEllipsis>
      {søknadOm.length > 20 && <Tooltip id={id} />}
    </CellContent>
  )
})
