import { ExclamationmarkTriangleFillIcon, HouseIcon, InformationSquareIcon } from '@navikt/aksel-icons'

import {
  Formidler,
  Kontaktperson as IKontaktperson,
  Levering,
  Leveringsmåte as LeveringsmåteType,
  Varsel,
  VarselFor,
} from '../../types/types.internal.ts'
import { lagKontaktpersonTekst } from '../bruker/Kontaktperson.tsx'
import { useVarsler } from '../useVarsler.tsx'
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
  const { varsler } = useVarsler()

  return (
    <VenstremenyCard heading="Levering">
      <VenstremenyCardRow
        icon={lagLeveringsIkon(levering, varsler)}
        copyText={leveringsmåteCopyText}
        copyKind="leveringsmåte"
      >
        {leveringsmåteTekst}
      </VenstremenyCardRow>
      {merknad && (
        <VenstremenyCardRow icon={lagMerknadIkon(levering, varsler)} copyText={merknad} copyKind="merknad">
          Merknad: {merknad}
        </VenstremenyCardRow>
      )}
      {kontaktpersonTekst && (
        <VenstremenyCardRow icon={<InformationSquareIcon />} copyText={kontaktpersonTekst} copyKind="kontaktperson">
          Kontaktperson: {kontaktpersonTekst}
        </VenstremenyCardRow>
      )}
    </VenstremenyCard>
  )
}

function lagMerknadIkon(leveringsmåte: Levering, varsler: Varsel[]) {
  if (leveringsmåte.merknad && varsler.find((varsel) => varsel?.varslerFor.includes(VarselFor.BESKJED_TIL_KOMMUNE))) {
    return <ExclamationmarkTriangleFillIcon color="var(--a-icon-warning)" />
  } else {
    return <InformationSquareIcon />
  }
}

function lagLeveringsIkon(leveringsmåte: Levering, varsler: Varsel[]) {
  if (
    leveringsmåte.leveringsmåte === LeveringsmåteType.ANNEN_ADRESSE &&
    varsler.find((varsel) => varsel?.varslerFor.includes(VarselFor.ANNEN_ADRESSE))
  ) {
    return <ExclamationmarkTriangleFillIcon color="var(--a-icon-warning)" />
  } else {
    return <HouseIcon />
  }
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
