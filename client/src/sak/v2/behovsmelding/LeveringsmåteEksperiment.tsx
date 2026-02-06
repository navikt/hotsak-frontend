import { HStack, VStack } from '@navikt/ds-react'
import { lagLeveringsmåteTekst } from '../../../saksbilde/bruker/Leveringsmåte'
import { Levering } from '../../../types/BehovsmeldingTypes'
import { Etikett, Tekst } from '../../../felleskomponenter/typografi'
import { storForbokstavIAlleOrd } from '../../../utils/formater'

export interface LeveringsmåteProps {
  levering: Levering
  adresseBruker: string
}

export function LeveringsmåteEksperiment({ levering, adresseBruker }: LeveringsmåteProps) {
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
