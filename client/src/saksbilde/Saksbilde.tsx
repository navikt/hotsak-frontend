import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components/macro'

import { FeilmeldingVarsel } from '../feilsider/FeilmeldingsVarsel'
import { Flex, FlexColumn } from '../felleskomponenter/Flex'
import { LasterPersonlinje, Personlinje } from './Personlinje'
import Søknadslinje from './Søknadslinje'
import { useSak } from './sakHook'
import { SøknadCard } from './venstremeny/SøknadCard'
import { VenstreMeny } from './venstremeny/Venstremeny'
import { FormidlerCard } from './venstremeny/FormidlerCard'
import { SkjemaCard } from './venstremeny/SkjemaCard'
import { GreitÅViteCard } from './venstremeny/GreitÅViteCard'
import { Hjelpemidler } from './Hjelpemidler'
import { Bruker } from './Bruker'
import { Formidlerside } from './Formidlerside'

const SaksbildeContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: max-content;
`

const Container = styled(Flex)`
  flex: 1;
  min-width: var(--speil-total-min-width);
  overflow: auto;
  overflow-x: hidden;
`

const AutoFlexContainer = styled.div`
  flex: auto;
`

const Content = styled.div`
  padding: 0 2.5rem;
  padding-top: 1rem;
  height: 100%;
  box-sizing: border-box;
  max-width: calc(100vw - var(--speil-venstremeny-width) - var(--speil-historikk-width));
`

const SaksbildeContent = React.memo(() => {
  //const personTilBehandling = usePerson();
  //useRefreshPersonVedUrlEndring();

  const { sak, isError, isLoading } = useSak()
  const { path } = useRouteMatch()

  if (isLoading) return <LasterSaksbilde />

  if (isError) throw new Error('Feil med henting av sak' + isError)

  return (
    <SaksbildeContainer className="saksbilde">
      <Personlinje person={sak.personinformasjon} />
      <Søknadslinje />
      <Container data-testid="saksbilde-fullstendig">
        <AutoFlexContainer>
          <Flex flex={1} style={{ height: '100%' }}>
            <VenstreMeny>
              <SøknadCard
                søknadGjelder={sak.søknadGjelder }
                saksnr={sak.saksid}
                motattDato={sak.motattDato}
                bosituasjon={sak.personinformasjon.bosituasjon}
                bruksarena={sak.personinformasjon.bruksarena}
                funksjonsnedsettelse={sak.personinformasjon.funksjonsnedsettelse}
              />
              <FormidlerCard formidlerNavn={sak.formidler.navn} kommune={sak.formidler.poststed} />
              <GreitÅViteCard greitÅViteFakta={sak.greitÅViteFaktum}/>
              <SkjemaCard saksnr={sak.saksid}/>
            </VenstreMeny>
            <FlexColumn style={{ flex: 1, height: '100%' }}>
              <Content>
                <Switch>
                  <Route path={`${path}/hjelpemidler`}>
                    <Hjelpemidler hjelpemidler={sak.hjelpemidler} søknadGjelder={sak.søknadGjelder} funksjonsnedsettelse={sak.personinformasjon.funksjonsnedsettelse}/>
                  </Route>
                  <Route path={`${path}/bruker`}>
                    <Bruker person={sak.personinformasjon} levering={sak.levering}/>
                  </Route>
                  <Route path={`${path}/formidler`}>
                    <Formidlerside formidler={sak.formidler}/>
                  </Route>
                </Switch>
              </Content>
            </FlexColumn>
          </Flex>
        </AutoFlexContainer>
      </Container>
    </SaksbildeContainer>
  )
})

const LasterSaksbilde = () => (
  <SaksbildeContainer className="saksbilde" data-testid="laster-saksbilde">
    <LasterPersonlinje />
  </SaksbildeContainer>
)

export const Saksbilde = () => (
  <ErrorBoundary FallbackComponent={FeilmeldingVarsel}>
    <React.Suspense fallback={<LasterSaksbilde />}>
      <SaksbildeContent />
    </React.Suspense>
  </ErrorBoundary>
)

export default Saksbilde
