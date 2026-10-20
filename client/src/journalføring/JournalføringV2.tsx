import { type ReactNode, useEffect, useState } from 'react'
import { Group, Panel } from 'react-resizable-panels'

import { useDokumentContext } from '../dokument/DokumentContext.tsx'
import { DokumentPanel } from '../dokument/DokumentPanel.tsx'
import { FeilmeldingAlert } from '../felleskomponenter/feil/FeilmeldingAlert.tsx'
import { PersonFeilmelding } from '../felleskomponenter/feil/PersonFeilmelding.tsx'
import { Personlinje } from '../felleskomponenter/personlinje/Personlinje.tsx'
import { ResizeHandle } from '../felleskomponenter/resize/ResizeHandle.tsx'
import { type Journalføringsoppgave } from '../oppgave/oppgaveTypes.ts'
import { usePersonContext } from '../personoversikt/PersonContext.tsx'
import { usePerson } from '../personoversikt/usePerson.ts'
import { type Journalpost } from '../types/types.internal.ts'
import { JournalføringLoader } from './JournalføringLoader.tsx'
import classes from './JournalføringV2.module.css'
import { JournalføringV2Skjema } from './JournalføringV2Skjema.tsx'
import { hentJournalføringStandardverdier } from './journalføringStandardverdier.ts'

interface JournalføringV2Props {
  oppgave: Journalføringsoppgave
  journalpost: Journalpost
  erBarnebrilleSøknad: boolean
  mutateJournalpost(): void
}

export function JournalføringV2({
  oppgave,
  journalpost,
  mutateJournalpost,
  erBarnebrilleSøknad,
}: JournalføringV2Props) {
  const { journalpostId, dokumenter } = journalpost
  const { setValgtDokument } = useDokumentContext()

  useEffect(() => {
    if (dokumenter.length > 0) {
      setValgtDokument({ journalpostId, dokumentId: dokumenter[0].dokumentId })
    }
  }, [journalpostId, dokumenter, setValgtDokument])

  if (!journalpost.fnrBruker) {
    return <FeilmeldingAlert>Journalposten mangler bruker. Kan ikke journalføre uten fødselsnummer.</FeilmeldingAlert>
  }

  if (!journalpost.fnrInnsender) {
    return <FeilmeldingAlert>Journalposten mangler avsender. Kan ikke journalføre uten fødselsnummer.</FeilmeldingAlert>
  }

  return (
    <AktivPersonBoundary key={journalpostId} fnr={journalpost.fnrBruker}>
      <JournalføringV2Innhold
        oppgave={oppgave}
        journalpost={journalpost}
        mutateJournalpost={mutateJournalpost}
        erBarnebrilleSøknad={erBarnebrilleSøknad}
      />
    </AktivPersonBoundary>
  )
}

function AktivPersonBoundary({ fnr, children }: { fnr: string; children: ReactNode }) {
  const { setFodselsnummer } = usePersonContext()
  const [initialisert, setInitialisert] = useState(false)

  useEffect(() => {
    setFodselsnummer(fnr)
    setInitialisert(true)
  }, [fnr, setFodselsnummer])

  if (!initialisert) {
    return <JournalføringLoader />
  }

  return children
}

function JournalføringV2Innhold({
  oppgave,
  journalpost,
  mutateJournalpost,
  erBarnebrilleSøknad,
}: JournalføringV2Props) {
  const { fodselsnummer } = usePersonContext()
  const { personInfo, error: personError, isLoading: personInfoLoading } = usePerson(fodselsnummer)

  if (personError) {
    return <PersonFeilmelding personError={personError} />
  }

  return (
    <div className={classes.wrapper}>
      <Personlinje loading={personInfoLoading} person={personInfo} skjulTelefonnummer />
      <div className={classes.container}>
        <Group orientation="horizontal" className={classes.panelGroup}>
          <Panel defaultSize={40} minSize="350px" id="skjema">
            <div className={classes.skjemaKolonne}>
              <JournalføringV2Skjema
                oppgave={oppgave}
                journalpost={journalpost}
                mutateJournalpost={mutateJournalpost}
                erBarnebrilleSøknad={erBarnebrilleSøknad}
                standardverdier={hentJournalføringStandardverdier(journalpost.dokumenter[0]?.brevkode)}
              />
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
