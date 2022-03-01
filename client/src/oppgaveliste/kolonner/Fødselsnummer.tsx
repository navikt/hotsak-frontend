import React from 'react'

import { formaterFødselsnummer } from '../../utils/stringFormating'
import { Tekst } from '../../felleskomponenter/typografi'

interface FødselsnummerProps {
  fødselsnummer: string
}

export const Fødselsnummer = React.memo(({ fødselsnummer }: FødselsnummerProps) => {
  return (
    <div>
      <Tekst>{formaterFødselsnummer(fødselsnummer)}</Tekst>
    </div>
  )
})
