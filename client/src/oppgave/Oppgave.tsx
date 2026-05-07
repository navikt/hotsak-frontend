import { lazy, useEffect } from 'react'

import { DokumentProvider } from '../dokument/DokumentContext.tsx'
import { AsyncBoundary } from '../felleskomponenter/AsyncBoundary.tsx'
import { Sidetittel } from '../felleskomponenter/Sidetittel.tsx'
import { OppgaveProvider } from './OppgaveProvider.tsx'
import { isJournalføringsoppgave, isSaksbehandlingsoppgave, type Oppgave } from './oppgaveTypes.ts'
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
  }, [oppgave.oppgaveId])
  return (
    <>
      <Sidetittel tittel={`Oppgave ${oppgave.oppgaveId}`} />
      <OppgaveProvider sakId={oppgave.sakId}>
        <OppgavetypeSwitch oppgave={oppgave} />
      </OppgaveProvider>
    </>
  )
}

function OppgavetypeSwitch({ oppgave }: { oppgave: Oppgave }) {
  if (isJournalføringsoppgave(oppgave)) {
    return (
      <DokumentProvider>
        <Journalføring oppgave={oppgave} />
      </DokumentProvider>
    )
  }
  if (isSaksbehandlingsoppgave(oppgave)) {
    return <Saksbilde oppgave={oppgave} />
  }
  throw new Error(`Ukjent oppgavetype: ${oppgave.kategorisering.oppgavetype}`)
}

export default function Oppgave() {
  return (
    <AsyncBoundary name="Oppgave">
      <OppgaveContent />
    </AsyncBoundary>
  )
}
