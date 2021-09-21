import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components/macro'

import { FeilmeldingVarsel } from '../feilsider/FeilmeldingsVarsel'
import { Flex, FlexColumn } from '../felleskomponenter/Flex'
import { LasterPersonlinje, Personlinje } from './Personlinje'
import Søknadslinje from './Søknadslinje'
import { Alert } from '@navikt/ds-react'
import { useSak } from './sakHook'
import { SøknadCard } from './venstremeny/SøknadCard'
import { VenstreMeny } from './venstremeny/Venstremeny'
import { Historikk } from './historikk/Historikk'
import { FormidlerCard } from './venstremeny/FormidlerCard'
import { VedtakCard } from './venstremeny/VedtakCard'
import { GreitÅViteCard } from './venstremeny/GreitÅViteCard'
import { Hjelpemidler } from './hjelpemidler/Hjelpemidler'
import { Bruker } from './bruker/Bruker'
import { Formidlerside } from './formidler/Formidlerside'
import { OppgaveStatusType, VedtakStatusType } from '../types/types.internal'
import { capitalize } from '../utils/stringFormating'
import { formaterDato } from '../utils/date'


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
                søknadGjelder={sak.søknadGjelder}
                saksnr={sak.saksid}
                motattDato={sak.motattDato}
                bosituasjon={sak.personinformasjon.bosituasjon}
                bruksarena={sak.personinformasjon.bruksarena}
                funksjonsnedsettelse={sak.personinformasjon.funksjonsnedsettelse}
              />
              <FormidlerCard formidlerNavn={sak.formidler.navn} kommune={sak.formidler.poststed} />
              <GreitÅViteCard greitÅViteFakta={sak.greitÅViteFaktum} />
              <VedtakCard sak={sak} />
            </VenstreMeny>
            <FlexColumn style={{ flex: 1, height: '100%' }}>
            {sak.vedtak && sak.vedtak.status === VedtakStatusType.INNVILGET && <Alert size="s" variant="success">
     {`${capitalize(sak.vedtak.status)} ${formaterDato(sak.vedtak.vedtaksDato)} av ${sak.vedtak.saksbehandlerNavn}`}
    </Alert>}
    {sak.status === OppgaveStatusType.SENDT_GOSYS && <Alert size="s" variant="info">
      {`Saken er overført til Gosys. Videre saksbehandling skjer i Gosys`}
    </Alert>}
              <Content>
                <Switch>
                  <Route path={`${path}/hjelpemidler`}>
                    <Hjelpemidler
                      hjelpemidler={sak.hjelpemidler}
                      søknadGjelder={sak.søknadGjelder}
                      personinformasjon={sak.personinformasjon}
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
        <Historikk />
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
