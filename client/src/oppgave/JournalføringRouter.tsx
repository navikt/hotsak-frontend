import { lazy } from 'react'
import { type FallbackProps } from 'react-error-boundary'

import { AsyncBoundary } from '../felleskomponenter/AsyncBoundary.tsx'
import { FeilmeldingAlert } from '../felleskomponenter/feil/FeilmeldingAlert.tsx'
import { HttpError } from '../io/HttpError.ts'
import { JournalføringLoader } from '../journalføring/JournalføringLoader.tsx'
import { useJournalpostSuspense } from '../saksbilde/useJournalpost.ts'
import { type Journalføringsoppgave } from './oppgaveTypes.ts'

const Journalføring = lazy(() => import('../journalføring/Journalføring.tsx'))
const JournalføringV2 = lazy(() => import('../journalføring/JournalføringV2.tsx'))

const BREVKODE_BRILLER_TIL_BARN = ['NAV 10-07.34', 'NAVe 10-07.34']

export function JournalføringRouter({ oppgave }: { oppgave: Journalføringsoppgave }) {
  return (
    <AsyncBoundary
      name="Journalføring"
      suspenseFallback={<JournalføringLoader />}
      errorComponent={JournalpostFeilmelding}
      resetKeys={[oppgave.journalpostId]}
    >
      <VelgJournalføring oppgave={oppgave} />
    </AsyncBoundary>
  )
}

function VelgJournalføring({ oppgave }: { oppgave: Journalføringsoppgave }) {
  const { journalpost, mutate } = useJournalpostSuspense(oppgave.journalpostId)
  const brevkode = journalpost.dokumenter[0]?.brevkode

  if (brevkode && !BREVKODE_BRILLER_TIL_BARN.includes(brevkode)) {
    return <JournalføringV2 oppgave={oppgave} journalpost={journalpost} mutateJournalpost={mutate} />
  }
  return <Journalføring oppgave={oppgave} />
}

function JournalpostFeilmelding({ error }: FallbackProps) {
  const status = HttpError.isHttpError(error) ? error.status : undefined
  if (status === 403) {
    return <FeilmeldingAlert>Du har ikke tilgang til å se denne journalposten.</FeilmeldingAlert>
  }
  if (status === 404) {
    return <FeilmeldingAlert>Journalposten ble ikke funnet.</FeilmeldingAlert>
  }
  return <FeilmeldingAlert>Teknisk feil. Klarte ikke å hente journalposten.</FeilmeldingAlert>
}
