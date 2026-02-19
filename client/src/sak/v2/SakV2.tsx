import { Box, HStack } from '@navikt/ds-react'
import { useState } from 'react'
import { Panel, Group, useDefaultLayout } from 'react-resizable-panels'
import { BrevPanel } from '../../brev/BrevPanel.tsx'
import { Feilmelding } from '../../felleskomponenter/feil/Feilmelding.tsx'
import { ResizeHandle } from '../../felleskomponenter/resize/ResizeHandle.tsx'
import { usePerson } from '../../personoversikt/usePerson.ts'
import { Personlinje } from '../../saksbilde/Personlinje.tsx'
import { useBehovsmelding } from '../../saksbilde/useBehovsmelding.ts'
import { useSak } from '../../saksbilde/useSak.ts'
import BehandlingPanel from './behandling/BehandlingPanel.tsx'
import { Gjenstående, VedtaksResultat } from './behandling/behandlingTyper.ts'
import { useBehandling } from './behandling/useBehandling.ts'
import { BehovsmeldingsPanel } from './BehovsmeldingsPanel.tsx'
import { BrevManglerModal } from './modaler/BrevManglerModal.tsx'
import { NotatIUtkastModal } from './modaler/NotatIUtkastModal.tsx'
import { ResultatManglerModal } from './modaler/ResultatManglerModal.tsx'
import { SakKontrollPanel } from './SakKontrollPanel.tsx'
import { useSakContext } from './SakProvider.tsx'
import { StickyBunnlinje } from './StickyBunnlinje.tsx'
import { FattVedtakModalV2 } from './modaler/FattVedtakModalV2.tsx'
import { headerHøyde } from '../../GlobalStyles.tsx'
import { Sidebar } from './sidebars/Sidebar.tsx'

export function SakV2() {
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
  const vedtaksResultat = gjeldendeBehandling?.utfall?.utfall as VedtaksResultat | undefined

  const gjenstående = gjeldendeBehandling?.gjenstående || []

  const notaterIkkeFerdigstilt = gjenstående.includes(Gjenstående.NOTAT_IKKE_FERDIGSTILT)
  const brevutkastIkkeFerdigstilt =
    gjenstående.includes(Gjenstående.BREV_IKKE_FERDIGSTILT) || gjenstående.includes(Gjenstående.BREV_MANGLER)

  const { defaultLayout, onLayoutChanged } = useDefaultLayout({ groupId: 'sakv2', storage: localStorage })

  const bahandlingsPanel = panels.behandlingspanel
  const behovsmeldingsPanel = panels.behovsmeldingspanel
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

  // TODO bruke css modules vars
  // se på width, height og overflow for Group
  // Teste dobbeltklikk på separator for å resette paneler til default størrelse
  // Sette max width på noen paneler?
  // Teste collapsible panel
  // Se på css animasjoner for panler som kollapser eller endrer størrelse
  // Minimumsbredde på brevpanel og slette med alerten for at det er for smalt
  // Hente ut visible panels og iterere over dem
  // Mangler lukkeknapp på sidepanel
  // Sjekke ut typescript satifies
  // slutte med .provider

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', height: `calc(100vh - ${headerHøyde})` }}>
      <HStack width="100%" wrap={false}>
        <Personlinje loading={personInfoLoading} person={personInfo} skjulTelefonnummer />
        <SakKontrollPanel />
      </HStack>
      <Box
        style={{
          minHeight: 0,
          height: '100%',
          minWidth: `${totalVisibleMinWidth}px`,
          overflowX: 'auto',
          marginTop: 'var(--ax-space-4)',
          marginInline: '0 var(--ax-space-12)',
        }}
      >
        <Group orientation="horizontal" defaultLayout={defaultLayout} onLayoutChange={onLayoutChanged}>
          {bahandlingsPanel.visible && (
            <>
              <Panel
                id="behandlingspanel"
                defaultSize={bahandlingsPanel.defaultSize}
                minSize={`${bahandlingsPanel.minWidth}${bahandlingsPanel.minWidthUnit}`}
              >
                {sak && behovsmelding ? (
                  <BehandlingPanel sak={sak.data} behovsmelding={behovsmelding} />
                ) : (
                  <Feilmelding>Fant ikke sak eller behovsmelding</Feilmelding>
                )}
              </Panel>
            </>
          )}
          {brevPanel.visible && (
            <>
              {harFlerePanelerÅpne && <ResizeHandle />}
              <Panel
                id="brevpanel"
                defaultSize={brevPanel.defaultSize}
                minSize={`${brevPanel.minWidth}${brevPanel.minWidthUnit}`}
              >
                <BrevPanel />
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
                {!sak || !behovsmelding ? (
                  'Fant ikke sak'
                ) : (
                  <BehovsmeldingsPanel sak={sak.data} behovsmelding={behovsmelding} />
                )}
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
                <Sidebar />
              </Panel>
            </>
          )}
        </Group>
      </Box>
      <StickyBunnlinje sak={sak.data} onClick={() => modalVelger()} />
      <ResultatManglerModal open={visResultatManglerModal} onClose={() => setVisResultatManglerModal(false)} />
      <BrevManglerModal
        open={visBrevMangler}
        onClose={() => setVisBrevMangler(false)}
        gjenstående={gjenstående}
        vedtaksResultat={vedtaksResultat}
      />
      <NotatIUtkastModal open={visNotatIkkeFerdigstilt} onClose={() => setVisNotatIkkeFerdigstilt(false)} />
      {vedtaksResultat && (
        <FattVedtakModalV2
          open={visFerdigstillModal}
          onClose={() => setVisFerdigstillModal(false)}
          sak={sak.data}
          vedtaksResultat={vedtaksResultat}
        />
      )}
    </Box>
  )

  function modalVelger() {
    if (!gjeldendeBehandling || !vedtaksResultat) {
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
