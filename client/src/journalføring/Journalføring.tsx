import { Box, HStack, Loader } from '@navikt/ds-react'
import { useEffect } from 'react'
import styled from 'styled-components'

import { useDokumentContext } from '../dokument/DokumentContext'
import { DokumentPanel } from '../dokument/DokumentPanel'
import { Feilmelding } from '../felleskomponenter/feil/Feilmelding'
import { PersonFeilmelding } from '../felleskomponenter/feil/PersonFeilmelding'
import { Etikett } from '../felleskomponenter/typografi'
import { headerHøydeRem } from '../GlobalStyles'
import { Oppgavestatus } from '../oppgave/oppgaveTypes.ts'
import { useOppgavetilgang } from '../oppgave/useOppgavetilgang.ts'
import { usePersonContext } from '../personoversikt/PersonContext'
import { usePerson } from '../personoversikt/usePerson'
import { Personlinje } from '../saksbilde/Personlinje'
import { useJournalpost } from '../saksbilde/useJournalpost'
import { useInnloggetAnsatt } from '../tilgang/useTilgang.ts'
import { JournalpostSkjema } from './JournalpostSkjema'
import { JournalpostVisning } from './JournalpostVisning'

export interface JournalføringProps {
  journalpostId: string
}

export function Journalføring({ journalpostId }: JournalføringProps) {
  const { journalpost, error, isLoading } = useJournalpost(journalpostId)
  const { setValgtDokument } = useDokumentContext()
  const { fodselsnummer, setFodselsnummer } = usePersonContext()
  const saksbehandler = useInnloggetAnsatt()
  const { harSkrivetilgang } = useOppgavetilgang()
  const { personInfo, error: personInfoError, isLoading: personInfoLoading } = usePerson(fodselsnummer)

  const journalpostTildeltSaksbehandler =
    journalpost?.oppgave.oppgavestatus === Oppgavestatus.UNDER_BEHANDLING &&
    journalpost?.oppgave.tildeltSaksbehandler?.id === saksbehandler.id

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
      return <Feilmelding>Du har ikke tilgang til å se denne journalposten.</Feilmelding>
    } else if (error?.status === 404) {
      return <Feilmelding>Journalpost {journalpostId} ikke funnet.</Feilmelding>
    } else {
      return <Feilmelding>Teknisk feil. Klarte ikke å hente journalposten.</Feilmelding>
    }
  }

  if (personInfoError) {
    return <PersonFeilmelding personError={personInfoError} />
  }

  if (isLoading) {
    return (
      <>
        <Personlinje person={personInfo} loading={personInfoLoading} />
        <Container>
          <ToKolonner>
            <HStack paddingBlock="4 0">
              <span>
                <Loader size="medium" title="Henter journalpost..." />
              </span>
              <Box paddingInline="4 0">
                <Etikett>Henter journalpost...</Etikett>
              </Box>
            </HStack>
            <DokumentPanel />
          </ToKolonner>
        </Container>
      </>
    )
  }

  return (
    <>
      <Personlinje person={personInfo} loading={personInfoLoading} />
      <Container>
        <ToKolonner>
          {journalpostTildeltSaksbehandler && harSkrivetilgang ? (
            <JournalpostSkjema journalpostId={journalpostId} />
          ) : (
            <JournalpostVisning journalpostId={journalpostId} lesevisning={!harSkrivetilgang} />
          )}
          <DokumentPanel />
        </ToKolonner>
      </Container>
    </>
  )
}

export default Journalføring

const ToKolonner = styled.div`
  display: grid;
  grid-template-columns: 35rem 1fr;
  grid-template-rows: 1fr;
  height: calc(100vh - ${headerHøydeRem}rem);
`

const Container = styled.div`
  padding-left: var(--ax-space-24);
`
