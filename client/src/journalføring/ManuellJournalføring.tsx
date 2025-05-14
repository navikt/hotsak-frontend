import { useEffect } from 'react'
import { useParams } from 'react-router'
import styled from 'styled-components'

import { HStack, Loader } from '@navikt/ds-react'
import { headerHøydeRem } from '../GlobalStyles'
import { useDokumentContext } from '../dokument/DokumentContext'
import { DokumentPanel } from '../dokument/DokumentPanel'
import { Avstand } from '../felleskomponenter/Avstand'
import { Feilmelding } from '../felleskomponenter/feil/Feilmelding'
import { PersonFeilmelding } from '../felleskomponenter/feil/PersonFeilmelding'
import { Etikett } from '../felleskomponenter/typografi'
import { usePersonContext } from '../personoversikt/PersonContext'
import { usePerson } from '../personoversikt/usePerson'
import { Personlinje } from '../saksbilde/Personlinje'
import { useJournalpost } from '../saksbilde/useJournalpost'
import { Oppgavestatus } from '../types/types.internal'
import { JournalpostSkjema } from './JournalpostSkjema'
import { JournalpostVisning } from './JournalpostVisning'
import { useOppgavetilgang } from '../oppgaveliste/useOppgavetilgang'
import { useInnloggetAnsatt } from '../tilgang/useTilgang.ts'

export function ManuellJournalføring() {
  const { journalpostId } = useParams<{ journalpostId: string }>()
  const { journalpost, isError, isLoading } = useJournalpost(journalpostId)
  const { setValgtDokument } = useDokumentContext()
  const { fodselsnummer, setFodselsnummer } = usePersonContext()
  const saksbehandler = useInnloggetAnsatt()
  const { harSkrivetilgang } = useOppgavetilgang()
  const { personInfo, isLoading: personInfoLoading, isError: personInfoError } = usePerson(fodselsnummer)

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

  if (isError) {
    if (isError?.statusCode === 403) {
      return <Feilmelding>Du har ikke tilgang til å se denne journalposten.</Feilmelding>
    } else if (isError?.statusCode === 404) {
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
          {journalpostTildeltSaksbehandler && harSkrivetilgang ? (
            <JournalpostSkjema />
          ) : (
            <JournalpostVisning lesevisning={!harSkrivetilgang} />
          )}
          <DokumentPanel />
        </ToKolonner>
      </Container>
    </>
  )
}

export default ManuellJournalføring

const ToKolonner = styled.div`
  display: grid;
  grid-template-columns: 35rem 1fr;
  grid-template-rows: 1fr;
  height: calc(100vh - ${headerHøydeRem}rem);
`

const Container = styled.div`
  padding-left: var(--a-spacing-6);
`
