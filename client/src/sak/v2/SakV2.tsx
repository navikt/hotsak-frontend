import { Box, HStack } from '@navikt/ds-react'
import { useState } from 'react'
import { Group, Panel, useDefaultLayout } from 'react-resizable-panels'

import { BrevPanel } from '../../brev/BrevPanel.tsx'
import { AsyncBoundary } from '../../felleskomponenter/AsyncBoundary.tsx'
import { ResizeHandle } from '../../felleskomponenter/resize/ResizeHandle.tsx'
import { usePerson } from '../../personoversikt/usePerson.ts'
import { Personlinje } from '../../saksbilde/Personlinje.tsx'
import { useBehovsmelding } from '../../saksbilde/useBehovsmelding.ts'
import { useSak } from '../../saksbilde/useSak.ts'
import BehandlingPanel from './behandling/BehandlingPanel.tsx'
import { Gjenstående, isBehandlingsutfallVedtak } from './behandling/behandlingTyper.ts'
import { useBehandling } from './behandling/useBehandling.ts'
import { BehovsmeldingsPanel } from './BehovsmeldingsPanel.tsx'
import { KontaktinformasjonPanel } from './KontaktinformasjonPanel.tsx'
import { BrevManglerModal } from './modaler/BrevManglerModal.tsx'
import { FattVedtakModalV2 } from './modaler/FattVedtakModalV2.tsx'
import { NotatIUtkastModal } from './modaler/NotatIUtkastModal.tsx'
import { ResultatManglerModal } from './modaler/ResultatManglerModal.tsx'
import { SakKontrollPanel } from './SakKontrollPanel.tsx'
import { useSakContext } from './SakProvider.tsx'
import { Sidebar } from './sidebars/Sidebar.tsx'
import { StickyBunnlinje } from './StickyBunnlinje.tsx'

function AvrundetPanel({ children }: { children: React.ReactNode }) {
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

function SakV2Content() {
  const { sak } = useSak()
  const { behovsmelding } = useBehovsmelding()
  const [visFerdigstillModal, setVisFerdigstillModal] = useState(false)
  const { personInfo, isLoading: personInfoLoading } = usePerson(sak?.data.bruker.fnr)
  const [visResultatManglerModal, setVisResultatManglerModal] = useState(false)
  const [visBrevMangler, setVisBrevMangler] = useState(false)
  const [visNotatIkkeFerdigstilt, setVisNotatIkkeFerdigstilt] = useState(false)

  const { panelState, totalVisibleMinWidth, harFlerePanelerÅpne } = useSakContext()
  const { panels } = panelState

  const { gjeldendeBehandling } = useBehandling()
  const behandlingsutfall = gjeldendeBehandling?.utfall

  const gjenstående = gjeldendeBehandling?.gjenstående || []

  const notaterIkkeFerdigstilt = gjenstående.includes(Gjenstående.NOTAT_IKKE_FERDIGSTILT)
  const brevutkastIkkeFerdigstilt =
    gjenstående.includes(Gjenstående.BREV_IKKE_FERDIGSTILT) || gjenstående.includes(Gjenstående.BREV_MANGLER)

  const { defaultLayout, onLayoutChanged } = useDefaultLayout({ groupId: 'sakv2', storage: localStorage })

  const bahandlingsPanel = panels.behandlingspanel
  const behovsmeldingsPanel = panels.behovsmeldingspanel
  const kontaktinformasjonPanel = panels.kontaktinformasjonpanel
  const sidePanel = panels.sidebarpanel
  const brevPanel = panels.brevpanel

  if (!behovsmelding) {
    // TODO skeleton eller loader her?
    return <div>Fant ikke behovsmelding</div>
  }

  if (!sak) {
    // TODO skeleton eller loader her?
    return <div>Fant ikke sak</div>
  }

  return (
    <Box
      background="neutral-moderate"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minWidth: `${totalVisibleMinWidth}px`,
        overflowY: 'hidden',
      }}
    >
      <HStack width="100%" wrap={false}>
        <Personlinje loading={personInfoLoading} person={personInfo} skjulTelefonnummer />
        <SakKontrollPanel />
      </HStack>
      <Box
        marginBlock="space-8 space-0"
        marginInline="space-8"
        style={{
          flex: 1,
          minHeight: 0,
        }}
      >
        <Group orientation="horizontal" defaultLayout={defaultLayout} onLayoutChange={onLayoutChanged}>
          {bahandlingsPanel.visible && (
            <Panel
              id="behandlingspanel"
              defaultSize={bahandlingsPanel.defaultSize}
              minSize={`${bahandlingsPanel.minWidth}${bahandlingsPanel.minWidthUnit}`}
              groupResizeBehavior="preserve-pixel-size"
            >
              <AvrundetPanel>
                <BehandlingPanel sak={sak.data} behovsmelding={behovsmelding} />
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
                  <BrevPanel />
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
                  <BehovsmeldingsPanel sak={sak.data} behovsmelding={behovsmelding} />
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
                  <KontaktinformasjonPanel sak={sak.data} behovsmelding={behovsmelding} />
                </AvrundetPanel>
              </Panel>
            </>
          )}
          {sidePanel.visible && (
            <>
              {harFlerePanelerÅpne && <ResizeHandle />}
              <Panel
                id="sidebarpanel"
                defaultSize={sidePanel.defaultSize}
                minSize={`${sidePanel.minWidth}${sidePanel.minWidthUnit}`}
              >
                <AvrundetPanel>
                  <Sidebar />
                </AvrundetPanel>
              </Panel>
            </>
          )}
        </Group>
      </Box>
      <StickyBunnlinje sak={sak.data} onClick={() => modalVelger()} />
      <ResultatManglerModal open={visResultatManglerModal} onClose={() => setVisResultatManglerModal(false)} />
      {isBehandlingsutfallVedtak(behandlingsutfall) && (
        <BrevManglerModal
          open={visBrevMangler}
          onClose={() => setVisBrevMangler(false)}
          gjenstående={gjenstående}
          vedtaksresultat={behandlingsutfall.utfall}
        />
      )}
      <NotatIUtkastModal open={visNotatIkkeFerdigstilt} onClose={() => setVisNotatIkkeFerdigstilt(false)} />
      {isBehandlingsutfallVedtak(behandlingsutfall) && (
        <FattVedtakModalV2
          open={visFerdigstillModal}
          onClose={() => setVisFerdigstillModal(false)}
          sak={sak.data}
          vedtaksresultat={behandlingsutfall.utfall}
        />
      )}
    </Box>
  )

  function modalVelger() {
    if (!gjeldendeBehandling || !behandlingsutfall) {
      setVisResultatManglerModal(true)
    } else if (brevutkastIkkeFerdigstilt) {
      setVisBrevMangler(true)
    } else if (notaterIkkeFerdigstilt) {
      setVisNotatIkkeFerdigstilt(true)
    } else {
      setVisFerdigstillModal(true)
    }
  }
}

export default function SakV2() {
  return (
    <AsyncBoundary>
      <SakV2Content />
    </AsyncBoundary>
  )
}
