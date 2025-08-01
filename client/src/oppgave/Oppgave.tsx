import { lazy, ReactNode } from 'react'

import { useOppgave } from './useOppgave.ts'
import { OppgaveProvider } from './OppgaveProvider.tsx'
import { Oppgavetype } from './oppgaveTypes.ts'
import { DokumentProvider } from '../dokument/DokumentContext.tsx'

const Journalføring = lazy(() => import('../journalføring/Journalføring.tsx'))
const Saksbehandling = lazy(() => import('../saksbilde/Saksbilde.tsx'))

export default function Oppgave() {
  const { oppgave } = useOppgave()

  if (!oppgave) {
    return null
  }

  let component: ReactNode
  switch (oppgave.oppgavetype) {
    case Oppgavetype.JOURNALFØRING:
      component = (
        <DokumentProvider>
          <Journalføring journalpostId={oppgave.journalpostId ?? ''} />
        </DokumentProvider>
      )
      break
    case Oppgavetype.BEHANDLE_SAK:
    case Oppgavetype.GODKJENNE_VEDTAK:
    case Oppgavetype.BEHANDLE_UNDERKJENT_VEDTAK:
      component = <Saksbehandling />
      break
    default:
      component = null
      break
  }

  return <OppgaveProvider oppgave={oppgave}>{component}</OppgaveProvider>
}
