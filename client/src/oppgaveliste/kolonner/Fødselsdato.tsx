import React from 'react'

import { Normaltekst } from 'nav-frontend-typografi'

import { CellContent } from '../../felleskomponenter/table/rader/CellContent'
import { formaterDato } from '../../utils/date'

interface FødselsdatoProps {
  fødselsdato?: string
}

export const Fødselsdato = React.memo(({ fødselsdato }: FødselsdatoProps) => {
  return (
    <CellContent width={100}>
      <Normaltekst>{fødselsdato ? formaterDato(fødselsdato) : ''}</Normaltekst>
    </CellContent>
  )
})
