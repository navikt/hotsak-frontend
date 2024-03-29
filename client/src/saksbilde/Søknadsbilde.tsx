import React from 'react'
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary'
import { Route, Routes } from 'react-router-dom'

import { HGrid } from '@navikt/ds-react'
import { hotsakHistorikkWidth, hotsaktVenstremenyWidth } from '../GlobalStyles'
import { AlertError } from '../feilsider/AlertError'
import { Sakstype } from '../types/types.internal'
import { Søknadslinje } from './Søknadslinje'
import { Bruker } from './bruker/Bruker'
import { Formidlerside } from './formidler/Formidlerside'
import { HjelpemiddelListe } from './hjelpemidler/HjelpemiddelListe'
import { Høyrekolonne } from './høyrekolonne/Høyrekolonne'
import { useHjelpemiddeloversikt } from './høyrekolonne/hjelpemiddeloversikt/hjelpemiddeloversiktHook'
import { Content, Hovedinnhold, Saksinnhold } from './komponenter/Sakskomponenter'
import { SaksLoader } from './loader/SaksLoader'
import { useSak } from './sakHook'
import { FormidlerCard } from './venstremeny/FormidlerCard'
import { GreitÅViteCard } from './venstremeny/GreitÅViteCard'
import { SøknadCard } from './venstremeny/SøknadCard'
import { VedtakCard } from './venstremeny/VedtakCard'
import { VenstreMeny } from './venstremeny/Venstremeny'
import { BestillingCard } from './bestillingsordning/BestillingCard'

const SaksbildeContent: React.FC = React.memo(() => {
  const { sak, isError } = useSak()
  const { hjelpemiddelArtikler } = useHjelpemiddeloversikt(sak?.data?.personinformasjon.fnr)
  const { showBoundary } = useErrorBoundary()

  if (isError) {
    showBoundary(isError)
  }

  const harIngenHjelpemidlerFraFør = hjelpemiddelArtikler !== undefined && hjelpemiddelArtikler.length === 0

  if (!sak) return <div>Fant ikke sak</div>

  const erBestilling = sak.data.sakstype === Sakstype.BESTILLING

  return (
    <>
      <Hovedinnhold columns={`auto ${hotsakHistorikkWidth}`}>
        <section>
          <HGrid columns={'auto'}>
            <Søknadslinje id={sak.data.sakId} type={sak.data.sakstype} />
          </HGrid>
          <Saksinnhold columns={`${hotsaktVenstremenyWidth} auto`}>
            <VenstreMeny>
              <SøknadCard
                sakstype={sak.data.sakstype}
                søknadGjelder={sak.data.søknadGjelder}
                saksnr={sak.data.sakId}
                mottattDato={sak.data.mottattDato}
                bosituasjon={sak.data.personinformasjon.bosituasjon}
                bruksarena={sak.data.personinformasjon.bruksarena}
                funksjonsnedsettelse={sak.data.personinformasjon.funksjonsnedsettelse}
              />
              <FormidlerCard
                tittel={erBestilling ? 'BESTILLER' : 'FORMIDLER'}
                stilling={sak.data.formidler.stilling}
                formidlerNavn={sak.data.formidler.navn}
                formidlerTelefon={sak.data.formidler.telefon}
                kommune={sak.data.formidler.poststed}
              />
              <GreitÅViteCard
                greitÅViteFakta={sak.data.greitÅViteFaktum}
                harIngenHjelpemidlerFraFør={harIngenHjelpemidlerFraFør}
              />
              {sak.data.sakstype === Sakstype.SØKNAD && <VedtakCard sak={sak.data} />}
              {erBestilling && <BestillingCard bestilling={sak.data} hjelpemiddelArtikler={hjelpemiddelArtikler} />}
            </VenstreMeny>
            <Content>
              <Routes>
                <Route
                  path="/hjelpemidler"
                  element={
                    <HjelpemiddelListe
                      tittel={
                        erBestilling ? 'Bestilling av hjelpemidler på bestillingsordningen' : 'Søknad om hjelpemidler'
                      }
                      sak={sak.data}
                      forenkletVisning={erBestilling}
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
          </Saksinnhold>
        </section>
        <Høyrekolonne />
      </Hovedinnhold>
    </>
  )
})

export const Søknadsbilde = () => (
  <ErrorBoundary FallbackComponent={AlertError}>
    <React.Suspense fallback={<SaksLoader />}>
      <SaksbildeContent />
    </React.Suspense>
  </ErrorBoundary>
)

export default Søknadsbilde
