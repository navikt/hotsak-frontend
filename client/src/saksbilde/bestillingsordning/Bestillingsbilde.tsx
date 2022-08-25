import React, { useState } from 'react'
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'

import { Alert } from '@navikt/ds-react'

import { formaterDato } from '../../utils/date'
import { capitalize } from '../../utils/stringFormating'

import { hotsakTotalMinWidth } from '../../GlobalStyles'
import { AlertError } from '../../feilsider/AlertError'
import { Flex, FlexColumn } from '../../felleskomponenter/Flex'
import { HøyrekolonneTabs, OppgaveStatusType, Oppgavetype } from '../../types/types.internal'
import { LasterPersonlinje, Personlinje } from '../Personlinje'
import Søknadslinje from '../Søknadslinje'
import { Bruker } from '../bruker/Bruker'
import { Formidlerside } from '../formidler/Formidlerside'
import { HjelpemiddelListe } from '../hjelpemidler/HjelpemiddelListe'
import { Høyrekolonne } from '../høyrekolonne/Høyrekolonne'
import { useHjelpemiddeloversikt } from '../høyrekolonne/hjelpemiddeloversikt/hjelpemiddeloversiktHook'
import { useSak } from '../sakHook'
import { FormidlerCard } from '../venstremeny/FormidlerCard'
import { GreitÅViteCard } from '../venstremeny/GreitÅViteCard'
import { SøknadCard } from '../venstremeny/SøknadCard'
import { VenstreMeny } from '../venstremeny/Venstremeny'
import { BestillingCard } from './BestillingCard'

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
  const { sak, isLoading, isError } = useSak()
  const { hjelpemiddelArtikler } = useHjelpemiddeloversikt(sak?.personinformasjon.fnr)
  const { path } = useRouteMatch()
  const handleError = useErrorHandler()

  if (isLoading) return <LasterBestillingsbilde />

  if (isError) {
    handleError(isError)
  }

  const harIngenHjelpemidlerFraFør = hjelpemiddelArtikler !== undefined && hjelpemiddelArtikler.length === 0

  if (!sak) return <div>Fant ikke bestilling</div>

  return (
    <BestillingsbildeContainer>
      <Personlinje person={sak.personinformasjon} />
      <Søknadslinje
        id={sak.saksid}
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
                søknadGjelder={sak.søknadGjelder}
                saksnr={sak.saksid}
                mottattDato={sak.mottattDato}
                bosituasjon={sak.personinformasjon.bosituasjon}
                bruksarena={sak.personinformasjon.bruksarena}
                funksjonsnedsettelse={sak.personinformasjon.funksjonsnedsettelse}
              />
              <FormidlerCard
                tittel="BESTILLER"
                formidlerNavn={sak.formidler.navn}
                formidlerTelefon={sak.formidler.telefon}
                kommune={sak.formidler.poststed}
              />
              <GreitÅViteCard
                greitÅViteFakta={sak.greitÅViteFaktum}
                harIngenHjelpemidlerFraFør={harIngenHjelpemidlerFraFør}
              />
              <BestillingCard bestilling={sak} hjelpemiddelArtikler={hjelpemiddelArtikler} />
            </VenstreMeny>
            <FlexColumn style={{ flex: 1, height: '100%' }}>
              <Content>
                <Switch>
                  <Route path={`${path}/hjelpemidler`}>
                    <HjelpemiddelListe
                      tittel="Bestilling av hjelpemidler på bestillingsordningen"
                      forenkletVisning={true}
                      sak={sak}
                    />
                  </Route>
                  <Route path={`${path}/bruker`}>
                    <Bruker person={sak.personinformasjon} levering={sak.levering} formidler={sak.formidler} />
                  </Route>
                  <Route path={`${path}/formidler`}>
                    <Formidlerside formidler={sak.formidler} oppfølgingsansvarling={sak.oppfølgingsansvarlig} />
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
