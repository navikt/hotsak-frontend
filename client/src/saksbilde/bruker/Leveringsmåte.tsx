import React from 'react'

import { Tekst } from '../../felleskomponenter/typografi'
import { Levering, Leveringsmåte as LeveringsmåteType } from '../../types/types.internal'

export interface LeveringsmåteProps {
  levering: Levering
  brukerAdresse: string
}

export function Leveringsmåte({ levering, brukerAdresse }: LeveringsmåteProps) {
  const { adresse, leveringsmåte } = levering

  let leveringsmåteTekst = ''
  switch (leveringsmåte) {
    case LeveringsmåteType.ALLEREDE_LEVERT:
      leveringsmåteTekst = 'Allerede levert'
      break
    case LeveringsmåteType.ANNEN_ADRESSE:
      leveringsmåteTekst = `${adresse} (Annen adresse)`
      break
    case LeveringsmåteType.FOLKEREGISTRERT_ADRESSE:
      leveringsmåteTekst = `${brukerAdresse} (Folkeregistert adresse)`
      break
    case LeveringsmåteType.HJELPEMIDDELSENTRAL:
      leveringsmåteTekst = 'Hentes på hjelpemiddelsentralen'
      break
  }

  return <Tekst>{leveringsmåteTekst}</Tekst>
}
