import { Box, HGrid } from '@navikt/ds-react'
import { memo } from 'react'
import { Navigate } from 'react-router'
import { Route, Routes } from 'react-router-dom'

import classes from './Søknadsbilde.module.css'

import { AsyncBoundary } from '../felleskomponenter/AsyncBoundary.tsx'
import { ScrollContainer } from '../felleskomponenter/ScrollContainer'
import { hotsakHistorikkMaxWidth, hotsakVenstremenyWidth, hovedInnholdMaxWidth, sidebarMinWidth } from '../GlobalStyles'
import { useOppgave } from '../oppgave/useOppgave.ts'
import { useBehandling } from '../sak/v2/behandling/useBehandling.ts'
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

// fixme
// eslint-disable-next-line react-refresh/only-export-components
const SaksbildeContent = memo(() => {
  const { oppgave } = useOppgave()
  const { sak, isLoading: isSakLoading } = useSak()
  const { gjeldendeBehandling } = useBehandling()
  const { behovsmelding, isLoading: isBehovsmeldingLoading } = useBehovsmelding()
  const { varsler, harVarsler } = useSøknadsVarsler()
  const { harUtkast } = useNotater(sak?.data.sakId)

  // TODO: Teste ut suspense mode i swr
  if (isSakLoading || isBehovsmeldingLoading) {
    return <SakLoader />
  }

  if (!sak || !behovsmelding) return null

  const isBestilling = sak.data.sakstype === Sakstype.BESTILLING

  return (
    <HGrid
      columns={`max(${hovedInnholdMaxWidth})  minmax(${sidebarMinWidth}, ${hotsakHistorikkMaxWidth})`}
      style={{ background: 'var(--ax-bg-default)', height: '100%', minHeight: '0' }}
    >
      <section style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Søknadslinje id={sak.data.sakId} />
        <HGrid columns={`${hotsakVenstremenyWidth} auto`} style={{ flex: 1 }}>
          <ScrollContainer>
            <Venstremeny gap="space-24">
              <Søknadsinfo />
              {sak.data.sakstype === Sakstype.SØKNAD && (
                <VedtakCard
                  oppgave={oppgave}
                  gjeldendeBehandling={gjeldendeBehandling}
                  sak={sak.data}
                  harNotatUtkast={harUtkast}
                />
              )}
              {isBestilling && (
                <BestillingCard
                  oppgave={oppgave}
                  gjeldendeBehandling={gjeldendeBehandling}
                  harNotatUtkast={harUtkast}
                />
              )}
            </Venstremeny>
          </ScrollContainer>
          <section>
            <ScrollContainer>
              <section className={classes.container}>
                {harVarsler && <Saksvarsler varsler={varsler} />}
                <Routes>
                  <Route
                    path="/hjelpemidler"
                    element={<HjelpemiddelListe sak={sak.data} behovsmelding={behovsmelding} />}
                  />
                  <Route
                    path="/bruker"
                    element={
                      <Box>
                        <Bruker
                          bruker={sak.data.bruker}
                          behovsmeldingsbruker={behovsmelding.bruker}
                          brukerSituasjon={behovsmelding.brukersituasjon}
                          vilkår={behovsmelding.brukersituasjon.vilkår}
                          levering={behovsmelding.levering}
                        />
                      </Box>
                    }
                  />
                  <Route path="/formidler" element={<Formidler levering={behovsmelding.levering} />} />
                  <Route path="/" element={<Navigate to="hjelpemidler" replace />} />
                </Routes>
              </section>
            </ScrollContainer>
          </section>
        </HGrid>
      </section>
      <Høyrekolonne />
    </HGrid>
  )
})

export default function Søknadsbilde() {
  return (
    <AsyncBoundary>
      <SaksbildeContent />
    </AsyncBoundary>
  )
}
