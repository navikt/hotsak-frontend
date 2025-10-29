import { HouseIcon } from '@navikt/aksel-icons'
import { Box, Button, HStack, Tabs, VStack } from '@navikt/ds-react'
import { Panel, PanelGroup } from 'react-resizable-panels'
import { ScrollContainer } from '../../../../felleskomponenter/ScrollContainer'
import { usePerson } from '../../../../personoversikt/usePerson'
import { Bruker } from '../../../../saksbilde/bruker/Bruker'
import { Formidler } from '../../../../saksbilde/formidler/Formidler'
import { Personlinje } from '../../../../saksbilde/Personlinje'
import { useBehovsmelding } from '../../../../saksbilde/useBehovsmelding'
import { useSak } from '../../../../saksbilde/useSak'
import { BrevPanelEksperiment } from '../brev/BrevPanelEksperiment'
import { ResizeHandle } from '../felleskomponenter/ResizeHandle'
import { SakKontrollPanel } from './SakKontrollPanel'
import styles from './SaksbehandlingEksperiment.module.css'
import { useSaksbehandlingEksperimentContext } from './SaksbehandlingEksperimentProvider'
import { SøknadPanelTabs } from './SaksbehandlingEksperimentProviderTypes'
import SøknadEksperiment from './søknad/SøknadEksperiment'
import { NedreVenstrePanel } from './venstrepanel/NedreVenstrePanel'
import { ØvreVenstrePanel } from './venstrepanel/ØvreVenstrePanel'
import { VilkårPanelEksperiment } from './vilkår/VilkårPanelEksperiment'

export function SaksbehandlingEksperiment() {
  const { sak } = useSak()
  const { behovsmelding } = useBehovsmelding()
  const { personInfo, isLoading: personInfoLoading } = usePerson(sak?.data.bruker.fnr)

  const { venstrePanel, søknadPanel, brevKolonne, vilkårPanel, valgtSøknadPanelTab, setValgtSøknadPanelTab } =
    useSaksbehandlingEksperimentContext()

  return (
    <>
      <HStack width="100%" wrap={false}>
        <Personlinje loading={personInfoLoading} person={personInfo} skjulTelefonnummer />
        <SakKontrollPanel />
      </HStack>
      <div
        style={{
          flex: 1,
          minHeight: 0,
          marginTop: 'var(--ax-space-16)',
          marginLeft: 'var(--ax-space-16)',
          marginRight: 'var(--ax-space-16)',
        }}
      >
        <PanelGroup direction="horizontal" autoSaveId="eksperimentellSaksbehandling">
          {venstrePanel && (
            <>
              <Panel defaultSize={12} minSize={10} order={1}>
                <VStack gap="space-16" height={'100%'}>
                  <ØvreVenstrePanel />
                  <div style={{ flex: 1, minHeight: 0 }}>
                    <NedreVenstrePanel />
                  </div>
                </VStack>
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
                  <VStack gap="space-16">
                    <Box.New background="default" borderRadius="large">
                      <Tabs
                        value={valgtSøknadPanelTab}
                        onChange={(value) => setValgtSøknadPanelTab(value as SøknadPanelTabs)}
                      >
                        <Tabs.List>
                          <Tabs.Tab icon={<HouseIcon />} value={SøknadPanelTabs.SØKNAD} label="Hjelpemidler" />
                          <Tabs.Tab value={SøknadPanelTabs.BRUKER} label="Bruker" />
                          <Tabs.Tab value={SøknadPanelTabs.FORMIDLER} label="Formidler" />
                        </Tabs.List>
                        <ScrollContainer>
                          <section className={styles.søknadContainer}>
                            <Tabs.Panel value={SøknadPanelTabs.SØKNAD.toString()}>
                              <SøknadEksperiment sak={sak.data} behovsmelding={behovsmelding} />
                            </Tabs.Panel>
                            <Tabs.Panel value={SøknadPanelTabs.BRUKER.toString()}>
                              <Bruker
                                bruker={sak.data.bruker}
                                behovsmeldingsbruker={behovsmelding.bruker}
                                brukerSituasjon={behovsmelding.brukersituasjon}
                                levering={behovsmelding.levering}
                                vilkår={behovsmelding.brukersituasjon.vilkår}
                              />
                            </Tabs.Panel>
                            <Tabs.Panel value={SøknadPanelTabs.FORMIDLER.toString()}>
                              <Formidler levering={behovsmelding.levering} />
                            </Tabs.Panel>
                          </section>
                        </ScrollContainer>
                      </Tabs>
                    </Box.New>
                  </VStack>
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
              <BrevPanelEksperiment />
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
