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
import { HøyrekolonneTabs, OppgaveStatusType, VedtakStatusType } from '../types/types.internal'
import { LasterPersonlinje, Personlinje } from './Personlinje'
import Søknadslinje from './Søknadslinje'
import { Bruker } from './bruker/Bruker'
import { Formidlerside } from './formidler/Formidlerside'
import { HjelpemiddelListe } from './hjelpemidler/HjelpemiddelListe'
import { Høyrekolonne } from './høyrekolonne/Høyrekolonne'
import { useHjelpemiddeloversikt } from './høyrekolonne/hjelpemiddeloversikt/hjelpemiddeloversiktHook'
import { useSak } from './sakHook'
import { FormidlerCard } from './venstremeny/FormidlerCard'
import { GreitÅViteCard } from './venstremeny/GreitÅViteCard'
import { SøknadCard } from './venstremeny/SøknadCard'
import { VedtakCard } from './venstremeny/VedtakCard'
import { VenstreMeny } from './venstremeny/Venstremeny'

const SaksbildeContainer = styled.div`
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

const SaksbildeContent = React.memo(() => {
  //const personTilBehandling = usePerson();
  //useRefreshPersonVedUrlEndring();
  const [høyrekolonneTab, setHøyrekolonneTab] = useState(HøyrekolonneTabs.SAKSHISTORIKK)
  const { sak, isLoading, isError } = useSak()
  const { hjelpemiddelArtikler } = useHjelpemiddeloversikt(sak?.personinformasjon.fnr)
  const { path } = useRouteMatch()
  const handleError = useErrorHandler()

  if (isLoading) return <LasterSaksbilde />

  if (isError) {
    handleError(isError)
  }

  const harIngenHjelpemidlerFraFør = hjelpemiddelArtikler !== undefined && hjelpemiddelArtikler.length === 0

  if (!sak) return <div>Fant ikke sak</div>

  return (
    <SaksbildeContainer className="saksbilde">
      <Personlinje person={sak.personinformasjon} />
      <Søknadslinje onTabChange={setHøyrekolonneTab} currentTab={høyrekolonneTab} />
      <Container data-testid="saksbilde-fullstendig">
        <AutoFlexContainer>
          <Flex flex={1} style={{ height: '100%' }}>
            <VenstreMeny>
              <SøknadCard
                søknadGjelder={sak.søknadGjelder}
                saksnr={sak.saksid}
                mottattDato={sak.mottattDato}
                bosituasjon={sak.personinformasjon.bosituasjon}
                bruksarena={sak.personinformasjon.bruksarena}
                funksjonsnedsettelse={sak.personinformasjon.funksjonsnedsettelse}
              />
              <FormidlerCard
                formidlerNavn={sak.formidler.navn}
                formidlerTelefon={sak.formidler.telefon}
                kommune={sak.formidler.poststed}
              />
              <GreitÅViteCard
                greitÅViteFakta={sak.greitÅViteFaktum}
                harIngenHjelpemidlerFraFør={harIngenHjelpemidlerFraFør}
              />
              <VedtakCard sak={sak} hjelpemiddelArtikler={hjelpemiddelArtikler} />
            </VenstreMeny>
            <FlexColumn style={{ flex: 1, height: '100%' }}>
              {sak.vedtak && sak.vedtak.status === VedtakStatusType.INNVILGET && (
                <Alert size="small" variant="success" data-cy="alert-vedtak-status">
                  {`${capitalize(sak.vedtak.status)} ${formaterDato(sak.vedtak.vedtaksdato)} av ${
                    sak.vedtak.saksbehandlerNavn
                  }`}
                </Alert>
              )}
              {sak.status === OppgaveStatusType.SENDT_GOSYS && (
                <Alert size="small" variant="info" data-cy="alert-vedtak-status">
                  Saken er overført til Gosys. Videre saksbehandling skjer i Gosys
                </Alert>
              )}
              <Content>
                <Switch>
                  <Route path={`${path}/hjelpemidler`}>
                    <HjelpemiddelListe hjelpemidler={sak.hjelpemidler} personinformasjon={sak.personinformasjon} />
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
        <Høyrekolonne currentTab={høyrekolonneTab} />
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
  <ErrorBoundary FallbackComponent={AlertError}>
    <React.Suspense fallback={<LasterSaksbilde />}>
      <SaksbildeContent />
    </React.Suspense>
  </ErrorBoundary>
)

export default Saksbilde
