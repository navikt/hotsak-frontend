import { Alert, Box, Button, HStack } from '@navikt/ds-react'
import { Panel, PanelGroup } from 'react-resizable-panels'
import { Feilmelding } from '../../../../felleskomponenter/feil/Feilmelding'
import { usePerson } from '../../../../personoversikt/usePerson'
import { useBehovsmelding } from '../../../../saksbilde/useBehovsmelding'
import { useSak } from '../../../../saksbilde/useSak'
import { OppgaveStatusLabel } from '../../../../types/types.internal'
import { BrevPanelEksperiment } from '../brev/BrevPanelEksperiment'
import { PersonlinjeEksperiment } from '../felleskomponenter/personlinje/PersonlinjeEksperiment'
import { ResizeHandle } from '../felleskomponenter/ResizeHandle'
import BehandlingEksperimentPanel from './behandling/BehandlingEksperiment'
import { SakKontrollPanel } from './SakKontrollPanel'
import { useSaksbehandlingEksperimentContext } from './SaksbehandlingEksperimentProvider'
import { SidepanelEksperiment } from './sidepanel/SidepanelEksperiment'
import { SøknadPanelEksperiment } from './søknad/SøknadPanelEksperiment'

export function SaksbehandlingEksperiment() {
  const { sak } = useSak()
  const { behovsmelding } = useBehovsmelding()
  const { personInfo, isLoading: personInfoLoading } = usePerson(sak?.data.bruker.fnr)

  const { sidePanel, søknadPanel, brevKolonne, behandlingPanel } = useSaksbehandlingEksperimentContext()

  if (!sak || !behovsmelding) {
    // TODO skeleton eller loader her?
    return <div>Fant ikke sak eller behovsmelding</div>
  }

  return (
    <>
      <HStack width="100%" wrap={false}>
        <PersonlinjeEksperiment loading={personInfoLoading} person={personInfo} skjulTelefonnummer />
        <SakKontrollPanel />
      </HStack>
      <Box.New
        style={{
          minHeight: 0,
          marginTop: 'var(--ax-space-4)',
          marginInline: 'var(--ax-space-12)',
        }}
      >
        <PanelGroup direction="horizontal" autoSaveId="eksperimentellSaksbehandling">
          {søknadPanel && (
            <>
              <Panel defaultSize={35} minSize={20} order={1}>
                {!sak || !behovsmelding ? (
                  'Fant ikke sak'
                ) : (
                  <SøknadPanelEksperiment sak={sak.data} behovsmelding={behovsmelding} />
                )}
              </Panel>
              {(brevKolonne || behandlingPanel) && <ResizeHandle />}
            </>
          )}
          {behandlingPanel && (
            <>
              <Panel defaultSize={25} minSize={10} order={2}>
                {sak && behovsmelding ? (
                  <BehandlingEksperimentPanel sak={sak.data} behovsmelding={behovsmelding} />
                ) : (
                  <Feilmelding>Fant ikke sak eller behovsmelding</Feilmelding>
                )}
              </Panel>
              {sidePanel && <ResizeHandle />}
            </>
          )}
          {brevKolonne && (
            <>
              <Panel defaultSize={40} minSize={10} order={3}>
                <BrevPanelEksperiment />
              </Panel>
              <ResizeHandle />
            </>
          )}
          {sidePanel && (
            <>
              <Panel defaultSize={20} minSize={11} order={4}>
                <SidepanelEksperiment />
              </Panel>
            </>
          )}
        </PanelGroup>
      </Box.New>

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
          <HStack align="center" justify="space-between" gap="space-24">
            <Button type="button" variant="primary" size="small">
              Ferdigstill oppgave
            </Button>
            <Alert variant="info" size="small" inline>
              {OppgaveStatusLabel.get(sak.data.saksstatus)}
            </Alert>
          </HStack>
        </Box.New>
      </HStack>
    </>
  )
}
