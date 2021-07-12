import { Normaltekst } from 'nav-frontend-typografi'
import React from 'react'

import { CellContent } from '../../felleskomponenter/table/rader/CellContent'

interface FødselsnummerProps {
  fødselsnummer: string
}

const formaterFødselsnummer = (fødselsnummer: string) => {
    return `${fødselsnummer.slice(0, 6)} ${fødselsnummer.slice(6)}`
}

export const Fødselsnummer = React.memo(({ fødselsnummer }: FødselsnummerProps) => {

  return (
    <CellContent width={100}>
      <Normaltekst>{formaterFødselsnummer(fødselsnummer)}</Normaltekst>
    </CellContent>
  )
})

