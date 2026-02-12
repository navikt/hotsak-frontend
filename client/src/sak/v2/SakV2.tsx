import { Box, HStack } from '@navikt/ds-react'
import { useState } from 'react'
import { Panel, PanelGroup } from 'react-resizable-panels'
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
import { FattVedtakModal } from './modaler/FattVedtakModal.tsx'
import { NotatIUtkastModal } from './modaler/NotatIUtkastModal.tsx'
import { ResultatManglerModal } from './modaler/ResultatManglerModal.tsx'
import { SakKontrollPanel } from './SakKontrollPanel.tsx'
import { useSakContext } from './SakProvider.tsx'
import { VenstreSidebar } from './sidebars/venstre/VenstreSidebar.tsx'
import { StickyBunnlinje } from './StickyBunnlinje.tsx'

export function SakV2() {
  const { sak } = useSak()
  const { behovsmelding } = useBehovsmelding()
  const [visFerdigstillModal, setVisFerdigstillModal] = useState(false)
  const { personInfo, isLoading: personInfoLoading } = usePerson(sak?.data.bruker.fnr)
  const [visResultatManglerModal, setVisResultatManglerModal] = useState(false)
  const [visBrevMangler, setVisBrevMangler] = useState(false)
  const [visNotatIkkeFerdigstilt, setVisNotatIkkeFerdigstilt] = useState(false)

  const { sidePanel, søknadPanel, brevKolonne, behandlingPanel } = useSakContext()

  const { gjeldendeBehandling } = useBehandling()
  const vedtaksResultat = gjeldendeBehandling?.utfall?.utfall as VedtaksResultat | undefined

  const gjenstående = gjeldendeBehandling?.gjenstående || []

  const notaterIkkeFerdigstilt = gjenstående.includes(Gjenstående.NOTAT_IKKE_FERDIGSTILT)
  const brevutkastIkkeFerdigstilt =
    gjenstående.includes(Gjenstående.BREV_IKKE_FERDIGSTILT) || gjenstående.includes(Gjenstående.BREV_MANGLER)

  if (!behovsmelding) {
    // TODO skeleton eller loader her?
    return <div>Fant ikke behovsmelding</div>
  }

  if (!sak) {
    // TODO skeleton eller loader her?
    return <div>Fant ikke sak</div>
  }

  return (
    <>
      <HStack width="100%" wrap={false}>
        <Personlinje loading={personInfoLoading} person={personInfo} skjulTelefonnummer />
        <SakKontrollPanel />
      </HStack>
      <Box.New
        style={{
          minHeight: 0,
          height: '100%',
          marginTop: 'var(--ax-space-4)',
          marginInline: '0 var(--ax-space-12)',
        }}
      >
        <PanelGroup direction="horizontal" autoSaveId="eksperimentellSaksbehandling">
          {sidePanel && (
            <>
              <Panel defaultSize={20} minSize={11} order={1}>
                <VenstreSidebar />
              </Panel>
              {(brevKolonne || søknadPanel || behandlingPanel) && <ResizeHandle />}
            </>
          )}
          {søknadPanel && (
            <>
              <Panel defaultSize={35} minSize={20} order={2}>
                {!sak || !behovsmelding ? (
                  'Fant ikke sak'
                ) : (
                  <BehovsmeldingsPanel sak={sak.data} behovsmelding={behovsmelding} />
                )}
              </Panel>
              {(brevKolonne || behandlingPanel || sidePanel) && <ResizeHandle />}
            </>
          )}
          {behandlingPanel && (
            <>
              <Panel defaultSize={25} minSize={10} order={3}>
                {sak && behovsmelding ? (
                  <BehandlingPanel sak={sak.data} behovsmelding={behovsmelding} />
                ) : (
                  <Feilmelding>Fant ikke sak eller behovsmelding</Feilmelding>
                )}
              </Panel>
              {brevKolonne && <ResizeHandle />}
            </>
          )}
          {brevKolonne && (
            <>
              <Panel defaultSize={40} minSize={10} order={4}>
                <BrevPanel />
              </Panel>
            </>
          )}
        </PanelGroup>
      </Box.New>
      <StickyBunnlinje sak={sak.data} onClick={() => modalVelger()} />
      <ResultatManglerModal open={visResultatManglerModal} onClose={() => setVisResultatManglerModal(false)} />
      <BrevManglerModal
        open={visBrevMangler}
        onClose={() => setVisBrevMangler(false)}
        gjenstående={gjenstående}
        vedtaksResultat={vedtaksResultat}
      />
      <NotatIUtkastModal open={visNotatIkkeFerdigstilt} onClose={() => setVisNotatIkkeFerdigstilt(false)} />
      <FattVedtakModal
        open={visFerdigstillModal}
        onClose={() => setVisFerdigstillModal(false)}
        sak={sak.data}
        vedtaksResultat={vedtaksResultat}
      />
    </>
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
