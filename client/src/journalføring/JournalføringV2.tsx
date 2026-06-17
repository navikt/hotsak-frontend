import { HStack, Loader } from '@navikt/ds-react'
import { useEffect } from 'react'
import { Group, Panel } from 'react-resizable-panels'

import { useDokumentContext } from '../dokument/DokumentContext.tsx'
import { DokumentPanel } from '../dokument/DokumentPanel.tsx'
import { FeilmeldingAlert } from '../felleskomponenter/feil/FeilmeldingAlert.tsx'
import { ResizeHandle } from '../felleskomponenter/resize/ResizeHandle.tsx'
import { type Journalføringsoppgave } from '../oppgave/oppgaveTypes.ts'
import { useJournalpost } from '../saksbilde/useJournalpost.ts'
import classes from './JournalføringV2.module.css'
import { JournalføringV2Skjema } from './JournalføringV2Skjema.tsx'

export function JournalføringV2({ oppgave }: { oppgave: Journalføringsoppgave }) {
  const { journalpostId } = oppgave
  const { journalpost, error, isLoading } = useJournalpost(journalpostId)
  const { setValgtDokument } = useDokumentContext()

  const dokumenter = journalpost?.dokumenter

  useEffect(() => {
    if (journalpostId && dokumenter && dokumenter.length > 0) {
      const førsteDokument = dokumenter[0]
      setValgtDokument({ journalpostId, dokumentId: førsteDokument.dokumentId })
    }
  }, [journalpostId, dokumenter, setValgtDokument])

  if (error) {
    if (error?.status === 403) {
      return <FeilmeldingAlert>Du har ikke tilgang til å se denne journalposten.</FeilmeldingAlert>
    } else if (error?.status === 404) {
      return <FeilmeldingAlert>Journalpost {journalpostId} ikke funnet.</FeilmeldingAlert>
    } else {
      return <FeilmeldingAlert>Teknisk feil. Klarte ikke å hente journalposten.</FeilmeldingAlert>
    }
  }

  return (
    <div className={classes.wrapper}>
      <div className={classes.container}>
        <Group orientation="horizontal" className={classes.panelGroup}>
          <Panel defaultSize={40} minSize="350px" id="skjema">
            <div className={classes.skjemaKolonne}>
              {isLoading || !journalpost ? (
                <HStack gap="space-4" align="center">
                  <Loader size="medium" title="Henter journalpost..." />
                  <span>Henter journalpost...</span>
                </HStack>
              ) : (
                <JournalføringV2Skjema oppgave={oppgave} journalpost={journalpost} />
              )}
            </div>
          </Panel>
          <ResizeHandle />
          <Panel defaultSize={60} minSize="300px" id="dokument">
            <div className={classes.dokumentKolonne}>
              <DokumentPanel />
            </div>
          </Panel>
        </Group>
      </div>
    </div>
  )
}

export default JournalføringV2
