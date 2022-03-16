import { Toast } from '../felleskomponenter/Toast'
import styled from 'styled-components/macro'
import { useHjelpemiddeloversikt } from '../saksbilde/høyrekolonne/hjelpemiddeloversikt/hjelpemiddeloversiktHook'
import { LasterPersonlinje, Personlinje } from '../saksbilde/Personlinje'
import Saksoversikt from './Saksoversikt'
import { usePersonContext } from './PersonContext'
import { useSaksoversikt } from './saksoversiktHook'
import { hotsakHistorikkWidth, hotsakTotalMinWidth } from '../GlobalStyles'
import { Flex } from '../felleskomponenter/Flex'
import { sorterKronologisk } from '../utils/date'
import SaksoversiktLinje from './SaksoversiktLinje'
import { Route, Switch, useRouteMatch } from 'react-router'
import HjelpemiddeloversiktTabell from './HjelpemiddeloversiktTabell'
import { ErrorBoundary } from 'react-error-boundary'
import { AlertError } from '../feilsider/AlertError'
import React from 'react'
import { Alert } from '@navikt/ds-react'

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
  max-width: calc(100vw - ${hotsakHistorikkWidth});
`

const PersonoversiktContent = () => {
  const { fodselsnummer } = usePersonContext()
  const { path } = useRouteMatch()
  const { saksoversikt, isLoading, isError } = useSaksoversikt(fodselsnummer)
  const hjelpemiddeloversikt = useHjelpemiddeloversikt(fodselsnummer)

  if (isError) {
    throw Error('Feil med henting av oppgaver')
  }

  const saker = saksoversikt?.saker.sort((a, b) => sorterKronologisk(a.mottattDato, b.mottattDato)) || []
  const hjelpemidler = hjelpemiddeloversikt.hjelpemiddelArtikler?.sort((a,b) => sorterKronologisk(a.datoUtsendelse, b.datoUtsendelse)) || []
  const antallUtlånteHjelpemidler = hjelpemidler?.reduce((antall, artikkel) => {
    return antall += artikkel.antall

}, 0)

  return (
    <>
      {isLoading ? (
        <LasterPersonoversikt />
      ) : (
        <>
          <Personlinje person={saksoversikt?.personinformasjon} />
          <Alert size="small" variant="info">
            Her ser du saker på bruker i HOTSAK. Vi kan foreløpig ikke vise saker fra Infotrygd
          </Alert>
          <SaksoversiktLinje sakerCount={saker.length} hjelpemidlerCount={antallUtlånteHjelpemidler} />
          
          <Container>
            <Content>
              <Switch>
                <Route path={`${path}/saker`}>
                  <Saksoversikt saker={saker} henterSaker={isLoading} />
                </Route>
                <Route path={`${path}/hjelpemidler`}>
                  <HjelpemiddeloversiktTabell
                    artikler={hjelpemidler}
                    henterHjelpemiddeloversikt={hjelpemiddeloversikt.isLoading}
                  />
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
