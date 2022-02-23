import React from 'react'

import { capitalize } from '../../utils/stringFormating'

import { TekstMedEllipsis } from '../../felleskomponenter/TekstMedEllipsis'
import { Tooltip } from '../../felleskomponenter/Tooltip'

interface FunksjonsnedsettelseProps {
  funksjonsnedsettelser: string[]
  saksID: string
}

export const Funksjonsnedsettelse = React.memo(({ funksjonsnedsettelser, saksID }: FunksjonsnedsettelseProps) => {
  const id = `funksjonsnedsettelse-${saksID}`
  const funksjonsnedsettelse = capitalize(funksjonsnedsettelser.join(', '))

  return (
    <div data-for={id} data-tip={funksjonsnedsettelse}>
      <TekstMedEllipsis>{funksjonsnedsettelse}</TekstMedEllipsis>
      {funksjonsnedsettelse.length > 18 && <Tooltip id={id} />}
    </div>
  )
})
