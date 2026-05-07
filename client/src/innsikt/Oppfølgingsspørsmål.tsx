import { Alert, Box, Heading, Link, VStack } from '@navikt/ds-react'
import clsx from 'clsx'
import ReactMarkdown from 'react-markdown'
import type { IOppfølgingsspørsmål } from './spørreundersøkelser'
import { Spørsmål, SpørsmålProps } from './Spørsmål'
import classes from './Oppfølgingsspørsmål.module.css'

export function Oppfølgingsspørsmål(props: SpørsmålProps<IOppfølgingsspørsmål>) {
  const { spørsmål, navn, nivå = 0, size } = props
  return (
    <Box padding={nivå > 1 ? 'space-0' : 'space-12'} className={clsx(nivå > 1 && classes.marginTop)}>
      <VStack gap="space-20">
        {spørsmål.tips && (
          <Alert size="small" variant="info" className={classes.alertSpacing}>
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
