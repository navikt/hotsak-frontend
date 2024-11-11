import { HouseIcon, InformationSquareIcon } from '@navikt/aksel-icons'

import { Levering, Utleveringsmåte } from '../../types/BehovsmeldingTypes.ts'
import { formaterAdresse } from '../../utils/formater.ts'
import { lagKontaktpersonTekst } from '../bruker/Kontaktperson.tsx'
import { useVarselsregler } from '../varsler/useVarselsregler.tsx'
import { VarselIkon } from '../varsler/varselIkon.tsx'
import { VenstremenyCard } from './VenstremenyCard.tsx'
import { VenstremenyCardRow } from './VenstremenyCardRow.tsx'

export interface UtleveringCardProps {
  levering: Levering
  adresseBruker: string
}

export function LeveringCard(props: UtleveringCardProps) {
  const { levering, adresseBruker } = props
  const { utleveringMerknad } = levering
  const [leveringsmåteLabel, leveringsmåteCopyText] = lagLeveringsmåteTekst(levering, adresseBruker)
  const kontaktpersonTekst = lagKontaktpersonTekst(levering)
  const { harLeveringsVarsel, harBeskjedTilKommuneVarsel } = useVarselsregler()

  return (
    <VenstremenyCard heading="Levering">
      <VenstremenyCardRow
        paddingBlock={'0 2'}
        icon={lagLeveringsIkon()}
        copyText={leveringsmåteCopyText}
        copyKind="leveringsmåte"
        title={leveringsmåteLabel}
      >
        {leveringsmåteCopyText !== '' && leveringsmåteCopyText}
      </VenstremenyCardRow>
      {utleveringMerknad && (
        <VenstremenyCardRow
          icon={lagMerknadIkon()}
          copyText={utleveringMerknad}
          copyKind="merknad"
          paddingBlock={'0 2'}
          title="Beskjed til kommunen"
        >
          {utleveringMerknad}
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

function lagLeveringsmåteTekst(
  { utleveringsmåte, annenUtleveringsadresse }: Levering,
  adresseBruker: string
): [string, string] {
  const annenAdresse = formaterAdresse(annenUtleveringsadresse)

  switch (utleveringsmåte) {
    case Utleveringsmåte.ALLEREDE_UTLEVERT_AV_NAV:
      return ['Allerede levert', '']
    case Utleveringsmåte.ANNEN_BRUKSADRESSE:
      return [`Til annen adresse`, annenAdresse || '']
    case Utleveringsmåte.FOLKEREGISTRERT_ADRESSE:
      return [`Til folkeregistert adresse`, adresseBruker]
    case Utleveringsmåte.HJELPEMIDDELSENTRALEN:
      return ['Hentes på hjelpemiddelsentralen', '']
    default:
      return ['Ukjent leveringsmåte', '']
  }
}
