//import { Personinfo } from '../types/types.internal'
import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components/macro'

import { FeilmeldingVarsel } from '../feilsider/FeilmeldingsVarsel'
import { Flex, FlexColumn } from '../felleskomponenter/Flex'
import { HjemIkon } from '../felleskomponenter/ikoner/HjemIkon'
import { Routes } from '../routes'
//import { Route, Switch, useRouteMatch } from 'react-router-dom';
//import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel'
//import '@navikt/helse-frontend-logg/lib/main.css';
//import { ErrorBoundary } from '../../components/ErrorBoundary';
import { LasterPersonlinje, Personlinje } from './Personlinje'
import { TabLink } from './TabLink'
import { VenstreMeny } from './venstremeny/Venstremeny'
import { useSak } from './sakHook'

//import { copyString } from '../../components/clipboard/util';
//import { ToastObject, useAddToast } from '../../state/toasts';

//import { Sakslinje } from './sakslinje/Sakslinje';

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

const SakslinjeContainer = styled.div`
    display: flex;
    justify-content: space-between;
    height: 48px;
    box-sizing: border-box;
    border-bottom: 1px solid var(--navds-color-border);
    padding: 0 2rem 0 2rem;
    min-width: var(--speil-total-min-width);

    > div:last-of-type {
        margin-left: 1rem;
    }
`;

const AutoFlexContainer = styled.div`
  flex: auto;
`

const Content = styled.div`
  padding: 0 2.5rem;
  height: 100%;
  box-sizing: border-box;
  max-width: calc(100vw - var(--speil-venstremeny-width) - var(--speil-historikk-width));
`

const TabList = styled.span`
  display: flex;
`

/*const kopiertFødelsnummerToast = ({
    message = 'Fødselsnummer er kopiert',
    timeToLiveMs = 3000,
}: Partial<ToastObject>): ToastObject => ({
    key: 'kopierFødselsnummerToastKey',
    message,
    timeToLiveMs,
});*/

const SaksbildeContent = React.memo(() => {
  //const personTilBehandling = usePerson();
  //const aktivPeriode = useAktivPeriode();

  //useRefreshPersonVedUrlEndring();

  const { sak, isError, isLoading } = useSak()
  const { path } = useRouteMatch()

  if (isLoading) return <LasterSaksbilde />

  if (isError) throw new Error('Feil med henting av sak' + isError)

console.log("PI", sak.personinformasjon.bruksarena)

  return (
    <SaksbildeContainer className="saksbilde">
      <Personlinje person={sak.personinformasjon} />

      <SakslinjeContainer>
        <Flex>
          <TabList role="tablist">
            <TabLink to={Routes.Saksbilde} title="Hjelpemidler" icon={<HjemIkon />}>
              Hjelpemidler
            </TabLink>
            <TabLink to={Routes.Bruker} title="Bruker">
              Bruker
            </TabLink>
            <TabLink to={Routes.Formidler} title="Formidler">
              Formidler
            </TabLink>
          </TabList>
        </Flex>
      </SakslinjeContainer>

      <Container data-testid="saksbilde-fullstendig">
        <AutoFlexContainer>
          <Flex flex={1} style={{ height: '100%' }}>
            <VenstreMeny  
            søknadGjelder={sak.søknadGjelder}
            saksnr={sak.saksid}
            motattDato={sak.motattDato}
            bosituasjon={sak.personinformasjon.bosituasjon}
            bruksarena={sak.personinformasjon.bruksarena}
            funksjonsnedsettelse={sak.personinformasjon.funksjonsnedsettelse}
             />
            <FlexColumn style={{ flex: 1, height: '100%' }}>
              <Content>
                <Switch>
                  <Route path={`${path}/hjelpemidler`}>
                    <div>Utbetaling</div>
                  </Route>
                  <Route path={`${path}/bruker`}>
                    <div>Bruker</div>
                  </Route>
                  <Route path={`${path}/formidler`}>
                    <div>Formidler</div>
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
