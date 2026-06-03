import { Box, HStack } from '@navikt/ds-react'
import { useState, type ReactNode } from 'react'
import { Group, Panel, useDefaultLayout } from 'react-resizable-panels'

import { BrevPanel } from '../../brev/BrevPanel.tsx'
import { AsyncBoundary } from '../../felleskomponenter/AsyncBoundary.tsx'
import { ResizeHandle } from '../../felleskomponenter/resize/ResizeHandle.tsx'
import { type Saksbehandlingsoppgave } from '../../oppgave/oppgaveTypes.ts'
import { usePerson } from '../../personoversikt/usePerson.ts'
import { Personlinje } from '../../saksbilde/Personlinje.tsx'
import { type Innsenderbehovsmelding } from '../../types/BehovsmeldingTypes.ts'
import { type Sak } from '../../types/types.internal.ts'
import { useSakHotkeys } from '../hotkeys/useSakHotkeys.ts'
import BehandlingPanel from './behandling/BehandlingPanel.tsx'
import {
  Gjenstående,
  isBehandlingsutfallHenleggelse,
  isBehandlingsutfallOverføring,
  isBehandlingsutfallVedtak,
} from './behandling/behandlingTyper.ts'
import { useBehandling } from './behandling/useBehandling.ts'
import { BehovsmeldingsPanel } from './BehovsmeldingsPanel.tsx'
import { KontaktinformasjonPanel } from './KontaktinformasjonPanel.tsx'
import { BrevManglerModal } from './modaler/BrevManglerModal.tsx'
import { FattVedtakModalV2 } from './modaler/FattVedtakModalV2.tsx'
import { HenleggModal } from './modaler/HenleggModal.tsx'
import { NotatIUtkastModal } from './modaler/NotatIUtkastModal.tsx'
import { OverførTilGosysModal } from './modaler/OverførTilGosysModal.tsx'
import { ResultatManglerModal } from './modaler/ResultatManglerModal.tsx'
import { UgyldigSnarveiModal } from './modaler/UgyldigSnarveiModal.tsx'
import { SakKontrollPanel } from './SakKontrollPanel.tsx'
import classes from './SakV2.module.css'
import { Sidebar } from './sidebars/Sidebar.tsx'
import { StickyBunnlinje } from './StickyBunnlinje.tsx'
import { useSakContext } from './SakV2ContextType.ts'
import { SidebarEksperiment } from './sidebars/SidebarEksperiment.tsx'
import { useEksperimentSidebar } from './useEksperimentSidebar.ts'

import { VertikalIkonBar } from './sidebars/VertikalIkonBar.tsx'
import { useMiljø } from '../../utils/useMiljø.ts'
import { OverførtilGosysValideringFeil } from './modaler/OverførtilGosysValideringFeil.tsx'

function AvrundetPanel({ children }: { children: ReactNode }) {
  return (
    <Box
      background="default"
      paddingBlock="space-12 space-0"
      borderRadius="12 12 0 0"
      height="100%"
      borderColor="neutral-subtle"
      borderWidth="1 1 0 1"
    >
      {children}
    </Box>
  )
}

function SakV2Content({
  oppgave,
  sak,
  behovsmelding,
}: {
  oppgave?: Saksbehandlingsoppgave
  sak: Sak
  behovsmelding: Innsenderbehovsmelding
}) {
  const [visFerdigstillModal, setVisFerdigstillModal] = useState(false)
  const [visHenleggModal, setVisHenleggModal] = useState(false)
  const [visOverførGosysModal, setVisOverførGosysModal] = useState(false)
  const { personInfo, isLoading: personInfoLoading } = usePerson(sak.bruker.fnr)
  const [visResultatManglerModal, setVisResultatManglerModal] = useState(false)
  const [visBrevMangler, setVisBrevMangler] = useState(false)
  const [visNotatIkkeFerdigstilt, setVisNotatIkkeFerdigstilt] = useState(false)
  const [annetResultatValgt, setAnnetResultatValgt] = useState(false)
  const { erProd } = useMiljø()

  const { panelState, totalVisibleMinWidth, harFlerePanelerÅpne, henleggFormRef, sidebarOpenDefaultSizeRequestId } =
    useSakContext()
  const { panels } = panelState

  const { gjeldendeBehandling } = useBehandling()
  const behandlingsutfall = gjeldendeBehandling?.utfall

  const gjenstående = gjeldendeBehandling?.gjenstående || []
  const gjenståendeForOverføringTilGosys = gjeldendeBehandling?.operasjoner.overfør.gjenstående || []
  const [visOverføringValideringsfeil, setVisOverføringValideringsfeil] = useState(false)

  useSakHotkeys({
    onAnnetResultat: () => setAnnetResultatValgt(true),
    onBrevMangler: () => setVisBrevMangler(true),
    onNotatIkkeFerdigstilt: () => setVisNotatIkkeFerdigstilt(true),
    onFattVedtak: () => setVisFerdigstillModal(true),
  })

  const notaterIkkeFerdigstilt = gjenstående.includes(Gjenstående.NOTAT_IKKE_FERDIGSTILT)
  const brevutkastIkkeFerdigstilt =
    gjenstående.includes(Gjenstående.BREV_IKKE_FERDIGSTILT) || gjenstående.includes(Gjenstående.BREV_MANGLER)

  const { defaultLayout, onLayoutChanged } = useDefaultLayout({ groupId: 'sakv2', storage: localStorage })

  const bahandlingsPanel = panels.behandlingspanel
  const behovsmeldingsPanel = panels.behovsmeldingspanel
  const kontaktinformasjonPanel = panels.kontaktinformasjonpanel
  const sidePanel = panels.sidebarpanel
  const brevPanel = panels.brevpanel

  const { setEksperimentSidebarPanel, handleEksperimentSidebarResize } = useEksperimentSidebar({
    sidePanelVisible: sidePanel.visible,
    sidePanelDefaultSize: sidePanel.defaultSize,
    sidebarOpenDefaultSizeRequestId,
  })

  return (
    <Box background="neutral-moderate" className={classes.container} style={{ minWidth: `${totalVisibleMinWidth}px` }}>
      <HStack width="100%" wrap={false}>
        <Personlinje loading={personInfoLoading} person={personInfo} skjulTelefonnummer />
        <SakKontrollPanel />
      </HStack>
      <Box
        marginBlock="space-8 space-0"
        marginInline="space-8"
        className={`${classes.resizableArea} ${classes.sakHovedLayout}`}
      >
        <Group
          orientation="horizontal"
          defaultLayout={defaultLayout}
          onLayoutChange={onLayoutChanged}
          className={!erProd ? classes.eksperimentPanelGroup : undefined}
        >
          {bahandlingsPanel.visible && (
            <Panel
              id="behandlingspanel"
              defaultSize={bahandlingsPanel.defaultSize}
              minSize={`${bahandlingsPanel.minWidth}${bahandlingsPanel.minWidthUnit}`}
              groupResizeBehavior="preserve-pixel-size"
            >
              <AvrundetPanel>
                <BehandlingPanel sak={sak} behovsmelding={behovsmelding} />
              </AvrundetPanel>
            </Panel>
          )}
          {brevPanel.visible && (
            <>
              {harFlerePanelerÅpne && <ResizeHandle />}
              <Panel
                id="brevpanel"
                defaultSize={brevPanel.defaultSize}
                minSize={`${brevPanel.minWidth}${brevPanel.minWidthUnit}`}
              >
                <AvrundetPanel>
                  <BrevPanel oppgave={oppgave} />
                </AvrundetPanel>
              </Panel>
            </>
          )}
          {behovsmeldingsPanel.visible && (
            <>
              {harFlerePanelerÅpne && <ResizeHandle />}

              <Panel
                id="behovsmeldingspanel"
                defaultSize={behovsmeldingsPanel.defaultSize}
                minSize={`${behovsmeldingsPanel.minWidth}${behovsmeldingsPanel.minWidthUnit}`}
              >
                <AvrundetPanel>
                  <BehovsmeldingsPanel sak={sak} behovsmelding={behovsmelding} />
                </AvrundetPanel>
              </Panel>
            </>
          )}
          {kontaktinformasjonPanel.visible && (
            <>
              {harFlerePanelerÅpne && <ResizeHandle />}

              <Panel
                id="kontaktinformasjonpanel"
                defaultSize={kontaktinformasjonPanel.defaultSize}
                minSize={`${kontaktinformasjonPanel.minWidth}${kontaktinformasjonPanel.minWidthUnit}`}
                groupResizeBehavior="preserve-pixel-size"
              >
                <AvrundetPanel>
                  <KontaktinformasjonPanel sak={sak} behovsmelding={behovsmelding} />
                </AvrundetPanel>
              </Panel>
            </>
          )}
          {sidePanel.visible && erProd && (
            <>
              {harFlerePanelerÅpne && <ResizeHandle />}
              <Panel
                id="sidebarpanel"
                defaultSize={sidePanel.defaultSize}
                minSize={`${sidePanel.minWidth}${sidePanel.minWidthUnit}`}
              >
                <AvrundetPanel>
                  <Sidebar oppgave={oppgave} />
                </AvrundetPanel>
              </Panel>
            </>
          )}
          {!erProd && (
            <>
              {sidePanel.visible && <ResizeHandle />}
              <Panel
                id="sidebarpanel"
                panelRef={setEksperimentSidebarPanel}
                defaultSize={sidePanel.visible ? sidePanel.defaultSize : 0}
                minSize={`${sidePanel.minWidth}${sidePanel.minWidthUnit}`}
                collapsible
                collapsedSize={0}
                groupResizeBehavior="preserve-pixel-size"
                onResize={handleEksperimentSidebarResize}
              >
                <div className={classes.eksperimentSidebarPanel}>
                  <Box
                    background="default"
                    paddingBlock="space-12 space-0"
                    borderRadius="12 0 0 0"
                    height="100%"
                    borderColor="neutral-subtle"
                    borderWidth="1 0 0 1"
                  >
                    <SidebarEksperiment oppgave={oppgave} />
                  </Box>
                </div>
              </Panel>
            </>
          )}
        </Group>
        {!erProd && <VertikalIkonBar />}
      </Box>
      <StickyBunnlinje oppgave={oppgave} sak={sak} onClick={() => modalVelger()} />
      <ResultatManglerModal open={visResultatManglerModal} onClose={() => setVisResultatManglerModal(false)} />
      {isBehandlingsutfallVedtak(behandlingsutfall) && (
        <BrevManglerModal
          open={visBrevMangler}
          onClose={() => setVisBrevMangler(false)}
          gjenstående={gjenstående}
          vedtaksresultat={behandlingsutfall.utfall}
        />
      )}
      {isBehandlingsutfallHenleggelse(behandlingsutfall) && (
        <BrevManglerModal
          open={visBrevMangler}
          onClose={() => setVisBrevMangler(false)}
          gjenstående={gjenstående}
          henleggelsesutfall={behandlingsutfall.utfall}
        />
      )}
      <NotatIUtkastModal open={visNotatIkkeFerdigstilt} onClose={() => setVisNotatIkkeFerdigstilt(false)} />
      <UgyldigSnarveiModal open={annetResultatValgt} onClose={() => setAnnetResultatValgt(false)} />

      {isBehandlingsutfallVedtak(behandlingsutfall) && (
        <FattVedtakModalV2
          open={visFerdigstillModal}
          onClose={() => setVisFerdigstillModal(false)}
          sak={sak}
          vedtaksresultat={behandlingsutfall.utfall}
        />
      )}
      {isBehandlingsutfallHenleggelse(behandlingsutfall) && (
        <HenleggModal open={visHenleggModal} onClose={() => setVisHenleggModal(false)} sak={sak} />
      )}
      <OverførTilGosysModal open={visOverførGosysModal} onClose={() => setVisOverførGosysModal(false)} />
      <OverførtilGosysValideringFeil
        gjenstående={gjenståendeForOverføringTilGosys}
        open={visOverføringValideringsfeil}
        onClose={() => setVisOverføringValideringsfeil(false)}
      />
    </Box>
  )

  async function modalVelger() {
    if (!gjeldendeBehandling || !behandlingsutfall) {
      setVisResultatManglerModal(true)
    } else if (isBehandlingsutfallOverføring(behandlingsutfall)) {
      if (gjenståendeForOverføringTilGosys.length > 0) {
        setVisOverføringValideringsfeil(true)
      } else {
        setVisOverførGosysModal(true)
      }
    } else if (brevutkastIkkeFerdigstilt) {
      setVisBrevMangler(true)
    } else if (notaterIkkeFerdigstilt) {
      setVisNotatIkkeFerdigstilt(true)
    } else if (isBehandlingsutfallHenleggelse(behandlingsutfall)) {
      const valid = await henleggFormRef.current?.validate()
      if (valid) {
        setVisHenleggModal(true)
      }
    } else {
      setVisFerdigstillModal(true)
    }
  }
}

export default function SakV2({
  oppgave,
  sak,
  behovsmelding,
}: {
  oppgave?: Saksbehandlingsoppgave
  sak: Sak
  behovsmelding: Innsenderbehovsmelding
}) {
  return (
    <AsyncBoundary>
      <SakV2Content oppgave={oppgave} sak={sak} behovsmelding={behovsmelding} />
    </AsyncBoundary>
  )
}
