import { HStack, VStack } from '@navikt/ds-react'
import { Etikett, Tekst } from '../../felleskomponenter/typografi'
import { Levering, Utleveringsmåte } from '../../types/BehovsmeldingTypes'
import { formaterAdresse, storForbokstavIAlleOrd } from '../../utils/formater'

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
        <Tekst>{leveringsmåteTekst}</Tekst>
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

export function lagLeveringsmåteTekst(
  { utleveringsmåte, annenUtleveringsadresse }: Levering,
  adresseBruker: string
): string {
  switch (utleveringsmåte) {
    case Utleveringsmåte.ANNEN_BRUKSADRESSE:
      return `${formaterAdresse(annenUtleveringsadresse)} (Annen adresse)`
    case Utleveringsmåte.FOLKEREGISTRERT_ADRESSE:
      return `${adresseBruker} (Folkeregistert adresse)`
    case Utleveringsmåte.HJELPEMIDDELSENTRALEN:
      return 'Hentes på hjelpemiddelsentralen'
    case undefined:
      return 'Ukjent leveringsmåte'
  }
}
