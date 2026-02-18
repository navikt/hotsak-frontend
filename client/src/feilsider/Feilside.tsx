import styled from 'styled-components'

import { Accordion, BodyShort, Box, CopyButton, Heading, Link } from '@navikt/ds-react'
import { useStackTrace } from './useStackTrace'

export interface FeilsideProps {
  statusCode: number
  error?: Error
}

export function Feilside({ statusCode, error }: FeilsideProps) {
  const stackTrace = useStackTrace(error)
  return (
    <Box
      background="neutral-moderate"
      borderColor="neutral-subtle"
      marginBlock="space-36"
      marginInline="space-64"
      padding="space-16"
      borderRadius="large"
    >
      <Heading size="large" spacing>
        {overskrift[statusCode] || 'Teknisk feil'} | <Feilkode>Feilkode {statusCode}</Feilkode>
      </Heading>
      {{
        401: <IkkeLoggetInn />,
        404: <IkkeFunnet />,
      }[statusCode] || <TekniskFeil />}
      {stackTrace && (
        <Accordion>
          <Accordion.Item>
            <Accordion.Header>Informasjon til utviklere</Accordion.Header>
            <Accordion.Content>
              <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                  <Code>{stackTrace}</Code>
                </div>
                <div style={{ marginLeft: 10 }}>
                  <CopyButton copyText={stackTrace} text="Kopier feilmelding" activeText="Kopiert" />
                </div>
              </div>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      )}
    </Box>
  )
}

const Feilkode = styled.small`
  font-weight: normal;
`

const Code = styled.pre`
  white-space: pre-wrap;
`

function IkkeLoggetInn() {
  return (
    <>
      <BodyShort spacing>Du må logge inn for å få tilgang til systemet.</BodyShort>
      <BodyShort spacing>
        <Link href="/oauth2/login">Gå til innloggingssiden</Link>.
      </BodyShort>
    </>
  )
}

function IkkeFunnet() {
  return (
    <>
      <BodyShort spacing>
        Beklager, siden kan være slettet eller flyttet, eller det var en feil i lenken som førte deg hit.
      </BodyShort>
      <BodyShort spacing>
        Du kan bruke søket for å finne saker tilknyttet en person, eller gå <Link href="/">gå til oppgavelista</Link>.
      </BodyShort>
    </>
  )
}

function TekniskFeil() {
  return (
    <>
      <BodyShort spacing>Beklager, det har skjedd en teknisk feil.</BodyShort>
    </>
  )
}

const overskrift: Record<number, string> = {
  401: 'Ikke logget inn',
  404: 'Fant ikke siden',
}
