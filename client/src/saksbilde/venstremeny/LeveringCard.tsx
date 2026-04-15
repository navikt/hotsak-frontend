import { HouseIcon, InformationSquareIcon } from '@navikt/aksel-icons'
import { BodyShort } from '@navikt/ds-react'

import type { Levering } from '../../types/BehovsmeldingTypes.ts'
import { storForbokstavIAlleOrd } from '../../utils/formater.ts'
import { lagKontaktpersonTekst } from '../bruker/lagKontaktpersonTekst.ts'
import { useSkjulUIElementer } from '../useSkjulUiElementer.ts'
import { useSøknadsVarsler } from '../varsler/useVarsler.tsx'
import { VarselIkonNøytralt } from '../varsler/varselIkon.tsx'
import { VenstremenyCard } from './VenstremenyCard.tsx'
import { VenstremenyCardRow } from './VenstremenyCardRow.tsx'
import { lagLeveringsmåteTekst } from './lagLeveringsmåteTekst.ts'

export interface UtleveringCardProps {
  levering: Levering
  adresseBruker: string
}

export function LeveringCard(props: UtleveringCardProps) {
  const { levering, adresseBruker } = props
  const { utleveringMerknad } = levering
  const leveringsmåte = lagLeveringsmåteTekst(levering, adresseBruker)
  const kontaktpersonTekst = lagKontaktpersonTekst(levering)
  const { harAnnenLeveringsadresse, harAnnenKontaktperson } = useSøknadsVarsler()
  const { skjulKopiknapp } = useSkjulUIElementer()

  return (
    <VenstremenyCard heading="Levering">
      <VenstremenyCardRow
        paddingBlock={'space-0 space-8'}
        icon={lagLeveringsIkon()}
        copyText={leveringsmåte.copyText}
        title={leveringsmåte.label}
      >
        {leveringsmåte.copyText !== undefined && <BodyShort>{leveringsmåte.copyText}</BodyShort>}
      </VenstremenyCardRow>

      {!leveringsmåte.bydel && leveringsmåte.kommune && (
        <VenstremenyCardRow paddingBlock={'space-0 space-8'} copyText={leveringsmåte.kommune.nummer} title="Kommune">
          {storForbokstavIAlleOrd(leveringsmåte.kommune.navn)} {leveringsmåte.kommune.nummer}
        </VenstremenyCardRow>
      )}

      {leveringsmåte.bydel && (
        <VenstremenyCardRow paddingBlock={'space-0 space-8'} copyText={leveringsmåte.bydel.nummer} title="Bydel">
          {leveringsmåte.bydel.navn} {leveringsmåte.bydel.nummer}
        </VenstremenyCardRow>
      )}

      {utleveringMerknad && (
        <VenstremenyCardRow
          paddingBlock={'space-0 space-8'}
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

  function lagKontaktpersonIkon() {
    return harAnnenKontaktperson ? <VarselIkonNøytralt /> : <InformationSquareIcon />
  }
}
