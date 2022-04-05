import { Toast } from '../felleskomponenter/Toast'
import styled from 'styled-components/macro'
import { useHjelpemiddeloversikt } from '../saksbilde/høyrekolonne/hjelpemiddeloversikt/hjelpemiddeloversiktHook'
import { LasterPersonlinje, Personlinje } from '../saksbilde/Personlinje'
import Saksoversikt from './Saksoversikt'
import { usePersonContext } from './PersonContext'
import { useSaksoversikt } from './saksoversiktHook'
import { hotsakTotalMinWidth } from '../GlobalStyles'
import { Flex } from '../felleskomponenter/Flex'
import { sorterKronologisk } from '../utils/date'
import SaksoversiktLinje from './SaksoversiktLinje'
import { Route, Switch, useRouteMatch } from 'react-router'
import HjelpemiddeloversiktTabell from './HjelpemiddeloversiktTabell'
import { ErrorBoundary } from 'react-error-boundary'
import { AlertError } from '../feilsider/AlertError'
import React from 'react'
import { Alert } from '@navikt/ds-react'
import { usePersonInfo } from './personInfoHook'
import { Feilmelding } from '../felleskomponenter/Feilmelding'

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

const PersonoversiktContent = () => {
  const { fodselsnummer } = usePersonContext()
  const { path } = useRouteMatch()
  const { personInfo, isLoading: personInfoLoading, isError: personInfoError } = usePersonInfo(fodselsnummer)
  const { saksoversikt, isLoading, isError } = useSaksoversikt(fodselsnummer)
  const { hjelpemiddelArtikler, isError: hjelpemiddeloversiktError , isLoading: hjelpemiddeloversiktLoading} = useHjelpemiddeloversikt(fodselsnummer)

console.log("Fnr", fodselsnummer);


  if (personInfoError) {
    console.log(personInfoError)

    if (personInfoError.statusCode === 403) {
      return <Feilmelding>Du har ikke tilgang til å søke opp denne personen</Feilmelding>
    } else if (personInfoError.statusCode === 404) {
      return <Feilmelding>Person ikke funnet i PDL</Feilmelding>
    } else {
      return <Feilmelding>Teknisk feil. Klarte ikke å hente person fra PDL.</Feilmelding>
    }
  }


  const saker = saksoversikt?.hotsakSaker.sort((a, b) => sorterKronologisk(a.mottattDato, b.mottattDato)) || []
  const hjelpemidler =
    hjelpemiddelArtikler?.sort((a, b) => sorterKronologisk(a.datoUtsendelse, b.datoUtsendelse)) ||
    []
  const antallUtlånteHjelpemidler = hjelpemidler?.reduce((antall, artikkel) => {
    return (antall += artikkel.antall)
  }, 0)

  return (
    <>
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
              <Switch>
                <Route path={`${path}/saker`}>
                    {isError ? <Feilmelding>Teknisk feil ved henting av saksoversikt</Feilmelding> :  <Saksoversikt saker={saker} henterSaker={isLoading} />}
                </Route>
                <Route path={`${path}/hjelpemidler`}>
                  {hjelpemiddeloversiktError ? <Feilmelding>Teknisk feil ved henting av utlånsoversikt</Feilmelding> :  <HjelpemiddeloversiktTabell
                    artikler={hjelpemidler}
                    henterHjelpemiddeloversikt={hjelpemiddeloversiktLoading}
                  />}
                </Route>
              </Switch>
            </Content>
          </Container>
        </>
      )}
    </>
  )
}

const LasterPersonoversikt = () => {
  return (
    <>
      <LasterPersonlinje />
      <Toast>Henter saksoversikt </Toast>
    </>
  )
}

const Personoversikt = () => (
  <ErrorBoundary FallbackComponent={AlertError}>
    <React.Suspense fallback={<LasterPersonoversikt />}>
      <PersonoversiktContent />
    </React.Suspense>
  </ErrorBoundary>
)

export default Personoversikt
