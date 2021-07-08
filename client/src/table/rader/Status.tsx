import React from 'react'

import { Element } from 'nav-frontend-typografi'

import { CellContent } from './CellContent'

const getFormattedWarningText = (antallVarsler?: number): string =>
  !antallVarsler ? '' : antallVarsler === 1 ? '1 varsel' : `${antallVarsler} varsler`

interface StatusProps {
  numberOfWarnings: number
}

export const Status = React.memo(({ numberOfWarnings }: StatusProps) => (
  <CellContent width={100}>
    <Element>{getFormattedWarningText(numberOfWarnings)}</Element>
  </CellContent>
))
