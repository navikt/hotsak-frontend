import { Box, HStack, Loader } from '@navikt/ds-react'
import { useEffect } from 'react'

import classes from './Journalføring.module.css'

import { useDokumentContext } from '../dokument/DokumentContext'
import { DokumentPanel } from '../dokument/DokumentPanel'
import { FeilmeldingAlert } from '../felleskomponenter/feil/FeilmeldingAlert.tsx'
import { PersonFeilmelding } from '../felleskomponenter/feil/PersonFeilmelding'
import { Etikett } from '../felleskomponenter/typografi'
import { useOppgave } from '../oppgave/useOppgave.ts'
import { useOppgaveregler } from '../oppgave/useOppgaveregler.ts'
import { useOppgavetilgang } from '../oppgave/useOppgavetilgang.ts'
import { usePersonContext } from '../personoversikt/PersonContext'
import { usePerson } from '../personoversikt/usePerson'
import { Personlinje } from '../saksbilde/Personlinje'
import { useJournalpost } from '../saksbilde/useJournalpost'
import { JournalpostSkjema } from './JournalpostSkjema'
import { JournalpostVisning } from './JournalpostVisning'

export interface JournalføringProps {
  journalpostId: string
}

export function Journalføring({ journalpostId }: JournalføringProps) {
  const { oppgave } = useOppgave()
  const { oppgaveErUnderBehandlingAvInnloggetAnsatt } = useOppgaveregler(oppgave)
  const { journalpost, error, isLoading } = useJournalpost(journalpostId)
  const { setValgtDokument } = useDokumentContext()
  const { fodselsnummer, setFodselsnummer } = usePersonContext()
  const { harSkrivetilgang } = useOppgavetilgang()
  const { personInfo, error: personInfoError, isLoading: personInfoLoading } = usePerson(fodselsnummer)

  const dokumenter = journalpost?.dokumenter

  useEffect(() => {
    if (journalpost?.fnrInnsender) {
      setFodselsnummer(journalpost.fnrInnsender)
    }
  }, [journalpost?.fnrInnsender, setFodselsnummer])

  useEffect(() => {
    if (journalpostId && dokumenter && dokumenter.length > 0) {
      const førsteDokment = dokumenter[0]
      setValgtDokument({ journalpostId, dokumentId: førsteDokment.dokumentId })
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

  if (personInfoError) {
    return <PersonFeilmelding personError={personInfoError} />
  }

  if (isLoading) {
    return (
      <>
        <Personlinje person={personInfo} loading={personInfoLoading} />
        <div className={classes.container}>
          <div className={classes.toKolonner}>
            <HStack paddingBlock="space-16 space-0">
              <span>
                <Loader size="medium" title="Henter journalpost..." />
              </span>
              <Box paddingInline="space-16 space-0">
                <Etikett>Henter journalpost...</Etikett>
              </Box>
            </HStack>
            <DokumentPanel />
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Personlinje person={personInfo} loading={personInfoLoading} />
      <div className={classes.container}>
        <div className={classes.toKolonner}>
          {oppgaveErUnderBehandlingAvInnloggetAnsatt && harSkrivetilgang ? (
            <JournalpostSkjema journalpostId={journalpostId} />
          ) : (
            <JournalpostVisning journalpostId={journalpostId} lesevisning={!harSkrivetilgang} />
          )}
          <DokumentPanel />
        </div>
      </div>
    </>
  )
}

export default Journalføring
