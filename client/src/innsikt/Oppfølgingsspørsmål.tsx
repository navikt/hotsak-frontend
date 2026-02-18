import { Alert, Box, Heading, Link, VStack } from '@navikt/ds-react'
import ReactMarkdown from 'react-markdown'
import type { IOppfølgingsspørsmål } from './spørreundersøkelser'
import { Spørsmål, SpørsmålProps } from './Spørsmål'

export function Oppfølgingsspørsmål(props: SpørsmålProps<IOppfølgingsspørsmål>) {
  const { spørsmål, navn, nivå = 0, size } = props
  return (
    <Box
      padding={nivå > 1 ? 'space-0' : 'space-12'}
      style={{
        marginTop: nivå > 1 ? 'var(--ax-space-12)' : 'space-0',
      }}
    >
      <VStack gap="space-20">
        {spørsmål.tips && (
          <Alert size="small" variant="info" style={{ marginBottom: '1rem' }}>
            <Heading size="xsmall" level="3">
              {spørsmål.tips.tittel}
            </Heading>
            <ReactMarkdown
              components={{
                a: (props) => (
                  <Link href={props.href} target="_blank">
                    {props.children}
                  </Link>
                ),
              }}
            >
              {spørsmål.tips.tekst}
            </ReactMarkdown>
          </Alert>
        )}
        {spørsmål.spørsmål.map((spørsmål) => (
          <Spørsmål key={spørsmål.tekst} spørsmål={spørsmål} navn={navn} nivå={nivå} size={size} />
        ))}
      </VStack>
    </Box>
  )
}
