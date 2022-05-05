import React, { useState } from 'react'
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components/macro'

import { Alert } from '@navikt/ds-react'

import { formaterDato } from '../utils/date'
import { capitalize } from '../utils/stringFormating'

import { hotsakTotalMinWidth } from '../GlobalStyles'
import { AlertError } from '../feilsider/AlertError'
import { Flex, FlexColumn } from '../felleskomponenter/Flex'
import { HøyrekolonneTabs, OppgaveStatusType, Oppgavetype } from '../types/types.internal'
import { LasterPersonlinje, Personlinje } from './Personlinje'
import Søknadslinje from './Søknadslinje'
import { useBestilling } from './bestillingHook'
import { Bruker } from './bruker/Bruker'
import { Formidlerside } from './formidler/Formidlerside'
import { HjelpemiddelListe } from './hjelpemidler/HjelpemiddelListe'
import { Høyrekolonne } from './høyrekolonne/Høyrekolonne'
import { useHjelpemiddeloversikt } from './høyrekolonne/hjelpemiddeloversikt/hjelpemiddeloversiktHook'
import { BestillingCard } from './venstremeny/BestillingCard'
import { FormidlerCard } from './venstremeny/FormidlerCard'
import { GreitÅViteCard } from './venstremeny/GreitÅViteCard'
import { SøknadCard } from './venstremeny/SøknadCard'
import { VenstreMeny } from './venstremeny/Venstremeny'

const BestillingsbildeContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 96vh;
`

const Container = styled(Flex)`
  flex: 1;
  min-width: ${hotsakTotalMinWidth};
  overflow: auto;
  overflow-x: hidden;
`

const AutoFlexContainer = styled.div`
  flex: auto;
`

const Content = styled.section`
  padding: 0 1.4rem;

  padding-top: 1rem;
  height: 100%;
  box-sizing: border-box;
`

const BestillingsbildeContent: React.VFC = React.memo(() => {
  const [høyrekolonneTab, setHøyrekolonneTab] = useState(HøyrekolonneTabs.SAKSHISTORIKK)
  const { bestilling, isLoading, isError } = useBestilling()
  const { hjelpemiddelArtikler } = useHjelpemiddeloversikt(bestilling?.personinformasjon.fnr)
  const { path } = useRouteMatch()
  const handleError = useErrorHandler()

  if (isLoading) return <LasterBestillingsbilde />

  if (isError) {
    handleError(isError)
  }

  const harIngenHjelpemidlerFraFør = hjelpemiddelArtikler !== undefined && hjelpemiddelArtikler.length === 0

  if (!bestilling) return <div>Fant ikke bestilling</div>

  return (
    <BestillingsbildeContainer>
      <Personlinje person={bestilling.personinformasjon} />
      <Søknadslinje
        id={bestilling.id}
        type={Oppgavetype.BESTILLING}
        onTabChange={setHøyrekolonneTab}
        currentTab={høyrekolonneTab}
      />
      <Container data-testid="bestillingsbilde-fullstendig">
        <AutoFlexContainer>
          <Flex flex={1} style={{ height: '100%' }}>
            <VenstreMeny>
              <SøknadCard
                oppgaveType={Oppgavetype.BESTILLING}
                søknadGjelder={bestilling.gjelder}
                saksnr={bestilling.id}
                mottattDato={bestilling.mottattDato}
                bosituasjon={bestilling.personinformasjon.bosituasjon}
                bruksarena={bestilling.personinformasjon.bruksarena}
                funksjonsnedsettelse={bestilling.personinformasjon.funksjonsnedsettelse}
              />
              <FormidlerCard
                tittel="BESTILLER"
                formidlerNavn={bestilling.formidler.navn}
                formidlerTelefon={bestilling.formidler.telefon}
                kommune={bestilling.formidler.poststed}
              />
              <GreitÅViteCard
                greitÅViteFakta={bestilling.greitÅViteFaktum}
                harIngenHjelpemidlerFraFør={harIngenHjelpemidlerFraFør}
              />
              <BestillingCard bestilling={bestilling} hjelpemiddelArtikler={hjelpemiddelArtikler} />
            </VenstreMeny>
            <FlexColumn style={{ flex: 1, height: '100%' }}>
              {bestilling.status === OppgaveStatusType.FERDIGSTILT && (
                <Alert size="small" variant="success" data-cy="alert-bestilling-ferdigstilt">
                  {`${capitalize(bestilling.status)} ${formaterDato(bestilling.statusEndretDato)} av ${
                    bestilling.saksbehandler.navn
                  }`}
                </Alert>
              )}
              {bestilling.status === OppgaveStatusType.SENDT_GOSYS && (
                <Alert size="small" variant="info" data-cy="alert-vedtak-status">
                  Bestillingen er overført til Gosys. Videre behandling skjer i Gosys
                </Alert>
              )}
              <Content>
                <Switch>
                  <Route path={`${path}/hjelpemidler`}>
                    <HjelpemiddelListe
                      tittel="Bestilling av hjelpemidler på bestillingsordningen"
                      hjelpemidler={bestilling.hjelpemidler}
                      personinformasjon={bestilling.personinformasjon}
                    />
                  </Route>
                  <Route path={`${path}/bruker`}>
                    <Bruker
                      person={bestilling.personinformasjon}
                      levering={bestilling.levering}
                      formidler={bestilling.formidler}
                    />
                  </Route>
                  <Route path={`${path}/formidler`}>
                    <Formidlerside
                      formidler={bestilling.formidler}
                      oppfølgingsansvarling={bestilling.oppfølgingsansvarlig}
                    />
                  </Route>
                </Switch>
              </Content>
            </FlexColumn>
          </Flex>
        </AutoFlexContainer>
        <Høyrekolonne currentTab={høyrekolonneTab} oppgavetype={Oppgavetype.BESTILLING} />
      </Container>
    </BestillingsbildeContainer>
  )
})

const LasterBestillingsbilde = () => (
  <BestillingsbildeContainer className="saksbilde" data-testid="laster-saksbilde">
    <LasterPersonlinje />
  </BestillingsbildeContainer>
)

export const Bestillingsbilde = () => (
  <ErrorBoundary FallbackComponent={AlertError}>
    <React.Suspense fallback={<LasterBestillingsbilde />}>
      <BestillingsbildeContent />
    </React.Suspense>
  </ErrorBoundary>
)

export default Bestillingsbilde
