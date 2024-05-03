import React from 'react'

import { Tekst } from '../../felleskomponenter/typografi'
import { Levering, Leveringsmåte as LeveringsmåteType } from '../../types/types.internal'

export interface LeveringsmåteProps {
  levering: Levering
  adresseBruker: string
}

export function Leveringsmåte({ levering, adresseBruker }: LeveringsmåteProps) {
  const [leveringsmåteTekst] = lagLeveringsmåteTekst(levering, adresseBruker)
  return <Tekst>{leveringsmåteTekst}</Tekst>
}

export function lagLeveringsmåteTekst({ leveringsmåte, adresse }: Levering, adresseBruker: string) {
  switch (leveringsmåte) {
    case LeveringsmåteType.ALLEREDE_LEVERT:
      return ['Allerede levert', '']
    case LeveringsmåteType.ANNEN_ADRESSE:
      return [`${adresse} (Annen adresse)`, adresse]
    case LeveringsmåteType.FOLKEREGISTRERT_ADRESSE:
      return [`${adresseBruker} (Folkeregistert adresse)`, adresseBruker]
    case LeveringsmåteType.HJELPEMIDDELSENTRAL:
      return ['Hentes på hjelpemiddelsentralen', '']
  }
}
