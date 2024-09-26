import { HouseIcon, InformationSquareIcon } from '@navikt/aksel-icons'

import {
  Formidler,
  Kontaktperson as IKontaktperson,
  Levering,
  Leveringsmåte as LeveringsmåteType,
} from '../../types/types.internal'
import { lagKontaktpersonTekst } from '../bruker/Kontaktperson'
import { VenstremenyCard } from './VenstremenyCard.tsx'
import { VenstremenyCardRow } from './VenstremenyCardRow.tsx'

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
    <VenstremenyCard heading="Utlevering">
      <VenstremenyCardRow icon={<HouseIcon />} copyText={leveringsmåteCopyText} copyKind="leveringsmåte">
        {leveringsmåteTekst}
      </VenstremenyCardRow>
      {kontaktpersonTekst && (
        <VenstremenyCardRow icon={<InformationSquareIcon />} copyText={kontaktpersonTekst} copyKind="kontaktperson">
          Kontaktperson: {kontaktpersonTekst}
        </VenstremenyCardRow>
      )}
      {merknad && (
        <VenstremenyCardRow icon={<InformationSquareIcon />} copyText={merknad} copyKind="merknad">
          Merknad: {merknad}
        </VenstremenyCardRow>
      )}
    </VenstremenyCard>
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
