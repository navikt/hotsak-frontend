import React from 'react'

import { CellContent } from '../../felleskomponenter/table/rader/CellContent'
import { formaterFødselsdato } from '../../utils/date'

import { Normaltekst } from 'nav-frontend-typografi'

interface FødselsdatoProps {
  fødselsdato?: string
}



export const Fødselsdato = React.memo(({ fødselsdato }: FødselsdatoProps) => {
  return (
    <CellContent width={100}>
      <Normaltekst>{fødselsdato ? formaterFødselsdato(fødselsdato): ''}</Normaltekst>
    </CellContent>
  )
})

