import { Heading, HStack, ToggleGroup, VStack } from '@navikt/ds-react'

interface JournalføringSakvalgProps {
  sakType: 'ny' | 'eksisterende'
  kanRedigere: boolean
  antallSaker?: number
  onSakTypeChange(sakType: 'ny' | 'eksisterende'): void
}

export function JournalføringSakvalg({
  sakType,
  kanRedigere,
  antallSaker,
  onSakTypeChange,
}: JournalføringSakvalgProps) {
  if (!kanRedigere) return null

  return (
    <VStack gap="space-8" paddingBlock="space-40 space-0">
      <Heading level="2" size="xsmall">
        Ny eller eksisterende sak
      </Heading>
      <HStack gap="space-2">
        <ToggleGroup
          defaultValue="ny"
          size="small"
          onChange={(value) => onSakTypeChange(value as 'ny' | 'eksisterende')}
          value={sakType}
        >
          <ToggleGroup.Item value="ny">Opprett ny sak</ToggleGroup.Item>
          <ToggleGroup.Item value="eksisterende">
            {antallSaker === undefined ? 'Koble til sak' : `Koble til sak (${antallSaker})`}
          </ToggleGroup.Item>
        </ToggleGroup>
      </HStack>
    </VStack>
  )
}
