import type { IOppfølgingsspørsmål } from './spørreundersøkelser'
import { Spørsmål, SpørsmålProps } from './Spørsmål'
import { Box, VStack } from '@navikt/ds-react'

export function Oppfølgingsspørsmål(props: SpørsmålProps<IOppfølgingsspørsmål>) {
  const { spørsmål, navn, nivå = 0, size } = props
  return (
    <Box
      background="surface-action-subtle"
      padding={nivå > 1 ? '0' : '3'}
      style={{
        marginTop: nivå > 1 ? 'var(--ax-space-12)' : 0,
      }}
    >
      <VStack gap="5">
        {spørsmål.spørsmål.map((spørsmål) => (
          <Spørsmål key={spørsmål.tekst} spørsmål={spørsmål} navn={navn} nivå={nivå} size={size} />
        ))}
      </VStack>
    </Box>
  )
}
