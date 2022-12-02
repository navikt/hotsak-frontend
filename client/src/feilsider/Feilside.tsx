import React from 'react'
import styled from 'styled-components'

import { Accordion, BodyShort, Heading, Link, Panel } from '@navikt/ds-react'
import { CopyToClipboard } from '@navikt/ds-react-internal'

import { isError } from '../utils/type'

export const Feilside: React.FC<{ statusCode: number; error?: Error }> = ({ statusCode, error }) => {
  const utviklerinformasjon = hentUtviklerinformasjon(error)
  return (
    <Feilpanel>
      <Heading size="large" spacing>
        {overskrift[statusCode] || 'Teknisk feil'} | <Feilkode>Feilkode {statusCode}</Feilkode>
      </Heading>
      {{
        401: <IkkeLoggetInn />,
        404: <IkkeFunnet />,
      }[statusCode] || <TekniskFeil />}
      {utviklerinformasjon && (
        <Accordion>
          <Accordion.Item>
            <Accordion.Header>Informasjon til utviklere</Accordion.Header>
            <Accordion.Content>
              <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                  <Code>{utviklerinformasjon}</Code>
                </div>
                <div style={{ marginLeft: 10 }}>
                  <CopyToClipboard
                    copyText={utviklerinformasjon}
                    title="Kopier feilmelding"
                    popoverText="Kopier informasjon til utviklere"
                  />
                </div>
              </div>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      )}
    </Feilpanel>
  )
}

const Feilpanel = styled(Panel)`
  margin: 2rem 100px;
  background-color: var(--a-bg-subtle);
`

const Feilkode = styled.small`
  font-weight: normal;
`

const Code = styled.pre`
  white-space: pre-wrap;
`

const IkkeLoggetInn: React.FC = () => (
  <>
    <BodyShort spacing>Du må logge inn for å få tilgang til systemet.</BodyShort>
    <BodyShort spacing>
      <Link href="/">Gå til innloggingssiden</Link>.
    </BodyShort>
  </>
)

const IkkeFunnet: React.FC = () => (
  <>
    <BodyShort spacing>
      Beklager, siden kan være slettet eller flyttet, eller det var en feil i lenken som førte deg hit.
    </BodyShort>
    <BodyShort spacing>
      Du kan bruke søket for å finne saker tilknyttet en person, eller gå <Link href="/">gå til oppgavelista</Link>.
    </BodyShort>
  </>
)

const TekniskFeil: React.FC = () => (
  <>
    <BodyShort spacing>Beklager, det har skjedd en teknisk feil.</BodyShort>
  </>
)

const overskrift: Record<number, string> = {
  401: 'Ikke logget inn',
  404: 'Fant ikke siden',
}

function hentUtviklerinformasjon(error?: Error): string {
  if (!isError(error)) {
    return ''
  }
  if (isError(error.cause)) {
    return `${error.stack}\nCaused by:\n${hentUtviklerinformasjon(error.cause)}`
  }
  return error.stack || ''
}
