import React from 'react'

import { norskTimestamp } from '../../utils/date'
import { Tekst } from '../../felleskomponenter/typografi'

interface MottattProps {
  dato: string
}


export const Motatt = React.memo(({ dato }: MottattProps) => {
  return (
    <div>
      <Tekst>{norskTimestamp(dato)}</Tekst>
    </div>
  )
})
