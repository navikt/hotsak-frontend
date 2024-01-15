import React, { useState } from 'react'
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary'
import { Route, Routes } from 'react-router-dom'
import styled from 'styled-components'

import { hotsakTotalMinWidth } from '../../GlobalStyles'
import { AlertError } from '../../feilsider/AlertError'
import { Flex, FlexColumn } from '../../felleskomponenter/Flex'
import { HøyrekolonneTabs, Sakstype } from '../../types/types.internal'
import { LasterPersonlinje } from '../Personlinje'
import { Søknadslinje } from '../Søknadslinje'
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

const BestillingsbildeContent: React.FC = React.memo(() => {
  const [høyrekolonneTab, setHøyrekolonneTab] = useState(HøyrekolonneTabs.SAKSHISTORIKK)
  const { sak, isLoading, isError } = useSak()
  const { hjelpemiddelArtikler } = useHjelpemiddeloversikt(sak?.data.personinformasjon.fnr)
  const { showBoundary } = useErrorBoundary()

  if (isLoading) return <LasterBestillingsbilde />

  if (isError) {
    showBoundary(isError)
  }

  const harIngenHjelpemidlerFraFør = hjelpemiddelArtikler !== undefined && hjelpemiddelArtikler.length === 0

  if (!sak) return <div>Fant ikke bestilling</div>

  return (
    <BestillingsbildeContainer>
      <Søknadslinje
        id={sak.data.sakId}
        type={Sakstype.BESTILLING}
        onTabChange={setHøyrekolonneTab}
        currentTab={høyrekolonneTab}
      />
      <Container data-testid="bestillingsbilde-fullstendig">
        <AutoFlexContainer>
          <Flex $flex={1} style={{ height: '100%' }}>
            <VenstreMeny>
              <SøknadCard
                sakstype={Sakstype.BESTILLING}
                søknadGjelder={sak.data.søknadGjelder}
                saksnr={sak.data.sakId}
                mottattDato={sak.data.mottattDato}
                bosituasjon={sak.data.personinformasjon.bosituasjon}
                bruksarena={sak.data.personinformasjon.bruksarena}
                funksjonsnedsettelse={sak.data.personinformasjon.funksjonsnedsettelse}
              />
              <FormidlerCard
                tittel="BESTILLER"
                formidlerNavn={sak.data.formidler.navn}
                formidlerTelefon={sak.data.formidler.telefon}
                stilling={sak.data.formidler.stilling}
                kommune={sak.data.formidler.poststed}
              />
              <GreitÅViteCard
                greitÅViteFakta={sak.data.greitÅViteFaktum}
                harIngenHjelpemidlerFraFør={harIngenHjelpemidlerFraFør}
              />
              <BestillingCard bestilling={sak.data} hjelpemiddelArtikler={hjelpemiddelArtikler} />
            </VenstreMeny>
            <FlexColumn style={{ flex: 1, height: '100%' }}>
              <Content>
                <Routes>
                  <Route
                    path="/hjelpemidler"
                    element={
                      <HjelpemiddelListe
                        tittel="Bestilling av hjelpemidler på bestillingsordningen"
                        forenkletVisning={true}
                        sak={sak.data}
                      />
                    }
                  />
                  <Route
                    path="/bruker"
                    element={
                      <Bruker
                        person={sak.data.personinformasjon}
                        levering={sak.data.levering}
                        formidler={sak.data.formidler}
                      />
                    }
                  />
                  <Route
                    path="/formidler"
                    element={
                      <Formidlerside
                        formidler={sak.data.formidler}
                        oppfølgingsansvarling={sak.data.oppfølgingsansvarlig}
                      />
                    }
                  />
                </Routes>
              </Content>
            </FlexColumn>
          </Flex>
        </AutoFlexContainer>
        <Høyrekolonne currentTab={høyrekolonneTab} sakstype={Sakstype.BESTILLING} />
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
