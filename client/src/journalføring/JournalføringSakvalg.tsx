import { Heading, HStack, ToggleGroup, VStack } from '@navikt/ds-react'

interface JournalføringSakvalgProps {
  sakType: 'ny' | 'eksisterende'
  kanRedigere: boolean
  onSakTypeChange(sakType: 'ny' | 'eksisterende'): void
}

export function JournalføringSakvalg({ sakType, kanRedigere, onSakTypeChange }: JournalføringSakvalgProps) {
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
          <ToggleGroup.Item value="eksisterende">Koble til sak</ToggleGroup.Item>
        </ToggleGroup>
      </HStack>
    </VStack>
  )
}
