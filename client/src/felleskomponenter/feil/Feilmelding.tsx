import { Accordion, BodyShort, Box, CopyButton, Heading, Link } from '@navikt/ds-react'
import { type FallbackProps } from 'react-error-boundary'

import { HttpError } from '../../io/HttpError.ts'
import { toError } from '../../utils/error.ts'
import classes from './Feilmelding.module.css'
import { useStackTrace } from './useStackTrace.ts'

export interface FeilmeldingProps extends Partial<FallbackProps> {
  status?: number
}

export function Feilmelding(props: FeilmeldingProps) {
  const error = toError(props.error)
  const statusCode = HttpError.isHttpError(error) ? error.status : (props.status ?? 500)
  const stackTrace = useStackTrace(error)
  return (
    <Box
      className={classes.root}
      background="neutral-moderate"
      borderColor="neutral-subtle"
      marginBlock="space-20"
      marginInline="space-20"
      padding="space-16"
      borderRadius="8"
    >
      <Heading size="large" spacing>
        {overskrift[statusCode] || 'Teknisk feil'} | <small className={classes.feilkode}>Feilkode {statusCode}</small>
      </Heading>
      {{
        401: <IkkeLoggetInn />,
        403: <TilgangMangler />,
        404: <IkkeFunnet />,
      }[statusCode] || <TekniskFeil />}
      {stackTrace && (
        <Accordion>
          <Accordion.Item>
            <Accordion.Header>Informasjon til utviklere</Accordion.Header>
            <Accordion.Content>
              <CopyButton copyText={stackTrace} text="Kopier feilmelding" activeText="Kopiert" />
              <pre className={classes.stackTrace}>{stackTrace}</pre>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      )}
    </Box>
  )
}

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

function TilgangMangler() {
  return (
    <>
      <BodyShort spacing>Du mangler tilgang til denne ressursen.</BodyShort>
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
        Du kan bruke søket for å finne saker tilknyttet en person, eller gå{' '}
        <Link href="/public">gå til oppgavelista</Link>.
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
  403: 'Tilgang mangler',
  404: 'Fant ikke siden',
}
