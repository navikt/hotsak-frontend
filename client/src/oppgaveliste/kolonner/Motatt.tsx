import dayjs from 'dayjs'
import React from 'react'

import { CellContent } from '../../felleskomponenter/table/rader/CellContent'
import { NORSK_DATOFORMAT, ISO_DATOFORMAT } from '../../utils/date'
import { Tekst } from '../../felleskomponenter/typografi'

interface MottattProps {
  dato: string
}

const formaterDato = (dato: string) => {
  return dayjs(dato, ISO_DATOFORMAT).format(NORSK_DATOFORMAT)
}

export const Motatt = React.memo(({ dato }: MottattProps) => {
  return (
    <CellContent width={100}>
      <Tekst>{formaterDato(dato)}</Tekst>
    </CellContent>
  )
})
