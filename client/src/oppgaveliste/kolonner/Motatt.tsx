import React from 'react'

import { CellContent } from '../../felleskomponenter/table/rader/CellContent'
import { norskTimestamp } from '../../utils/date'
import { Tekst } from '../../felleskomponenter/typografi'

interface MottattProps {
  dato: string
}


export const Motatt = React.memo(({ dato }: MottattProps) => {
  return (
    <CellContent width={140}>
      <Tekst>{norskTimestamp(dato)}</Tekst>
    </CellContent>
  )
})
