import { HGrid } from '@navikt/ds-react'
import { memo, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Route, Routes } from 'react-router-dom'

import styled from 'styled-components'
import { AlertError } from '../feilsider/AlertError'
import { hotsakHistorikkWidth, hotsakVenstremenyWidth, hovedInnholdMaxWidth } from '../GlobalStyles'
import { Sakstype } from '../types/types.internal'
import { formaterAdresse } from '../utils/formater'
import { BestillingCard } from './bestillingsordning/BestillingCard'
import { Saksvarsler } from './bestillingsordning/Saksvarsler'
import { Bruker } from './bruker/Bruker'
import { Formidler } from './formidler/Formidler'
import { HjelpemiddelListe } from './hjelpemidler/HjelpemiddelListe'
import { HjelpemiddelListeNyLayout } from './hjelpemidlerNyLayout/HjelpemiddelListeNyLayout'
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

  if (!sak || !behovsmelding) return <div>Fant ikke sak</div>

  const erBestilling = sak.data.sakstype === Sakstype.BESTILLING
  const levering = behovsmelding.levering
  const formidler = levering.hjelpemiddelformidler

  return (
    <Hovedinnhold columns={`auto ${hotsakHistorikkWidth}`} style={{ maxWidth: `${hovedInnholdMaxWidth}` }}>
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
              søknadMottatt={sak.data.opprettet}
              funksjonsnedsettelser={behovsmelding.brukersituasjon.funksjonsnedsettelser}
              telefon={sak?.data.bruker.telefon}
            />
            <FormidlerCard
              tittel={erBestilling ? 'Bestiller' : 'Formidler'}
              stilling={formidler.stilling}
              formidlerNavn={formidler.navn}
              formidlerTelefon={formidler.telefon}
              kommune={formidler.adresse.poststed}
            />
            <LeveringCard
              levering={behovsmelding.levering}
              adresseBruker={formaterAdresse(behovsmelding.bruker.veiadresse)}
            />
            <GreitÅViteCard greitÅViteFakta={sak.data.greitÅViteFaktum} />
            {sak.data.sakstype === Sakstype.SØKNAD && <VedtakCard sak={sak.data} oppgave={sak.oppgave} />}
            {erBestilling && (
              <BestillingCard bestilling={sak.data} hjelpemiddelArtikler={hjelpemiddelArtikler} oppgave={sak.oppgave} />
            )}
          </Venstremeny>
          <section>
            {varsler && <Saksvarsler varsler={varsler} />}
            <Container>
              <Routes>
                <Route
                  path="/hjelpemidler"
                  element={
                    <HjelpemiddelListe sak={sak.data} forenkletVisning={erBestilling} behovsmelding={behovsmelding} />
                  }
                />
                <Route
                  path="/ny-layout"
                  element={
                    <HjelpemiddelListeNyLayout
                      sak={sak.data}
                      //forenkletVisning={erBestilling}
                      behovsmelding={behovsmelding}
                    />
                  }
                />
                <Route
                  path="/bruker"
                  element={
                    <Bruker
                      bruker={sak.data.bruker}
                      behovsmeldingsbruker={behovsmelding.bruker}
                      brukerSituasjon={behovsmelding.brukersituasjon}
                      levering={behovsmelding.levering}
                      vilkår={behovsmelding.brukersituasjon.vilkår}
                    />
                  }
                />
                <Route path="/formidler" element={<Formidler levering={levering} />} />
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
