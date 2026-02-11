import { Box, HGrid } from '@navikt/ds-react'
import { memo } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Navigate } from 'react-router'
import { Route, Routes } from 'react-router-dom'
import styled from 'styled-components'

import { AlertError } from '../feilsider/AlertError'
import { ScrollContainer } from '../felleskomponenter/ScrollContainer'
import { hotsakHistorikkMaxWidth, hotsakVenstremenyWidth, hovedInnholdMaxWidth, sidebarMinWidth } from '../GlobalStyles'
import { useSaksbehandlerHarSkrivetilgang } from '../tilgang/useSaksbehandlerHarSkrivetilgang'
import { Sakstype } from '../types/types.internal'
import { BestillingCard } from './bestillingsordning/BestillingCard'
import { Saksvarsler } from './bestillingsordning/Saksvarsler'
import { Bruker } from './bruker/Bruker'
import { Formidler } from './formidler/Formidler'
import HjelpemiddelListe from './hjelpemidler/HjelpemiddelListe'
import { Høyrekolonne } from './høyrekolonne/Høyrekolonne'
import { useNotater } from './høyrekolonne/notat/useNotater'
import { SakLoader } from './SakLoader'
import { Søknadslinje } from './Søknadslinje'
import { useBehovsmelding } from './useBehovsmelding'
import { useSak } from './useSak'
import { useSøknadsVarsler } from './varsler/useVarsler'
import { Søknadsinfo } from './venstremeny/Søknadsinfo'
import { VedtakCard } from './venstremeny/VedtakCard'
import { Venstremeny } from './venstremeny/Venstremeny'

const SaksbildeContent = memo(() => {
  const { sak, isLoading: isSakLoading } = useSak()
  const { behovsmelding, isLoading: isBehovsmeldingLoading } = useBehovsmelding()
  const harSkrivetilgang = useSaksbehandlerHarSkrivetilgang(sak?.tilganger)
  const { varsler, harVarsler } = useSøknadsVarsler()
  const { harUtkast } = useNotater(sak?.data.sakId)

  // TODO: Teste ut suspense mode i swr
  if (isSakLoading || isBehovsmeldingLoading) {
    return <SakLoader />
  }

  if (!sak || !behovsmelding) return <div>Fant ikke sak</div>

  const erBestilling = sak.data.sakstype === Sakstype.BESTILLING
  const levering = behovsmelding.levering

  return (
    <HGrid
      columns={`max(${hovedInnholdMaxWidth})  minmax(${sidebarMinWidth}, ${hotsakHistorikkMaxWidth})`}
      style={{ background: 'var(--ax-bg-default)' }}
    >
      <section>
        <HGrid columns="auto">
          <Søknadslinje id={sak.data.sakId} />
        </HGrid>
        <HGrid columns={`${hotsakVenstremenyWidth} auto`}>
          <Venstremeny gap="space-24">
            <Søknadsinfo />
            {sak.data.sakstype === Sakstype.SØKNAD && (
              <VedtakCard sak={sak.data} lesevisning={!harSkrivetilgang} harNotatUtkast={harUtkast} />
            )}
            {erBestilling && (
              <BestillingCard bestilling={sak.data} lesevisning={!harSkrivetilgang} harNotatUtkast={harUtkast} />
            )}
          </Venstremeny>
          <section>
            <ScrollContainer>
              {harVarsler && <Saksvarsler varsler={varsler} />}

              <Container>
                <Routes>
                  <Route
                    path="/hjelpemidler"
                    element={<HjelpemiddelListe sak={sak.data} behovsmelding={behovsmelding} />}
                  />
                  <Route
                    path="/bruker"
                    element={
                      <Box.New>
                        <Bruker
                          bruker={sak.data.bruker}
                          behovsmeldingsbruker={behovsmelding.bruker}
                          brukerSituasjon={behovsmelding.brukersituasjon}
                          levering={behovsmelding.levering}
                          vilkår={behovsmelding.brukersituasjon.vilkår}
                        />
                      </Box.New>
                    }
                  />
                  <Route path="/formidler" element={<Formidler levering={levering} />} />
                  <Route path="/" element={<Navigate to="hjelpemidler" replace />} />
                </Routes>
              </Container>
            </ScrollContainer>
          </section>
        </HGrid>
      </section>
      <Høyrekolonne />
    </HGrid>
  )
})

const Container = styled.section`
  padding: 0 var(--ax-space-16);
  padding-top: 1rem;
  padding-bottom: var(--ax-space-128);
  box-sizing: border-box;
`

export const Søknadsbilde = () => (
  <ErrorBoundary FallbackComponent={AlertError}>
    <SaksbildeContent />
  </ErrorBoundary>
)
