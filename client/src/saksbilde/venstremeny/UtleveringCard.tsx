import { CardTitle } from './CardTitle'
import React from 'react'
import { Card } from './Card'
import {
  Formidler,
  Kontaktperson as IKontaktperson,
  Levering,
  Leveringsmåte as LeveringsmåteType,
} from '../../types/types.internal'
import { CardRow } from './CardRow'
import { HouseIcon, InformationSquareIcon } from '@navikt/aksel-icons'
import { lagKontaktpersonTekst } from '../bruker/Kontaktperson'

export interface UtleveringCardProps {
  formidler: Formidler
  levering: Levering
  adresseBruker: string
  kontaktperson?: IKontaktperson
}

export function UtleveringCard(props: UtleveringCardProps) {
  const { formidler, levering, adresseBruker } = props
  const { kontaktperson, merknad } = levering
  const [leveringsmåteTekst, leveringsmåteCopyText] = lagLeveringsmåteTekst(levering, adresseBruker)
  const kontaktpersonTekst = lagKontaktpersonTekst(formidler, kontaktperson)
  return (
    <Card>
      <CardTitle level="1" size="medium">
        Utlevering
      </CardTitle>
      <CardRow icon={<HouseIcon />} copyText={leveringsmåteCopyText}>
        {leveringsmåteTekst}
      </CardRow>
      {kontaktpersonTekst && (
        <CardRow icon={<InformationSquareIcon />} copyText={kontaktpersonTekst}>
          Kontaktperson: {kontaktpersonTekst}
        </CardRow>
      )}
      {merknad && (
        <CardRow icon={<InformationSquareIcon />} copyText={merknad}>
          Merknad: {merknad}
        </CardRow>
      )}
    </Card>
  )
}

function lagLeveringsmåteTekst({ leveringsmåte, adresse }: Levering, adresseBruker: string): [string, string] {
  switch (leveringsmåte) {
    case LeveringsmåteType.ALLEREDE_LEVERT:
      return ['Allerede levert', 'Allerede levert']
    case LeveringsmåteType.ANNEN_ADRESSE:
      return [`Til annen adresse: ${adresse}`, adresse || '']
    case LeveringsmåteType.FOLKEREGISTRERT_ADRESSE:
      return [`Til folkeregistert adresse: ${adresseBruker}`, adresseBruker]
    case LeveringsmåteType.HJELPEMIDDELSENTRAL:
      return ['Hentes på hjelpemiddelsentralen', 'Hentes på hjelpemiddelsentralen']
  }
}
