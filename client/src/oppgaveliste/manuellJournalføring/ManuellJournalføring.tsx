import React, { useEffect } from 'react'
import styled from 'styled-components'

import { Heading } from '@navikt/ds-react'

import { headerHøydeRem } from '../../GlobalStyles'
import { Feilmelding } from '../../felleskomponenter/Feilmelding'
import { usePersonContext } from '../../personoversikt/PersonContext'
import { usePersonInfo } from '../../personoversikt/personInfoHook'
import { Personlinje } from '../../saksbilde/Personlinje'
import { useDokument } from '../dokumenter/dokumentHook'
import { JournalpostSkjema } from './JournalpostSkjema'

const ToKolonner = styled.div`
  display: grid;
  grid-template-columns: 40rem 1fr;
  grid-template-rows: 1fr;
  height: calc(100vh - ${headerHøydeRem}rem);
`

const Container = styled.div`
  padding-top: var(--a-spacing-6);
  padding-left: var(--a-spacing-6);
`

export const ManuellJournalfør: React.FC = () => {
  const { journalpost /*, isLoading, isError*/ } = useDokument()
  const { fodselsnummer, setFodselsnummer } = usePersonContext()
  const { personInfo, /*isLoading: personInfoLoading,*/ isError: personInfoError } = usePersonInfo(fodselsnummer)

  useEffect(() => {
    if (journalpost?.fnr) {
      console.log('Fnr settes på nytt')
      setFodselsnummer(journalpost.fnr)
    }
  }, [journalpost?.fnr])

  if (personInfoError) {
    if (personInfoError.statusCode === 403) {
      return <Feilmelding>Du har ikke tilgang til å søke opp denne personen</Feilmelding>
    } else if (personInfoError.statusCode === 404) {
      return <Feilmelding>Person ikke funnet i PDL</Feilmelding>
    } else {
      return <Feilmelding>Teknisk feil. Klarte ikke å hente person fra PDL.</Feilmelding>
    }
  }

  return (
    <>
      {/* Loading state på personlinje */}
      <Personlinje person={personInfo} />
      <Container>
        <Heading level="1" size="small">
          Journalføring
        </Heading>
        <ToKolonner>
          <JournalpostSkjema />
          {/*<DokumentPanel/>*/}
        </ToKolonner>
      </Container>
    </>
  )
}
