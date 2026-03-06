import { Box, HStack, VStack } from '@navikt/ds-react'
import { Etikett, Tekst, TextContainer } from '../../felleskomponenter/typografi'
import { Bruker as Behovsmeldingsbruker, Levering } from '../../types/BehovsmeldingTypes'
import { formaterAdresse } from '../../utils/formater'
import { Kontaktperson } from './Kontaktperson'
import { Leveringsmåte } from './Leveringsmåte'
import { Kopiknapp } from '../../felleskomponenter/Kopiknapp'

export interface BrukerProps {
  behovsmeldingsbruker: Behovsmeldingsbruker
  levering: Levering
}

export function Leveringinfo({ behovsmeldingsbruker, levering }: BrukerProps) {
  const { utleveringMerknad } = levering
  const adresseBruker = formaterAdresse(behovsmeldingsbruker.veiadresse)

  return (
    <Box paddingInline={'space-12 space-8'} paddingBlock="space-8">
      <TextContainer>
        <VStack gap="space-4">
          <Leveringsmåte levering={levering} adresseBruker={adresseBruker} />
          <Kontaktperson levering={levering} />
          {utleveringMerknad && (
            <>
              <Etikett>Merknad til utlevering:</Etikett>
              <HStack gap="space-6">
                <Tekst>{utleveringMerknad}</Tekst>
                <Kopiknapp tooltip="Kopier merknad" copyText={utleveringMerknad} placement="bottom" />
              </HStack>
            </>
          )}
        </VStack>
      </TextContainer>
    </Box>
  )
}
