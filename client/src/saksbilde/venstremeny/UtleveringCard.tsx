import { CardTitle } from './CardTitle'
import React from 'react'
import { Card } from './Card'
import { Formidler, Kontaktperson as IKontaktperson, Levering } from '../../types/types.internal'
import { CardRow } from './CardRow'
import { HouseIcon, InformationSquareIcon } from '@navikt/aksel-icons'
import { lagKontaktpersonTekst } from '../bruker/Kontaktperson'
import { lagLeveringsmåteTekst } from '../bruker/Leveringsmåte'

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
          {kontaktpersonTekst}
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
