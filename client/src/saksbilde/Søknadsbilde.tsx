import { Box, HGrid } from '@navikt/ds-react'
import { memo } from 'react'
import { Navigate } from 'react-router'
import { Route, Routes } from 'react-router-dom'

import { AsyncBoundary } from '../felleskomponenter/AsyncBoundary.tsx'
import { ScrollContainer } from '../felleskomponenter/ScrollContainer'
import { hotsakHistorikkMaxWidth, hotsakVenstremenyWidth, hovedInnholdMaxWidth, sidebarMinWidth } from '../GlobalStyles'
import { type Saksbehandlingsoppgave } from '../oppgave/oppgaveTypes.ts'
import { useNotater } from '../sak/notat/useNotater'
import { useBehandling } from '../sak/v2/behandling/useBehandling.ts'
import { BestillingCard } from './bestillingsordning/BestillingCard'
import { Saksvarsler } from './bestillingsordning/Saksvarsler'
import { Bruker } from './bruker/Bruker'
import { Formidler } from './formidler/Formidler'
import HjelpemiddelListe from './hjelpemidler/HjelpemiddelListe'
import { Høyrekolonne } from './høyrekolonne/Høyrekolonne'
import { SakLoader } from './SakLoader'
import classes from './Søknadsbilde.module.css'
import { Søknadslinje } from './Søknadslinje'
import { useBehovsmelding } from './useBehovsmelding'
import { useSak } from './useSak'
import { useSøknadsVarsler } from './varsler/useVarsler'
import { Søknadsinfo } from './venstremeny/Søknadsinfo'
import { Venstremeny } from './venstremeny/Venstremeny'

// fixme

const SøknadsbildeContent = memo(({ oppgave }: { oppgave?: Saksbehandlingsoppgave }) => {
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

  return (
    <HGrid
      columns={`max(${hovedInnholdMaxWidth}) minmax(${sidebarMinWidth}, ${hotsakHistorikkMaxWidth})`}
      className={classes.hovedGrid}
    >
      <section className={classes.section}>
        <Søknadslinje id={sak.data.sakId} />
        <HGrid columns={`${hotsakVenstremenyWidth} auto`} className={classes.flex1}>
          <ScrollContainer>
            <Venstremeny gap="space-24">
              <Søknadsinfo />
              <BestillingCard oppgave={oppgave} gjeldendeBehandling={gjeldendeBehandling} harNotatUtkast={harUtkast} />
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
      <Høyrekolonne oppgave={oppgave} />
    </HGrid>
  )
})

export default function Søknadsbilde({ oppgave }: { oppgave?: Saksbehandlingsoppgave }) {
  return (
    <AsyncBoundary>
      <SøknadsbildeContent oppgave={oppgave} />
    </AsyncBoundary>
  )
}
