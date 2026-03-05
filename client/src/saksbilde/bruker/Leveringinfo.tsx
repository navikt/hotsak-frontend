import { HStack, VStack } from '@navikt/ds-react'
import { Etikett, Tekst } from '../../felleskomponenter/typografi'
import { Bruker as Behovsmeldingsbruker, Levering } from '../../types/BehovsmeldingTypes'
import { formaterAdresse } from '../../utils/formater'
import { Kontaktperson } from './Kontaktperson'
import { Leveringsmåte } from './Leveringsmåte'

export interface BrukerProps {
  behovsmeldingsbruker: Behovsmeldingsbruker
  levering: Levering
}

export function Leveringinfo({ behovsmeldingsbruker, levering }: BrukerProps) {
  const { utleveringMerknad } = levering
  const adresseBruker = formaterAdresse(behovsmeldingsbruker.veiadresse)

  return (
    <VStack gap="space-4">
      <Leveringsmåte levering={levering} adresseBruker={adresseBruker} />
      <Kontaktperson levering={levering} />
      {utleveringMerknad && (
        <HStack gap="space-6" paddingBlock="space-0 space-12" align="center">
          <Etikett>Merknad til utlevering:</Etikett>
          <Tekst>{utleveringMerknad}</Tekst>
        </HStack>
      )}
    </VStack>
  )
}
