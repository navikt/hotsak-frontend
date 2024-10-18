import { memo, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Route, Routes } from 'react-router-dom'
import { HGrid } from '@navikt/ds-react'

import styled from 'styled-components'
import { AlertError } from '../feilsider/AlertError'
import { hotsakHistorikkWidth, hotsakVenstremenyWidth } from '../GlobalStyles'
import { Sakstype } from '../types/types.internal'
import { formaterAdresse } from '../utils/formater'
import { BestillingCard } from './bestillingsordning/BestillingCard'
import { Saksvarsler } from './bestillingsordning/Saksvarsler'
import { Bruker } from './bruker/Bruker'
import { Formidler } from './formidler/Formidler'
import { HjelpemiddelListe } from './hjelpemidler/HjelpemiddelListe'
import { useHjelpemiddeloversikt } from './høyrekolonne/hjelpemiddeloversikt/useHjelpemiddeloversikt'
import { Høyrekolonne } from './høyrekolonne/Høyrekolonne'
import { Hovedinnhold, Saksinnhold } from './komponenter/Sakskomponenter'
import { SakLoader } from './SakLoader'
import { Søknadslinje } from './Søknadslinje'
import { useBehovsmelding } from './useBehovsmelding'
import { useSak } from './useSak'
import { useVarsler } from './varsler/useVarsler'
import { FormidlerCard } from './venstremeny/FormidlerCard'
import { GreitÅViteCard } from './venstremeny/GreitÅViteCard'
import { LeveringCard } from './venstremeny/LeveringCard'
import { SøknadCard } from './venstremeny/SøknadCard'
import { VedtakCard } from './venstremeny/VedtakCard'
import { Venstremeny } from './venstremeny/Venstremeny'

const SaksbildeContent = memo(() => {
  const { sak } = useSak()
  const { behovsmelding } = useBehovsmelding()
  const { hjelpemiddelArtikler } = useHjelpemiddeloversikt(sak?.data?.bruker?.fnr)
  const { varsler } = useVarsler()

  const harIngenHjelpemidlerFraFør = hjelpemiddelArtikler !== undefined && hjelpemiddelArtikler.length === 0

  if (!sak || !behovsmelding) return <div>Fant ikke sak</div>

  const erBestilling = sak.data.sakstype === Sakstype.BESTILLING

  return (
    <Hovedinnhold columns={`auto ${hotsakHistorikkWidth}`}>
      <section>
        <HGrid columns="auto">
          <Søknadslinje id={sak.data.sakId} type={sak.data.sakstype} />
        </HGrid>
        <Saksinnhold columns={`${hotsakVenstremenyWidth} auto`}>
          <Venstremeny gap="5">
            <SøknadCard
              sakId={sak.data.sakId}
              sakstype={sak.data.sakstype}
              søknadGjelder={sak.data.søknadGjelder}
              mottattDato={sak.data.mottattDato}
              bosituasjon={sak.data.personinformasjon.bosituasjon}
              bruksarena={sak.data.personinformasjon.bruksarena}
              funksjonsnedsettelser={sak.data.personinformasjon.funksjonsnedsettelser}
              telefon={sak?.data.bruker.telefon}
            />
            <FormidlerCard
              tittel={erBestilling ? 'Bestiller' : 'Formidler'}
              stilling={sak.data.formidler.stilling}
              formidlerNavn={sak.data.formidler.navn}
              formidlerTelefon={sak.data.formidler.telefon}
              kommune={sak.data.formidler.poststed}
            />
            <LeveringCard
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
          <section>
            {varsler && <Saksvarsler varsler={varsler} />}
            <Container>
              <Routes>
                <Route
                  path="/hjelpemidler"
                  element={
                    <HjelpemiddelListe
                      tittel="Hjelpemidler"
                      sak={sak.data}
                      forenkletVisning={erBestilling}
                      behovsmelding={behovsmelding}
                    />
                  }
                />
                <Route
                  path="/bruker"
                  element={
                    <Bruker
                      bruker={sak.data.bruker}
                      person={sak.data.personinformasjon}
                      levering={sak.data.levering}
                      formidler={sak.data.formidler}
                      vilkår={behovsmelding.brukersituasjon.vilkår}
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
            </Container>
          </section>
        </Saksinnhold>
      </section>
      <Høyrekolonne />
    </Hovedinnhold>
  )
})

const Container = styled.section`
  padding: 0 1.4rem;
  padding-top: 1rem;
  height: 100%;
  box-sizing: border-box;
`

export const Søknadsbilde = () => (
  <ErrorBoundary FallbackComponent={AlertError}>
    <Suspense fallback={<SakLoader />}>
      <SaksbildeContent />
    </Suspense>
  </ErrorBoundary>
)
