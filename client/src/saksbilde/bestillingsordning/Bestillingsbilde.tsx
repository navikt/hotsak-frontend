import React from 'react'
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary'
import { Route, Routes } from 'react-router-dom'
import styled from 'styled-components'

import { HGrid } from '@navikt/ds-react'
import { headerHøydeRem, hotsakHistorikkWidth, hotsaktVenstremenyWidth } from '../../GlobalStyles'
import { AlertError } from '../../feilsider/AlertError'
import { Sakstype } from '../../types/types.internal'
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

const Content = styled.section`
  padding: 0 1.4rem;

  padding-top: 1rem;
  height: 100%;
  box-sizing: border-box;
`

const Hovedinnhold = styled(HGrid)`
  height: 100%;
`

const Bestillingsinnhold = styled(HGrid)`
  height: calc(100% - ${headerHøydeRem}rem);
`

const BestillingsbildeContent: React.FC = React.memo(() => {
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
    <>
      <Hovedinnhold columns={`auto ${hotsakHistorikkWidth}`}>
        <section>
          <HGrid columns={'auto'}>
            <Søknadslinje id={sak.data.sakId} type={Sakstype.BESTILLING} />
          </HGrid>
          <Bestillingsinnhold columns={`${hotsaktVenstremenyWidth} auto`}>
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
          </Bestillingsinnhold>
        </section>

        <div style={{ borderLeft: '1px solid var(--a-border-subtle)' }}>
          <Høyrekolonne />
        </div>
      </Hovedinnhold>
    </>
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
