import React from 'react'

import { CellContent } from '../../felleskomponenter/table/rader/CellContent'
import { capitalizeName } from '../../utils/stringFormating'

import { TekstMedEllipsis } from '../../felleskomponenter/TekstMedEllipsis'
import { Tooltip } from '../../felleskomponenter/Tooltip'

interface FormidlerProps {
  formidlerNavn: string
  saksID: string
}

export const FormidlerCelle = React.memo(({ formidlerNavn, saksID }: FormidlerProps) => {
  const id = `formidler-${saksID}`
  const formatertNavn = capitalizeName(formidlerNavn)

  return (
    <CellContent width={140} data-for={id} data-tip={formatertNavn}>
      <TekstMedEllipsis>{formatertNavn}</TekstMedEllipsis>
      {formatertNavn.length > 19 && <Tooltip id={id} />}
    </CellContent>
  )
})
