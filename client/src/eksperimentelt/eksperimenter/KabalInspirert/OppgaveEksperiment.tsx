import { Heading } from '@navikt/ds-react'
import { OppgaveProvider } from '../../../oppgave/OppgaveProvider'
import { Oppgavetype, OppgaveV2 } from '../../../oppgave/oppgaveTypes'
import { useOppgave } from '../../../oppgave/useOppgave'
import { SaksbehandlingEksperiment } from './saksbehandling/SaksbehandlingEksperiment'
import { SaksbehandlingEksperimentProvider } from './saksbehandling/SaksbehandlingEksperimentProvider'

export default function OppgaveEksperiment() {
  const { oppgave } = useOppgave()

  if (!oppgave) {
    return null
  }

  return (
    <OppgaveProvider oppgave={oppgave}>
      <OppgavetypeSwitch oppgave={oppgave} />
    </OppgaveProvider>
  )
}

function OppgavetypeSwitch({ oppgave }: { oppgave: OppgaveV2 }) {
  switch (oppgave.oppgavetype) {
    case Oppgavetype.JOURNALFØRING:
      return (
        <Heading level="1" size="large">
          Journalføring - TODO
        </Heading>
      )
    case Oppgavetype.BEHANDLE_SAK:
    case Oppgavetype.GODKJENNE_VEDTAK:
    case Oppgavetype.BEHANDLE_UNDERKJENT_VEDTAK:
      return (
        <SaksbehandlingEksperimentProvider>
          <SaksbehandlingEksperiment />
        </SaksbehandlingEksperimentProvider>
      )
    default:
      return null
  }
}
