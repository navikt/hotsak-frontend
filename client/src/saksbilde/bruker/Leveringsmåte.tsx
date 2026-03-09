import { HStack, VStack } from '@navikt/ds-react'
import { Etikett, Tekst } from '../../felleskomponenter/typografi'
import { Levering, Utleveringsmåte } from '../../types/BehovsmeldingTypes'
import { formaterAdresse, storForbokstavIAlleOrd } from '../../utils/formater'
import { Kopiknapp } from '../../felleskomponenter/Kopiknapp'

export interface LeveringsmåteProps {
  levering: Levering
  adresseBruker: string
}

export function Leveringsmåte({ levering, adresseBruker }: LeveringsmåteProps) {
  const leveringsmåteTekst = lagLeveringsmåteTekst(levering, adresseBruker)

  return (
    <VStack gap="space-4">
      <HStack gap="space-6">
        <Etikett>Leveringsadresse:</Etikett>
        <Tekst>{leveringsmåteTekst.tekst}</Tekst>
        {leveringsmåteTekst.copyText && (
          <Kopiknapp tooltip="Kopier leveringsadresse" copyText={leveringsmåteTekst.copyText} placement="bottom" />
        )}
      </HStack>
      {levering.annenUtleveringskommune && (
        <HStack gap="space-6">
          <Etikett>Kommune:</Etikett>
          <Tekst>
            {storForbokstavIAlleOrd(levering.annenUtleveringskommune.navn)} ({levering.annenUtleveringskommune.nummer})
          </Tekst>
        </HStack>
      )}
      {levering.annenUtleveringsbydel && (
        <HStack gap="space-6">
          <Etikett>Bydel:</Etikett>
          <Tekst>
            {levering.annenUtleveringsbydel.navn} ({levering.annenUtleveringsbydel.nummer})
          </Tekst>
        </HStack>
      )}
    </VStack>
  )
}

function lagLeveringsmåteTekst(
  { utleveringsmåte, annenUtleveringsadresse }: Levering,
  adresseBruker: string
): LeveringsmåteTekst {
  switch (utleveringsmåte) {
    case Utleveringsmåte.ANNEN_BRUKSADRESSE:
      return {
        tekst: `${formaterAdresse(annenUtleveringsadresse)} (Annen adresse)`,
        copyText: formaterAdresse(annenUtleveringsadresse),
      }
    case Utleveringsmåte.FOLKEREGISTRERT_ADRESSE:
      return { tekst: `${adresseBruker} (Folkeregistert adresse)`, copyText: adresseBruker }
    case Utleveringsmåte.HJELPEMIDDELSENTRALEN:
      return { tekst: 'Hentes på hjelpemiddelsentralen' }
    case undefined:
      return { tekst: 'Ukjent leveringsmåte', copyText: 'Ukjent leveringsmåte' }
  }
}

interface LeveringsmåteTekst {
  tekst: string
  copyText?: string
}
