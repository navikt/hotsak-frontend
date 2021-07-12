import React from 'react'

import { CellContent } from '../table/rader/CellContent'

import dayjs from 'dayjs'

import { NORSK_DATOFORMAT, ISO_DATOFORMAT } from '../utils/date'
import { Normaltekst } from 'nav-frontend-typografi'

interface FødselsdatoProps {
  fødselsdato?: string
}

const formaterFødselsdato = (fødselsdato: string) => {
    return dayjs(fødselsdato, ISO_DATOFORMAT ).format(NORSK_DATOFORMAT)
}

export const Fødselsdato = React.memo(({ fødselsdato }: FødselsdatoProps) => {
  return (
    <CellContent width={100}>
      <Normaltekst>{fødselsdato ? formaterFødselsdato(fødselsdato): ''}</Normaltekst>
    </CellContent>
  )
})

