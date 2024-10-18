import { useEffect } from 'react'
import { useParams } from 'react-router'
import styled from 'styled-components'

import { HStack, Loader } from '@navikt/ds-react'
import { headerHøydeRem } from '../GlobalStyles'
import { Avstand } from '../felleskomponenter/Avstand'
import { Feilmelding } from '../felleskomponenter/feil/Feilmelding'
import { Etikett } from '../felleskomponenter/typografi'
import { usePersonContext } from '../personoversikt/PersonContext'
import { usePerson } from '../personoversikt/usePerson'
import { Personlinje } from '../saksbilde/Personlinje'
import { useJournalpost } from '../saksbilde/useJournalpost'
import { useInnloggetSaksbehandler } from '../state/authentication'
import { DokumentOppgaveStatusType } from '../types/types.internal'
import { useDokumentContext } from '../dokument/DokumentContext'
import { DokumentPanel } from '../dokument/DokumentPanel'
import { JournalpostSkjema } from './JournalpostSkjema'
import { JournalpostVisning } from './JournalpostVisning'
import { PersonFeilmelding } from '../felleskomponenter/feil/PersonFeilmelding'

export function ManuellJournalføring() {
  const { journalpostID } = useParams<{ journalpostID: string }>()
  const { journalpost, isError, isLoading } = useJournalpost(journalpostID)
  const { setValgtDokument } = useDokumentContext()
  const { fodselsnummer, setFodselsnummer } = usePersonContext()
  const saksbehandler = useInnloggetSaksbehandler()
  const { personInfo, isLoading: personInfoLoading, isError: personInfoError } = usePerson(fodselsnummer)

  const journalpostTildeltSaksbehandler =
    journalpost?.status === DokumentOppgaveStatusType.TILDELT_SAKSBEHANDLER &&
    journalpost.saksbehandler?.id === saksbehandler.id

  const dokumenter = journalpost?.dokumenter

  useEffect(() => {
    if (journalpost?.fnrInnsender) {
      setFodselsnummer(journalpost.fnrInnsender)
    }
  }, [journalpost?.fnrInnsender, setFodselsnummer])

  useEffect(() => {
    if (journalpostID && dokumenter && dokumenter.length > 0) {
      const førsteDokment = dokumenter[0]
      setValgtDokument({ journalpostID, dokumentID: førsteDokment.dokumentID })
    }
  }, [journalpostID, dokumenter, setValgtDokument])

  if (isError) {
    if (isError?.statusCode === 403) {
      return <Feilmelding>Du har ikke tilgang til å se denne journalposten.</Feilmelding>
    } else if (isError?.statusCode === 404) {
      return <Feilmelding>Journalpost {journalpostID} ikke funnet.</Feilmelding>
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
            <Avstand paddingTop={4}>
              <HStack>
                <span>
                  <Loader size="medium" title="Henter journalpost..." />
                </span>
                <Avstand paddingLeft={4}>
                  <Etikett>Henter journalpost...</Etikett>
                </Avstand>
              </HStack>
            </Avstand>
            <DokumentPanel />
          </ToKolonner>
        </Container>
      </>
    )
  }

  return (
    <>
      {/* Loading state på personlinje */}
      <Personlinje person={personInfo} loading={personInfoLoading} />
      <Container>
        <ToKolonner>
          {journalpostTildeltSaksbehandler ? <JournalpostSkjema /> : <JournalpostVisning />}
          <DokumentPanel />
        </ToKolonner>
      </Container>
    </>
  )
}

const ToKolonner = styled.div`
  display: grid;
  grid-template-columns: 35rem 1fr;
  grid-template-rows: 1fr;
  height: calc(100vh - ${headerHøydeRem}rem);
`

const Container = styled.div`
  padding-left: var(--a-spacing-6);
`
