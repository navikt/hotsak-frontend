import React from 'react'


import { CellContent } from '../../felleskomponenter/table/rader/CellContent'
import { formaterFødselsnummer } from '../../utils/stringFormating'
import { Tekst } from '../../felleskomponenter/typografi'

interface FødselsnummerProps {
  fødselsnummer: string
}

export const Fødselsnummer = React.memo(({ fødselsnummer }: FødselsnummerProps) => {
  return (
    <CellContent width={100}>
      <Tekst>{formaterFødselsnummer(fødselsnummer)}</Tekst>
    </CellContent>
  )
})
