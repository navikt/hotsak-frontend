import { Box, Button, HGrid, HStack } from '@navikt/ds-react'
import { Panel, PanelGroup } from 'react-resizable-panels'
import { usePerson } from '../../../../personoversikt/usePerson'
import { Personlinje } from '../../../../saksbilde/Personlinje'
import { useSak } from '../../../../saksbilde/useSak'
import { LayoutKontroller } from './LayoutKontroller'

import { Route, Routes } from 'react-router'
import { ScrollContainer } from '../../../../felleskomponenter/ScrollContainer'
import { Bruker } from '../../../../saksbilde/bruker/Bruker'
import { Formidler } from '../../../../saksbilde/formidler/Formidler'
import HjelpemiddelListe from '../../../../saksbilde/hjelpemidler/HjelpemiddelListe'
import { Søknadslinje } from '../../../../saksbilde/Søknadslinje'
import { useBehovsmelding } from '../../../../saksbilde/useBehovsmelding'
import { ResizeHandle } from '../felleskomponenter/ResizeHandle'
import { InfokolonneEksperiment } from './infokolonne/InfokolonneEksperiment'
import styles from './SaksbehandlingEksperiment.module.css'
import { useSaksbehandlingEksperimentContext } from './SaksbehandlingEksperimentProvider'
import { TingÅGjøreEksperiment } from './TingÅGjøraEksperiment'

export function SaksbehandlingEksperiment() {
  const { sak } = useSak()
  const { behovsmelding } = useBehovsmelding()
  const { personInfo, isLoading: personInfoLoading } = usePerson(sak?.data.bruker.fnr)
  const { venstreKolonne, midtreKolonne, høyreKolonne } = useSaksbehandlingEksperimentContext()

  return (
    <>
      <HStack width="100%" wrap={false}>
        <Personlinje loading={personInfoLoading} person={personInfo} skjulTelefonnummer />
        <LayoutKontroller />
      </HStack>
      <div style={{ flex: 1, minHeight: 0 }}>
        <PanelGroup direction="horizontal" autoSaveId="eksperimentellSaksbehandling">
          {venstreKolonne && (
            <>
              <Panel defaultSize={30} minSize={10} order={1}>
                <InfokolonneEksperiment />
              </Panel>
              <ResizeHandle />
            </>
          )}
          {midtreKolonne && (
            <>
              <Panel defaultSize={40} minSize={20} order={2}>
                {!sak || !behovsmelding ? (
                  'Fant ikke sak'
                ) : (
                  <>
                    <HGrid columns="auto">
                      <Søknadslinje id={sak.data.sakId} />
                    </HGrid>
                    <ScrollContainer>
                      <section className={styles.søknadContainer}>
                        <Routes>
                          <Route
                            path="/"
                            element={<HjelpemiddelListe sak={sak.data} behovsmelding={behovsmelding} />}
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
              <ResizeHandle />
            </>
          )}
          {høyreKolonne && (
            <Panel defaultSize={30} minSize={10} order={3}>
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
            <Button type="button" variant="secondary-neutral" size="small">
              Overfør til medarbeider
            </Button>
            <Button type="button" variant="secondary-neutral" size="small">
              Send til Gosys
            </Button>
          </HStack>
        </Box.New>
      </HStack>
    </>
  )
}
