import { HouseIcon, InformationSquareIcon } from '@navikt/aksel-icons'

import {
  Formidler,
  Kontaktperson as IKontaktperson,
  Levering,
  Leveringsmåte as LeveringsmåteType,
} from '../../types/types.internal.ts'
import { lagKontaktpersonTekst } from '../bruker/Kontaktperson.tsx'
import { useVarselsregler } from '../varsler/useVarselsregler.tsx'
import { VarselIkon } from '../varsler/varselIkon.tsx'
import { VenstremenyCard } from './VenstremenyCard.tsx'
import { VenstremenyCardRow } from './VenstremenyCardRow.tsx'

export interface UtleveringCardProps {
  formidler: Formidler
  levering: Levering
  adresseBruker: string
  kontaktperson?: IKontaktperson
}

export function LeveringCard(props: UtleveringCardProps) {
  const { formidler, levering, adresseBruker } = props
  const { kontaktperson, merknad } = levering
  const [leveringsmåteTekst, leveringsmåteCopyText] = lagLeveringsmåteTekst(levering, adresseBruker)
  const kontaktpersonTekst = lagKontaktpersonTekst(formidler, kontaktperson)
  const { harLeveringsVarsel, harBeskjedTilKommuneVarsel } = useVarselsregler()

  return (
    <VenstremenyCard heading="Levering">
      <VenstremenyCardRow
        paddingBlock={'0 2'}
        icon={lagLeveringsIkon()}
        copyText={leveringsmåteCopyText}
        copyKind="leveringsmåte"
        title="Til annen adresse"
      >
        {leveringsmåteTekst}
      </VenstremenyCardRow>
      {merknad && (
        <VenstremenyCardRow
          icon={lagMerknadIkon()}
          copyText={merknad}
          copyKind="merknad"
          paddingBlock={'0 2'}
          title="Beskjed til kommunen"
        >
          {merknad}
        </VenstremenyCardRow>
      )}
      {kontaktpersonTekst && (
        <VenstremenyCardRow
          icon={<InformationSquareIcon />}
          copyText={kontaktpersonTekst}
          copyKind="kontaktperson"
          title="Kontaktperson"
        >
          {kontaktpersonTekst}
        </VenstremenyCardRow>
      )}
    </VenstremenyCard>
  )

  function lagLeveringsIkon() {
    return harLeveringsVarsel() ? <VarselIkon /> : <HouseIcon />
  }

  function lagMerknadIkon() {
    return harBeskjedTilKommuneVarsel() ? <VarselIkon /> : <InformationSquareIcon />
  }
}

function lagLeveringsmåteTekst({ leveringsmåte, adresse }: Levering, adresseBruker: string): [string, string] {
  switch (leveringsmåte) {
    case LeveringsmåteType.ALLEREDE_LEVERT:
    case LeveringsmåteType.ALLE_HJELPEMIDLENE_ER_MARKERT_SOM_UTLEVERT:
      return ['Allerede levert', 'Allerede levert']
    case LeveringsmåteType.ANNEN_ADRESSE:
      return [`Til annen adresse: ${adresse}`, adresse || '']
    case LeveringsmåteType.FOLKEREGISTRERT_ADRESSE:
      return [`Til folkeregistert adresse: ${adresseBruker}`, adresseBruker]
    case LeveringsmåteType.HJELPEMIDDELSENTRAL:
      return ['Hentes på hjelpemiddelsentralen', 'Hentes på hjelpemiddelsentralen']
  }
}
