import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Route } from 'react-router'
import { Routes } from 'react-router-dom'
import styled from 'styled-components'

import { Alert } from '@navikt/ds-react'

import { sorterKronologisk } from '../utils/date'

import { hotsakTotalMinWidth } from '../GlobalStyles'
import { AlertError } from '../feilsider/AlertError'
import { Feilmelding } from '../felleskomponenter/Feilmelding'
import { Flex } from '../felleskomponenter/Flex'
import { Toast } from '../felleskomponenter/Toast'
import { Skjermlesertittel } from '../felleskomponenter/typografi'
import { LasterPersonlinje, Personlinje } from '../saksbilde/Personlinje'
import { useHjelpemiddeloversikt } from '../saksbilde/høyrekolonne/hjelpemiddeloversikt/hjelpemiddeloversiktHook'
import HjelpemiddeloversiktTabell from './HjelpemiddeloversiktTabell'
import { usePersonContext } from './PersonContext'
import Saksoversikt from './Saksoversikt'
import SaksoversiktLinje from './SaksoversiktLinje'
import { usePersonInfo } from './personInfoHook'
import { useSaksoversikt } from './saksoversiktHook'

const Container = styled(Flex)`
  flex: 1;
  min-width: ${hotsakTotalMinWidth};
  overflow: auto;
  overflow-x: hidden;
`

const Content = styled.div`
  padding: 0 1.4rem;
  padding-top: 1rem;
  flex: 2;
  box-sizing: border-box;
  max-width: 100vw;
`

const PersonoversiktContent: React.FC = () => {
  const { fodselsnummer } = usePersonContext()
  const { personInfo, isLoading: personInfoLoading, isError: personInfoError } = usePersonInfo(fodselsnummer)
  const { saksoversikt, isLoading, isError } = useSaksoversikt(fodselsnummer)
  const {
    hjelpemiddelArtikler,
    isError: hjelpemiddeloversiktError,
    isLoading: hjelpemiddeloversiktLoading,
  } = useHjelpemiddeloversikt(fodselsnummer)

  if (personInfoError) {
    if (personInfoError.statusCode === 403) {
      return <Feilmelding>Du har ikke tilgang til å søke opp denne personen</Feilmelding>
    } else if (personInfoError.statusCode === 404) {
      return <Feilmelding>Person ikke funnet i PDL</Feilmelding>
    } else {
      return <Feilmelding>Teknisk feil. Klarte ikke å hente person fra PDL.</Feilmelding>
    }
  }

  const saker = saksoversikt?.hotsakSaker.sort((a, b) => sorterKronologisk(a.mottattDato, b.mottattDato)) || []
  const hjelpemidler = hjelpemiddelArtikler?.sort((a, b) => sorterKronologisk(a.datoUtsendelse, b.datoUtsendelse)) || []
  const antallUtlånteHjelpemidler = hjelpemidler?.reduce((antall, artikkel) => {
    return (antall += artikkel.antall)
  }, 0)

  return (
    <>
      <Skjermlesertittel>Personoversikt</Skjermlesertittel>
      {personInfoLoading ? (
        <LasterPersonoversikt />
      ) : (
        <>
          <Personlinje person={personInfo} />
          <Alert size="small" variant="info">
            Her ser du saker på bruker i HOTSAK. Vi kan foreløpig ikke vise saker fra Infotrygd
          </Alert>
          <SaksoversiktLinje sakerCount={saker.length} hjelpemidlerCount={antallUtlånteHjelpemidler} />
          <Container>
            <Content>
              <Routes>
                <Route
                  path="/saker"
                  element={
                    isError ? (
                      <Feilmelding>Teknisk feil ved henting av saksoversikt</Feilmelding>
                    ) : (
                      <Saksoversikt saker={saker} henterSaker={isLoading} />
                    )
                  }
                />
                <Route
                  path="/hjelpemidler"
                  element={
                    hjelpemiddeloversiktError ? (
                      <Feilmelding>Teknisk feil ved henting av utlånsoversikt</Feilmelding>
                    ) : (
                      <HjelpemiddeloversiktTabell
                        artikler={hjelpemidler}
                        henterHjelpemiddeloversikt={hjelpemiddeloversiktLoading}
                      />
                    )
                  }
                />
              </Routes>
            </Content>
          </Container>
        </>
      )}
    </>
  )
}

const LasterPersonoversikt: React.FC = () => {
  return (
    <>
      <LasterPersonlinje />
      <Toast>Henter saksoversikt</Toast>
    </>
  )
}

const Personoversikt: React.FC = () => (
  <ErrorBoundary FallbackComponent={AlertError}>
    <React.Suspense fallback={<LasterPersonoversikt />}>
      <PersonoversiktContent />
    </React.Suspense>
  </ErrorBoundary>
)

export default Personoversikt
