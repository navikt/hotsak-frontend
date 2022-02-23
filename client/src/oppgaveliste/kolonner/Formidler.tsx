import React from 'react'

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
    <div data-for={id} data-tip={formatertNavn}>
      <TekstMedEllipsis>{formatertNavn}</TekstMedEllipsis>
      {formatertNavn.length > 19 && <Tooltip id={id} />}
    </div>
  )
})
