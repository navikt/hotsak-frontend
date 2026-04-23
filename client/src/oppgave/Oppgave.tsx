import { lazy, useEffect } from 'react'

import { DokumentProvider } from '../dokument/DokumentContext.tsx'
import { AsyncBoundary } from '../felleskomponenter/AsyncBoundary.tsx'
import { Feilmelding } from '../felleskomponenter/feil/Feilmelding.tsx'
import { Sidetittel } from '../felleskomponenter/Sidetittel.tsx'
import { OppgaveProvider } from './OppgaveProvider.tsx'
import { type Oppgave, Oppgavetype } from './oppgaveTypes.ts'
import { useOppgave } from './useOppgave.ts'
import { useOppgaveActions } from './useOppgaveActions.ts'

const Journalføring = lazy(() => import('../journalføring/Journalføring.tsx'))
const Saksbilde = lazy(() => import('../saksbilde/Saksbilde.tsx'))

function OppgaveContent() {
  const { oppgave } = useOppgave()
  const { merkSomLest } = useOppgaveActions(oppgave)
  useEffect(() => {
    if (oppgave) {
      merkSomLest()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oppgave])
  return (
    <>
      <Sidetittel tittel={`Oppgave ${oppgave.oppgaveId}`} />
      <OppgaveProvider oppgave={oppgave}>
        <OppgavetypeSwitch oppgave={oppgave} />
      </OppgaveProvider>
    </>
  )
}

function OppgavetypeSwitch({ oppgave }: { oppgave: Oppgave }) {
  switch (oppgave.kategorisering.oppgavetype) {
    case Oppgavetype.JOURNALFØRING:
      return (
        <DokumentProvider>
          <Journalføring journalpostId={oppgave.journalpostId ?? ''} />
        </DokumentProvider>
      )
    case Oppgavetype.BEHANDLE_SAK:
    case Oppgavetype.GODKJENNE_VEDTAK:
    case Oppgavetype.BEHANDLE_UNDERKJENT_VEDTAK:
      return <Saksbilde />
    default:
      return null
  }
}

export default function Oppgave() {
  return (
    <AsyncBoundary name="Oppgave" errorComponent={Feilmelding}>
      <OppgaveContent />
    </AsyncBoundary>
  )
}
