import { Box, Button, HGrid, HStack } from '@navikt/ds-react'
import { Panel, PanelGroup } from 'react-resizable-panels'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import { ScrollContainer } from '../../../../felleskomponenter/ScrollContainer'
import { usePerson } from '../../../../personoversikt/usePerson'
import { Bruker } from '../../../../saksbilde/bruker/Bruker'
import { Formidler } from '../../../../saksbilde/formidler/Formidler'
import { Personlinje } from '../../../../saksbilde/Personlinje'
import { Søknadslinje } from '../../../../saksbilde/Søknadslinje'
import { useBehovsmelding } from '../../../../saksbilde/useBehovsmelding'
import { useSak } from '../../../../saksbilde/useSak'
import { ResizeHandle } from '../felleskomponenter/ResizeHandle'
import { SakKontrollPanel } from './SakKontrollPanel'
import styles from './SaksbehandlingEksperiment.module.css'
import { useSaksbehandlingEksperimentContext } from './SaksbehandlingEksperimentProvider'
import SøknadEksperiment from './søknad/SøknadEksperiment'
import { TingÅGjøreEksperiment } from './TingÅGjøraEksperiment'
import { VilkårPanelEksperiment } from './vilkår/VilkårPanelEksperiment'
import { NedreVenstrePanel } from './venstrepanel/NedreVenstrePanel'
import { ØvreVenstrePanel } from './venstrepanel/ØvreVenstrePanel'

export function SaksbehandlingEksperiment() {
  const { sak } = useSak()
  const { behovsmelding } = useBehovsmelding()
  const { personInfo, isLoading: personInfoLoading } = usePerson(sak?.data.bruker.fnr)

  const { venstrePanel, søknadPanel, brevKolonne, vilkårPanel } = useSaksbehandlingEksperimentContext()
  const location = useLocation()

  return (
    <>
      <HStack width="100%" wrap={false}>
        <Personlinje loading={personInfoLoading} person={personInfo} skjulTelefonnummer />
        <SakKontrollPanel />
      </HStack>
      <div style={{ flex: 1, minHeight: 0 }}>
        <PanelGroup direction="horizontal" autoSaveId="eksperimentellSaksbehandling">
          {venstrePanel && (
            <>
              <Panel defaultSize={15} minSize={10} order={1}>
                <PanelGroup direction="vertical">
                  <Panel defaultSize={40} minSize={20} maxSize={80} order={1}>
                    <ØvreVenstrePanel />
                  </Panel>
                  <ResizeHandle retning="vertikal" />
                  <Panel defaultSize={60} minSize={20} maxSize={80} order={1}>
                    <NedreVenstrePanel />
                  </Panel>
                </PanelGroup>
              </Panel>
              <ResizeHandle />
            </>
          )}
          {søknadPanel && (
            <>
              <Panel defaultSize={40} minSize={20} order={2}>
                {!sak || !behovsmelding ? (
                  'Fant ikke sak'
                ) : (
                  <>
                    <HGrid columns="auto">
                      <Søknadslinje id={sak.data.sakId} skjulSaksmeny={true} />
                    </HGrid>
                    <ScrollContainer>
                      <section className={styles.søknadContainer}>
                        <Routes>
                          <Route path="/" element={<Navigate to={`${location.pathname}/hjelpemidler`} replace />} />
                          <Route
                            path="/hjelpemidler"
                            element={<SøknadEksperiment sak={sak.data} behovsmelding={behovsmelding} />}
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
                          <Route path="/formidler" element={<Formidler levering={behovsmelding.levering} />} />
                        </Routes>
                      </section>
                    </ScrollContainer>
                  </>
                )}
              </Panel>
              {(brevKolonne || vilkårPanel) && <ResizeHandle />}
            </>
          )}
          {vilkårPanel && (
            <>
              <Panel defaultSize={30} minSize={10} order={3}>
                <VilkårPanelEksperiment />
              </Panel>
              {brevKolonne && <ResizeHandle />}
            </>
          )}
          {brevKolonne && (
            <Panel defaultSize={30} minSize={10} order={4}>
              <TingÅGjøreEksperiment />
            </Panel>
          )}
        </PanelGroup>
      </div>

      <HStack
        asChild
        position="sticky"
        left="0"
        bottom="0"
        align="center"
        justify="space-between"
        gap="4"
        paddingInline="4"
        paddingBlock="2"
        width="100%"
        className="z-23"
      >
        <Box.New background="accent-moderate" borderWidth="1 0 0 0" borderColor="neutral-subtle">
          <HStack align="center" justify="space-between" gap="space-16">
            <Button type="button" variant="primary-neutral" size="small">
              Innvilg
            </Button>
            <Button type="button" variant="secondary-neutral" size="small">
              Henlegg
            </Button>
            <Button type="button" variant="secondary-neutral" size="small">
              Avslå
            </Button>
            <Button type="button" variant="secondary-neutral" size="small">
              Sett på vent
            </Button>
          </HStack>
        </Box.New>
      </HStack>
    </>
  )
}
