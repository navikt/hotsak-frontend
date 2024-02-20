import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import styled from 'styled-components'

import { headerHøydeRem } from '../../GlobalStyles'
import { Feilmelding } from '../../felleskomponenter/Feilmelding'
import { usePersonContext } from '../../personoversikt/PersonContext'
import { usePersonInfo } from '../../personoversikt/personInfoHook'
import { Personlinje } from '../../saksbilde/Personlinje'
import { useJournalpost } from '../../saksbilde/journalpostHook'
import { useInnloggetSaksbehandler } from '../../state/authentication'
import { DokumentOppgaveStatusType } from '../../types/types.internal'
import { useDokumentContext } from '../dokumenter/DokumentContext'
import { DokumentPanel } from './DokumentPanel'
import { JournalpostSkjema } from './JournalpostSkjema'
import { JournalpostVisning } from './JournalpostVisning'
import { Loader } from '@navikt/ds-react'

const ToKolonner = styled.div`
  display: grid;
  grid-template-columns: 35rem 1fr;
  grid-template-rows: 1fr;
  height: calc(100vh - ${headerHøydeRem}rem);
`

const Container = styled.div`
  padding-left: var(--a-spacing-6);
`

export const ManuellJournalfør: React.FC = () => {
  const { journalpostID } = useParams<{ journalpostID: string }>()
  const { journalpost, isError, isLoading } = useJournalpost(journalpostID)
  const { setValgtDokument } = useDokumentContext()
  const { fodselsnummer, setFodselsnummer } = usePersonContext()
  const saksbehandler = useInnloggetSaksbehandler()
  const { personInfo, isLoading: personInfoLoading, isError: personInfoError } = usePersonInfo(fodselsnummer)

  const journalpostTildeltSaksbehandler =
    journalpost?.status === DokumentOppgaveStatusType.TILDELT_SAKSBEHANDLER &&
    journalpost.saksbehandler?.id === saksbehandler.id

  const dokumenter = journalpost?.dokumenter

  useEffect(() => {
    if (journalpost?.fnrInnsender) {
      setFodselsnummer(journalpost.fnrInnsender)
    }
  }, [journalpost?.fnrInnsender])

  useEffect(() => {
    if (journalpostID && dokumenter && dokumenter.length > 0) {
      const førsteDokment = dokumenter[0]
      setValgtDokument({ journalpostID, dokumentID: førsteDokment.dokumentID })
    }
  }, [journalpostID, dokumenter])

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
    if (personInfoError.statusCode === 403) {
      return <Feilmelding>Du har ikke tilgang til å se informasjon om denne brukeren</Feilmelding>
    } else if (personInfoError.statusCode === 404) {
      return <Feilmelding>Person ikke funnet i PDL</Feilmelding>
    } else {
      return <Feilmelding>Teknisk feil. Klarte ikke å hente person fra PDL.</Feilmelding>
    }
  }

  if (isLoading) {
    return (
      <div>
        <Loader />
        Henter journalpost...
      </div>
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
