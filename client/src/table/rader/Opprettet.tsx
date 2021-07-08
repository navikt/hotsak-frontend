import dayjs, { Dayjs } from 'dayjs'
import React from 'react'

import { Normaltekst } from 'nav-frontend-typografi'

//import { somDato } from '../../../../mapping/vedtaksperiode';
import { NORSK_DATOFORMAT, ISO_DATOFORMAT } from '../../utils/date'

import { CellContent } from './CellContent'

const somDato = (dato: string): Dayjs => dayjs(dato ?? null, ISO_DATOFORMAT)

interface OpprettetProps {
  date: string
}

export const Opprettet = React.memo(({ date }: OpprettetProps) => (
  <CellContent width={100}>
    <Normaltekst>{`${somDato(date).format(NORSK_DATOFORMAT)}`}</Normaltekst>
  </CellContent>
))
