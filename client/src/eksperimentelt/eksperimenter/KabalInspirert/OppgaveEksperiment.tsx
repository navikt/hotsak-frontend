import { Heading } from '@navikt/ds-react'
import { OppgaveProvider } from '../../../oppgave/OppgaveProvider'
import { Oppgavetype, OppgaveV2 } from '../../../oppgave/oppgaveTypes'
import { useOppgave } from '../../../oppgave/useOppgave'
import { useSak } from '../../../saksbilde/useSak'
import { SaksbehandlingEksperiment } from './saksbehandling/SaksbehandlingEksperimentPanel'
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
  const { sak } = useSak()

  if (!sak) {
    return null
  }
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
          <SaksbehandlingEksperiment sak={sak.data} />
        </SaksbehandlingEksperimentProvider>
      )
    default:
      return null
  }
}
