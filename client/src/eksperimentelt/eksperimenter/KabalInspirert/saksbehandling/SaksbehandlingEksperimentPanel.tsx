import {
  BriefcaseIcon,
  CheckmarkIcon,
  EnvelopeClosedIcon,
  FileTextIcon,
  HouseIcon,
  NotePencilIcon,
  ParagraphIcon,
  WheelchairIcon,
} from '@navikt/aksel-icons'
import { Box, Button, CopyButton, Heading, HGrid, HStack, Tabs, Tooltip, VStack } from '@navikt/ds-react'
import { Panel, PanelGroup } from 'react-resizable-panels'
import { Feilmelding } from '../../../../felleskomponenter/feil/Feilmelding'
import { BehovsmeldingEtikett } from '../../../../felleskomponenter/Oppgaveetikett'
import { Skillelinje } from '../../../../felleskomponenter/Strek'
import { Brødtekst, Etikett } from '../../../../felleskomponenter/typografi'
import { useOppgave } from '../../../../oppgave/useOppgave'
import { usePerson } from '../../../../personoversikt/usePerson'
import { Bruker } from '../../../../saksbilde/bruker/Bruker'
import { Formidler } from '../../../../saksbilde/formidler/Formidler'
import { Notater } from '../../../../saksbilde/høyrekolonne/notat/Notater'
import { Personlinje } from '../../../../saksbilde/Personlinje'
import { useBehovsmelding } from '../../../../saksbilde/useBehovsmelding'
import { useSak } from '../../../../saksbilde/useSak'
import { useSaksregler } from '../../../../saksregler/useSaksregler'
import { Sakstype } from '../../../../types/types.internal'
import { formaterDato, formaterTidsstempel } from '../../../../utils/dato'
import { formaterNavn, formaterTelefonnummer, storForbokstavIAlleOrd } from '../../../../utils/formater'
import { BrevPanelEksperiment } from '../brev/BrevPanelEksperiment'
import { ResizeHandle } from '../felleskomponenter/ResizeHandle'
import BehandlingEksperimentPanel from './behandling/BehandlingEksperiment'
import { SakKontrollPanel } from './SakKontrollPanel'
import styles from './SaksbehandlingEksperiment.module.css'
import { useSaksbehandlingEksperimentContext } from './SaksbehandlingEksperimentProvider'
import { SøknadPanelTabs } from './SaksbehandlingEksperimentProviderTypes'
import { HastEksperiment } from './søknad/HastEksperiment'
import SøknadEksperiment from './søknad/SøknadEksperiment'
import { NedreVenstrePanel } from './venstrepanel/NedreVenstrePanel'
import { ØvreVenstrePanel } from './venstrepanel/ØvreVenstrePanel'

export function SaksbehandlingEksperiment() {
  const { sak } = useSak()
  const { behovsmelding } = useBehovsmelding()
  const { personInfo, isLoading: personInfoLoading } = usePerson(sak?.data.bruker.fnr)
  const { oppgave } = useOppgave()
  const formidlerNavnFormatert = formaterNavn(behovsmelding?.levering.hjelpemiddelformidler.navn)
  const { kanBehandleSak } = useSaksregler()

  const {
    venstrePanel,
    setVenstrePanel,
    søknadPanel,
    setSøknadPanel,
    notatPanel,
    setNotatPanel,
    brevKolonne,
    setBrevKolonne,
    behandlingPanel,
    setBehandlingPanel,
    valgtSøknadPanelTab,
    setValgtSøknadPanelTab,
  } = useSaksbehandlingEksperimentContext()

  if (!sak || !behovsmelding) {
    // TODO skeleton eller loader her?
    return <div>Fant ikke sak eller behovsmelding</div>
  }

  return (
    <>
      <HStack width="100%" wrap={false}>
        <Personlinje loading={personInfoLoading} person={personInfo} skjulTelefonnummer />
        <SakKontrollPanel />
      </HStack>
      <HGrid
        columns={'50px auto'}
        style={{
          flex: 1,
          minHeight: 0,
          marginTop: 'var(--ax-space-4)',
          marginRight: 'var(--ax-space-16)',
        }}
      >
        <VStack paddingInline={'space-6'} gap="space-8">
          <Tooltip content="Utlånsoversikt">
            <Button
              variant="secondary-neutral"
              icon={<WheelchairIcon />}
              style={venstrePanel ? { backgroundColor: 'var(--ax-bg-accent-moderate)' } : {}}
              onClick={() => {
                setVenstrePanel(!venstrePanel)
              }}
            />
          </Tooltip>
          <Tooltip content="Søknad">
            <Button
              variant="secondary-neutral"
              icon={<FileTextIcon />}
              style={søknadPanel ? { backgroundColor: 'var(--ax-bg-accent-moderate)' } : {}}
              onClick={() => {
                setSøknadPanel(!søknadPanel)
              }}
            />
          </Tooltip>
          <Tooltip content="Notater">
            <Button
              variant="secondary-neutral"
              icon={<NotePencilIcon />}
              style={notatPanel ? { backgroundColor: 'var(--ax-bg-accent-moderate)' } : {}}
              onClick={() => {
                setNotatPanel(!notatPanel)
              }}
            />
          </Tooltip>
          <Tooltip content="Behandling">
            <Button
              variant="secondary-neutral"
              icon={<ParagraphIcon />}
              style={behandlingPanel ? { backgroundColor: 'var(--ax-bg-accent-moderate)' } : {}}
              onClick={() => {
                setBehandlingPanel(!behandlingPanel)
              }}
            />
          </Tooltip>
          <Tooltip content="Brev">
            <Button
              variant="secondary-neutral"
              icon={<EnvelopeClosedIcon />}
              style={brevKolonne ? { backgroundColor: 'var(--ax-bg-accent-moderate)' } : {}}
              onClick={() => {
                setBrevKolonne(!brevKolonne)
              }}
            />
          </Tooltip>
        </VStack>
        <PanelGroup direction="horizontal" autoSaveId="eksperimentellSaksbehandling">
          {venstrePanel && (
            <>
              <Panel defaultSize={12} minSize={11} order={1}>
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
          {notatPanel && (
            <>
              <Panel defaultSize={25} minSize={10} order={2}>
                <Box.New background="default" borderRadius="large" padding="space-16" style={{ height: '100%' }}>
                  <Notater sakId={sak.data.sakId} lesevisning={!kanBehandleSak} />
                </Box.New>
              </Panel>
              <ResizeHandle />
            </>
          )}
          {søknadPanel && (
            <>
              <Panel defaultSize={35} minSize={20} order={3}>
                {!sak || !behovsmelding ? (
                  'Fant ikke sak'
                ) : (
                  <VStack gap="space-16" style={{ overflowY: 'auto', height: '100%' }}>
                    <Box.New background="default" borderRadius="large">
                      <VStack paddingBlock="0 space-20" gap="space-16">
                        <HGrid
                          columns={'var(--ax-space-24) auto'}
                          gap="space-8"
                          paddingBlock={'space-16 0'}
                          paddingInline={'space-16 0'}
                        >
                          <BehovsmeldingEtikett variant="alt1" label="S" />
                          <Heading level="1" size="small" spacing={false}>
                            {sak.data.sakstype === Sakstype.BESTILLING ? 'Bestilling' : 'Søknad om hjelpemidler'}
                          </Heading>
                          <div />
                          <Brødtekst textColor="subtle">
                            Område:
                            {storForbokstavIAlleOrd(behovsmelding.brukersituasjon.funksjonsnedsettelser.join(', '))}
                          </Brødtekst>
                          <div />
                          <HStack gap="space-24">
                            <Brødtekst
                              data-tip="Saksnummer"
                              data-for="sak"
                              textColor="subtle"
                            >{`Sak: ${sak.data.sakId}`}</Brødtekst>
                            <Brødtekst textColor="subtle">Mottatt: {formaterTidsstempel(sak.data.opprettet)}</Brødtekst>
                            {oppgave?.fristFerdigstillelse && (
                              <Brødtekst textColor="subtle">
                                Frist: {formaterDato(oppgave.fristFerdigstillelse)}
                              </Brødtekst>
                            )}
                          </HStack>
                        </HGrid>
                        <Skillelinje />
                        <HStack gap="space-16" paddingInline={'space-40 0'} align={'end'}>
                          <VStack gap="1">
                            <Etikett>Innsendt av</Etikett>
                            <HStack>
                              <Brødtekst textColor="subtle">{formidlerNavnFormatert}</Brødtekst>
                              <CopyButton copyText={formidlerNavnFormatert} size="xsmall" />
                            </HStack>
                          </VStack>
                          <HStack>
                            <Brødtekst textColor="subtle">
                              {formaterTelefonnummer(behovsmelding.levering.hjelpemiddelformidler.telefon)}
                            </Brødtekst>
                            <CopyButton copyText={behovsmelding.levering.hjelpemiddelformidler.telefon} size="xsmall" />
                          </HStack>
                          <Brødtekst textColor="subtle">{`${storForbokstavIAlleOrd(behovsmelding.levering.hjelpemiddelformidler.stilling)}`}</Brødtekst>
                          <Brødtekst textColor="subtle">{`${storForbokstavIAlleOrd(behovsmelding.levering.hjelpemiddelformidler.adresse.poststed)}`}</Brødtekst>
                        </HStack>
                        {behovsmelding.levering.hast && <HastEksperiment hast={behovsmelding.levering.hast} />}
                      </VStack>
                      <Tabs
                        value={valgtSøknadPanelTab}
                        onChange={(value) => setValgtSøknadPanelTab(value as SøknadPanelTabs)}
                      >
                        <Tabs.List>
                          <Tabs.Tab icon={<HouseIcon />} value={SøknadPanelTabs.SØKNAD} label="Hjelpemidler" />
                          <Tabs.Tab value={SøknadPanelTabs.BRUKER} label="Bruker" />
                          <Tabs.Tab value={SøknadPanelTabs.FORMIDLER} label="Formidler" />
                        </Tabs.List>
                        {/*  <ScrollContainer>*/}
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
                        {/* </ScrollContainer>*/}
                      </Tabs>
                    </Box.New>
                  </VStack>
                )}
              </Panel>
              {(brevKolonne || behandlingPanel) && <ResizeHandle />}
            </>
          )}
          {behandlingPanel && (
            <>
              <Panel defaultSize={30} minSize={10} order={4}>
                {sak && behovsmelding ? (
                  <BehandlingEksperimentPanel sak={sak.data} behovsmelding={behovsmelding} />
                ) : (
                  <Feilmelding>Fant ikke sak eller behovsmelding</Feilmelding>
                )}
              </Panel>
              {brevKolonne && <ResizeHandle />}
            </>
          )}
          {brevKolonne && (
            <Panel defaultSize={40} minSize={10} order={5}>
              <BrevPanelEksperiment />
            </Panel>
          )}
        </PanelGroup>
      </HGrid>

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
        <Box.New background="default" borderWidth="1 0 0 0" borderColor="neutral-subtle">
          <HStack align="center" justify="space-between" gap="space-16">
            <Button type="button" variant="primary" size="small">
              Ferdigstill
            </Button>
            <Button
              type="button"
              variant="secondary-neutral"
              size="small"
              icon={notatPanel ? <CheckmarkIcon /> : <WheelchairIcon />}
              style={venstrePanel ? { backgroundColor: 'var(--ax-bg-accent-moderate)' } : {}}
              onClick={() => {
                setVenstrePanel(!venstrePanel)
              }}
            >
              Utlånsoversikt
            </Button>
            <Button
              type="button"
              variant="secondary-neutral"
              size="small"
              icon={søknadPanel ? <CheckmarkIcon /> : <FileTextIcon />}
              onClick={() => {
                setSøknadPanel(!søknadPanel)
              }}
              style={søknadPanel ? { backgroundColor: 'var(--ax-bg-accent-moderate)' } : {}}
            >
              Søknad
            </Button>

            <Button
              type="button"
              variant="secondary-neutral"
              size="small"
              icon={notatPanel ? <CheckmarkIcon /> : <NotePencilIcon />}
              style={notatPanel ? { backgroundColor: 'var(--ax-bg-accent-moderate)' } : {}}
              onClick={() => {
                setNotatPanel(!notatPanel)
              }}
            >
              Notater
            </Button>
            <Button
              type="button"
              variant="secondary-neutral"
              size="small"
              icon={behandlingPanel ? <CheckmarkIcon /> : <BriefcaseIcon />}
              onClick={() => {
                setBehandlingPanel(!behandlingPanel)
              }}
              style={behandlingPanel ? { backgroundColor: 'var(--ax-bg-accent-moderate)' } : {}}
            >
              Behandling
            </Button>
            <Button
              type="button"
              variant="secondary-neutral"
              size="small"
              icon={brevKolonne ? <CheckmarkIcon /> : <EnvelopeClosedIcon />}
              onClick={() => {
                setBrevKolonne(!brevKolonne)
              }}
              style={brevKolonne ? { backgroundColor: 'var(--ax-bg-accent-moderate)' } : {}}
            >
              Brev
            </Button>
          </HStack>
        </Box.New>
      </HStack>
    </>
  )
}
