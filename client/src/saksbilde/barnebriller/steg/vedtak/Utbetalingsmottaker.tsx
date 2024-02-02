import { useState } from 'react'
import { StepType, Utbetalingsmottaker } from '../../../../types/types.internal'
import { SkjemaAlert } from '../../../../felleskomponenter/SkjemaAlert'
import { Etikett } from '../../../../felleskomponenter/typografi'
import { Button, Detail, Link } from '@navikt/ds-react'
import { Avstand } from '../../../../felleskomponenter/Avstand'
import { post } from '../../../../io/http'
import { Kolonne, Rad } from '../../../../felleskomponenter/Flex'
import { VENSTREKOLONNE_BREDDE } from './Vedtak'
import { capitalizeName, formaterKontonummer } from '../../../../utils/stringFormating'
import { useManuellSaksbehandlingContext } from '../../ManuellSaksbehandlingTabContext'

interface UtbetalingsmottakerProps {
  sakId: string
  utbetalingsmottaker?: Utbetalingsmottaker
  mutate: (...args: any[]) => any
}

export const UtbetalingsmottakerVisning: React.FC<UtbetalingsmottakerProps> = (props) => {
  const { setStep } = useManuellSaksbehandlingContext()
  const [lagrerUtbetalingsmottaker, setLagrerUtbetalingsmottaker] = useState(false)

  const { sakId, utbetalingsmottaker, mutate } = props

  const mottakerNavn = utbetalingsmottaker?.fnr
  const kontonummer = utbetalingsmottaker?.kontonummer

  const manglerKontonummer = kontonummer == undefined || kontonummer.length === 0

  if (!mottakerNavn) {
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

  manglerKontonummer && (
    <>
      <SkjemaAlert variant="warning">
        <Etikett>Mangler kontonummer på bruker</Etikett>
        <Detail>
          Personen som har søkt om tilskudd har ikke registrert et kontonummer i NAV sine systemer. Kontakt vedkommende
          for å be dem registrere et kontonummer.
        </Detail>
        <Detail>Saken kan ikke sendes til godkjenning før det finnes et kontonummer registrert på mottaker</Detail>
      </SkjemaAlert>

      <Avstand paddingTop={4} />
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

  return (
    <>
      <Rad>
        <Kolonne $width={VENSTREKOLONNE_BREDDE}>Utbetales til:</Kolonne>
        <Kolonne>
          <Etikett>{capitalizeName(`${utbetalingsmottaker?.navn}`) || '-'}</Etikett>
        </Kolonne>
      </Rad>
      <Rad>
        <Kolonne $width={VENSTREKOLONNE_BREDDE}>Kontonummer:</Kolonne>
        <Kolonne>
          <Etikett>{formaterKontonummer(utbetalingsmottaker?.kontonummer) || 'Kontonummer mangler'}</Etikett>
        </Kolonne>
      </Rad>
    </>
  )
}
