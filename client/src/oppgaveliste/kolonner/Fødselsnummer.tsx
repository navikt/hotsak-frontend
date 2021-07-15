import { Normaltekst } from 'nav-frontend-typografi'
import React from 'react'
import { formaterFødselsnummer } from '../../utils/stringFormating'

import { CellContent } from '../../felleskomponenter/table/rader/CellContent'

interface FødselsnummerProps {
  fødselsnummer: string
}



export const Fødselsnummer = React.memo(({ fødselsnummer }: FødselsnummerProps) => {

  return (
    <CellContent width={100}>
      <Normaltekst>{formaterFødselsnummer(fødselsnummer)}</Normaltekst>
    </CellContent>
  )
})

