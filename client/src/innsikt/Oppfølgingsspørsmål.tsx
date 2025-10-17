import { Brødtekst } from '../felleskomponenter/typografi'
import type { IOppfølgingsspørsmål } from './spørreundersøkelser'
import { Spørsmål, SpørsmålProps } from './Spørsmål'
import { Alert, Box, Heading, VStack } from '@navikt/ds-react'

export function Oppfølgingsspørsmål(props: SpørsmålProps<IOppfølgingsspørsmål>) {
  const { spørsmål, navn, nivå = 0, size } = props
  return (
    <Box.New
      padding={nivå > 1 ? '0' : 'space-12'}
      style={{
        marginTop: nivå > 1 ? 'var(--ax-space-12)' : 0,
      }}
    >
      <VStack gap="space-20">
        {spørsmål.tips && (
          <Alert size="small" variant="info" style={{ marginBottom: '1rem' }}>
            <Heading spacing size="xsmall" level="3">
              {spørsmål.tips.tittel}
            </Heading>
            <Brødtekst>{spørsmål.tips.tekst}</Brødtekst>
          </Alert>
        )}
        {spørsmål.spørsmål.map((spørsmål) => (
          <Spørsmål key={spørsmål.tekst} spørsmål={spørsmål} navn={navn} nivå={nivå} size={size} />
        ))}
      </VStack>
    </Box.New>
  )
}
