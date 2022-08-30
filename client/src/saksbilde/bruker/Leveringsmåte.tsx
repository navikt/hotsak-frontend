import React from 'react'

import { Tekst } from '../../felleskomponenter/typografi'
import { Levering, Leveringsmåte } from '../../types/types.internal'

interface LeveringProps {
  levering: Levering
  brukerAdresse: string
}

export const LeveringsMåte: React.FC<LeveringProps> = ({ levering, brukerAdresse }) => {
  const { adresse, leveringsmåte } = levering

  let leveringsTekst = ''
  switch (leveringsmåte) {
    case Leveringsmåte.ALLEREDE_LEVERT:
      leveringsTekst = 'Allerede levert'
      break
    case Leveringsmåte.ANNEN_ADRESSE:
      leveringsTekst = `${adresse} (Annen adresse)`
      break
    case Leveringsmåte.FOLKEREGISTRERT_ADRESSE:
      leveringsTekst = `${brukerAdresse} (Folkeregistert adresse)`
      break
    case Leveringsmåte.HJELPEMIDDELSENTRAL:
      leveringsTekst = 'Hentes på hjelpemiddelsentralen'
      break
  }

  return <Tekst>{leveringsTekst}</Tekst>
}
