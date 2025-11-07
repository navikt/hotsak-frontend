import { HouseIcon, InformationSquareIcon } from '@navikt/aksel-icons'

import { Levering, Utleveringsmåte } from '../../types/BehovsmeldingTypes.ts'
import { formaterAdresse, storForbokstavIAlleOrd } from '../../utils/formater.ts'
import { lagKontaktpersonTekst } from '../bruker/Kontaktperson.tsx'

import { useSkjulUIElementer } from '../useSkjulUiElementer.ts'
import { useSøknadsVarsler } from '../varsler/useVarsler.tsx'
import { VarselIkonNøytralt } from '../varsler/varselIkon.tsx'
import { VenstremenyCard } from './VenstremenyCard.tsx'
import { VenstremenyCardRow } from './VenstremenyCardRow.tsx'
import { BodyShort } from '@navikt/ds-react'
import { Bydel, Kommune } from '../../types/types.internal.ts'

export interface UtleveringCardProps {
  levering: Levering
  adresseBruker: string
}

export function LeveringCard(props: UtleveringCardProps) {
  const { levering, adresseBruker } = props
  const { utleveringMerknad } = levering
  const leveringsmåte = lagLeveringsmåteTekst(levering, adresseBruker)
  const kontaktpersonTekst = lagKontaktpersonTekst(levering)
  const { harAnnenLeveringsadresse, harBeskjedTilKommune, harAnnenKontaktperson } = useSøknadsVarsler()
  const { skjulKopiknapp } = useSkjulUIElementer()

  return (
    <VenstremenyCard heading="Levering">
      <VenstremenyCardRow
        paddingBlock={'0 2'}
        icon={lagLeveringsIkon()}
        copyText={leveringsmåte.copyText}
        title={leveringsmåte.label}
      >
        {leveringsmåte.copyText !== undefined && <BodyShort>{leveringsmåte.copyText}</BodyShort>}
      </VenstremenyCardRow>

      {leveringsmåte.bydel === undefined && leveringsmåte.kommune && (
        <VenstremenyCardRow paddingBlock={'0 2'} copyText={leveringsmåte.kommune.nummer} title="Kommune">
          {storForbokstavIAlleOrd(leveringsmåte.kommune.navn)} {leveringsmåte.kommune.nummer}
        </VenstremenyCardRow>
      )}

      {leveringsmåte.bydel && (
        <VenstremenyCardRow paddingBlock={'0 2'} copyText={leveringsmåte.bydel.nummer} title="Bydel">
          {leveringsmåte.bydel.navn} {leveringsmåte.bydel.nummer}
        </VenstremenyCardRow>
      )}

      {utleveringMerknad && (
        <VenstremenyCardRow
          icon={lagMerknadIkon()}
          paddingBlock={'0 2'}
          title="Beskjed til kommunen"
          copyText={utleveringMerknad}
          skjulKopiknapp={skjulKopiknapp}
        >
          {utleveringMerknad}
        </VenstremenyCardRow>
      )}
      {kontaktpersonTekst && (
        <VenstremenyCardRow
          icon={lagKontaktpersonIkon()}
          copyText={kontaktpersonTekst}
          title="Kontaktperson"
          skjulKopiknapp={skjulKopiknapp}
        >
          {kontaktpersonTekst}
        </VenstremenyCardRow>
      )}
    </VenstremenyCard>
  )

  function lagLeveringsIkon() {
    return harAnnenLeveringsadresse ? <VarselIkonNøytralt /> : <HouseIcon />
  }

  function lagMerknadIkon() {
    return harBeskjedTilKommune ? <VarselIkonNøytralt /> : <InformationSquareIcon />
  }

  function lagKontaktpersonIkon() {
    return harAnnenKontaktperson ? <VarselIkonNøytralt /> : <InformationSquareIcon />
  }
}

export function lagLeveringsmåteTekst(
  { utleveringsmåte, annenUtleveringsadresse, annenUtleveringskommune, annenUtleveringsbydel }: Levering,
  adresseBruker: string
): LeveringsmåteTekst {
  const annenAdresse = formaterAdresse(annenUtleveringsadresse)

  switch (utleveringsmåte) {
    case Utleveringsmåte.ALLEREDE_UTLEVERT_AV_NAV:
      return { label: 'Allerede levert' }
    case Utleveringsmåte.ANNEN_BRUKSADRESSE:
      return {
        label: `Til annen adresse`,
        copyText: annenAdresse,
        kommune: annenUtleveringskommune,
        bydel: annenUtleveringsbydel,
      }
    case Utleveringsmåte.FOLKEREGISTRERT_ADRESSE:
      return { label: `Til folkeregistert adresse`, copyText: adresseBruker }
    case Utleveringsmåte.HJELPEMIDDELSENTRALEN:
      return { label: 'Hentes på hjelpemiddelsentralen' }
    default:
      return { label: 'Ukjent leveringsmåte' }
  }
}

interface LeveringsmåteTekst {
  label: string
  copyText?: string
  kommune?: Kommune
  bydel?: Bydel
}
