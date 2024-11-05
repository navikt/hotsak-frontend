import { Button, Detail, Link } from '@navikt/ds-react'
import { useState } from 'react'
import { SkjemaAlert } from '../../../../felleskomponenter/SkjemaAlert'
import { Etikett } from '../../../../felleskomponenter/typografi'
import { post } from '../../../../io/http'
import { StepType, Utbetalingsmottaker } from '../../../../types/types.internal'
import { useManuellSaksbehandlingContext } from '../../ManuellSaksbehandlingTabContext'

export interface UtbetalingsmottakerAlertProps {
  sakId: string
  utbetalingsmottaker?: Utbetalingsmottaker
  mutate(...args: any[]): any
}

export function UtbetalingsmottakerAlert(props: UtbetalingsmottakerAlertProps) {
  const { setStep } = useManuellSaksbehandlingContext()
  const [lagrerUtbetalingsmottaker, setLagrerUtbetalingsmottaker] = useState(false)
  const { sakId, utbetalingsmottaker, mutate } = props

  if (!utbetalingsmottaker?.fnr) {
    return (
      <SkjemaAlert variant="warning">
        <Etikett>Mangler utbetalingsmottaker</Etikett>
        <Detail>
          Ingen utbetalingsmottaker er registert. Dette må legges til under{' '}
          <Link href="#" variant="action" inlineText onClick={() => setStep(StepType.REGISTRER)}>
            Registrer søknad
          </Link>
          .
        </Detail>
        <Detail>Saken kan ikke sendes til godkjenning før det er registrert en utbetalingsmottaker.</Detail>
      </SkjemaAlert>
    )
  }

  if (!utbetalingsmottaker?.kontonummer) {
    return (
      <>
        <SkjemaAlert variant="warning">
          <Etikett>Mangler kontonummer på bruker</Etikett>
          <Detail>
            Personen som har søkt om tilskudd har ikke registrert et kontonummer i Nav sine systemer. Kontakt
            vedkommende for å be dem registrere et kontonummer.
          </Detail>
          <Detail>Saken kan ikke sendes til godkjenning før det finnes et kontonummer registrert på mottaker</Detail>
        </SkjemaAlert>
        <Button
          variant="secondary"
          size="small"
          loading={lagrerUtbetalingsmottaker}
          disabled={lagrerUtbetalingsmottaker}
          onClick={(e) => {
            e.preventDefault()
            setLagrerUtbetalingsmottaker(true)
            post('/api/utbetalingsmottaker', {
              fnr: utbetalingsmottaker?.fnr,
              sakId: Number(sakId),
            }).then(() => {
              setLagrerUtbetalingsmottaker(false)
              mutate()
            })
          }}
        >
          Hent kontonummer på nytt
        </Button>
      </>
    )
  }

  return null
}
