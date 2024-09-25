import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary'
import { Route, Routes } from 'react-router-dom'
import { memo, Suspense } from 'react'
import { HGrid } from '@navikt/ds-react'
import { hotsakHistorikkWidth, hotsakVenstremenyWidth } from '../GlobalStyles'
import { AlertError } from '../feilsider/AlertError'
import { Sakstype } from '../types/types.internal'
import { Søknadslinje } from './Søknadslinje'
import { Bruker } from './bruker/Bruker'
import { Formidler } from './formidler/Formidler'
import { HjelpemiddelListe } from './hjelpemidler/HjelpemiddelListe'
import { Høyrekolonne } from './høyrekolonne/Høyrekolonne'
import { useHjelpemiddeloversikt } from './høyrekolonne/hjelpemiddeloversikt/useHjelpemiddeloversikt'
import { Content, Hovedinnhold, Saksinnhold } from './komponenter/Sakskomponenter'
import { SakLoader } from './SakLoader'
import { useSak } from './useSak'
import { FormidlerCard } from './venstremeny/FormidlerCard'
import { GreitÅViteCard } from './venstremeny/GreitÅViteCard'
import { SøknadCard } from './venstremeny/SøknadCard'
import { VedtakCard } from './venstremeny/VedtakCard'
import { Venstremeny } from './venstremeny/Venstremeny'
import { BestillingCard } from './bestillingsordning/BestillingCard'
import { UtleveringCard } from './venstremeny/UtleveringCard'
import { formaterAdresse } from '../utils/formater'

const SaksbildeContent = memo(() => {
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
          <Saksinnhold columns={`${hotsakVenstremenyWidth} auto`}>
            <Venstremeny>
              <SøknadCard
                sakId={sak.data.sakId}
                sakstype={sak.data.sakstype}
                søknadGjelder={sak.data.søknadGjelder}
                mottattDato={sak.data.mottattDato}
                bosituasjon={sak.data.personinformasjon.bosituasjon}
                bruksarena={sak.data.personinformasjon.bruksarena}
                funksjonsnedsettelser={sak.data.personinformasjon.funksjonsnedsettelser}
              />
              <FormidlerCard
                tittel={erBestilling ? 'Bestiller' : 'Formidler'}
                stilling={sak.data.formidler.stilling}
                formidlerNavn={sak.data.formidler.navn}
                formidlerTelefon={sak.data.formidler.telefon}
                kommune={sak.data.formidler.poststed}
              />
              <UtleveringCard
                formidler={sak.data.formidler}
                levering={sak.data.levering}
                adresseBruker={formaterAdresse(sak.data.personinformasjon)}
              />
              <GreitÅViteCard
                greitÅViteFakta={sak.data.greitÅViteFaktum}
                harIngenHjelpemidlerFraFør={harIngenHjelpemidlerFraFør}
              />
              {sak.data.sakstype === Sakstype.SØKNAD && <VedtakCard sak={sak.data} />}
              {erBestilling && <BestillingCard bestilling={sak.data} hjelpemiddelArtikler={hjelpemiddelArtikler} />}
            </Venstremeny>
            <Content>
              <Routes>
                <Route
                  path="/hjelpemidler"
                  element={
                    <HjelpemiddelListe
                      tittel={erBestilling ? 'Bestilling av hjelpemidler på bestillingsordningen' : 'Hjelpemidler'}
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
                    <Formidler formidler={sak.data.formidler} oppfølgingsansvarlig={sak.data.oppfølgingsansvarlig} />
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
    <Suspense fallback={<SakLoader />}>
      <SaksbildeContent />
    </Suspense>
  </ErrorBoundary>
)
