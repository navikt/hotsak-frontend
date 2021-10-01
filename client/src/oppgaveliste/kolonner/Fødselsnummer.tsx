import React from 'react'

import { Normaltekst } from 'nav-frontend-typografi'

import { CellContent } from '../../felleskomponenter/table/rader/CellContent'
import { formaterFødselsnummer } from '../../utils/stringFormating'

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
