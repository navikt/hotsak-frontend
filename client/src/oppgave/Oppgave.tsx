import { lazy } from 'react'
import { Navigate, useParams } from 'react-router'

import { DokumentProvider } from '../dokument/DokumentContext.tsx'
import { OppgaveProvider } from './OppgaveProvider.tsx'
import { erOppgaveId, Oppgavetype, type OppgaveV2 } from './oppgaveTypes.ts'
import { useOppgave } from './useOppgave.ts'

const Journalføring = lazy(() => import('../journalføring/Journalføring.tsx'))
const Saksbehandling = lazy(() => import('../saksbilde/Saksbilde.tsx'))

export default function Oppgave() {
  const { oppgave } = useOppgave()

  const { oppgaveId } = useParams<{ oppgaveId: string }>()
  if (oppgaveId && !erOppgaveId(oppgaveId)) {
    return <Navigate to={`/oppgave/E-${oppgaveId}`} replace />
  }

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
        <DokumentProvider>
          <Journalføring journalpostId={oppgave.journalpostId ?? ''} />
        </DokumentProvider>
      )
    case Oppgavetype.BEHANDLE_SAK:
    case Oppgavetype.GODKJENNE_VEDTAK:
    case Oppgavetype.BEHANDLE_UNDERKJENT_VEDTAK:
      return <Saksbehandling />
    default:
      return null
  }
}
