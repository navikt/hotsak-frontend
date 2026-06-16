import { Box } from '@navikt/ds-react'
import { memo } from 'react'

import { PanelTittel } from '../../../felleskomponenter/panel/PanelTittel.tsx'
import { ScrollablePanel } from '../../../felleskomponenter/ScrollablePanel.tsx'
import { type Saksbehandlingsoppgave } from '../../../oppgave/oppgaveTypes.ts'
import { useOppgaveregler } from '../../../oppgave/useOppgaveregler.ts'
import { type Innsenderbehovsmelding } from '../../../types/BehovsmeldingTypes.ts'
import { type Sak } from '../../../types/types.internal.ts'
import { useClosePanel } from '../paneler/usePanelHooks.ts'
import { BehandlingFerdigstilt } from './BehandlingFerdigstilt.tsx'
import { BehandlingLesevisning } from './BehandlingLesevisning.tsx'
import classes from './BehandlingPanel.module.css'
import { BehandlingPanelHeader } from './BehandlingPanelHeader.tsx'
import { BehandlingRedigering } from './BehandlingRedigering.tsx'
import { isBehandlingFerdigstilt } from './behandlingTyper.ts'
import { useBehandling } from './useBehandling.ts'

export interface BehandlingPanelProps {
  oppgave?: Saksbehandlingsoppgave
  sak: Sak
  behovsmelding: Innsenderbehovsmelding
}

function BehandlingPanel({ oppgave, sak }: BehandlingPanelProps) {
  const lukkBehandlingsPanel = useClosePanel('behandlingspanel')
  const { oppgaveErUnderBehandlingAvInnloggetAnsatt } = useOppgaveregler(oppgave)
  const { gjeldendeBehandling } = useBehandling()

  return (
    <Box background="default" paddingInline="space-8" paddingBlock="space-0 space-36" className={classes.container}>
      <PanelTittel
        paddingInline="space-8 space-0"
        tittel="Behandle sak"
        lukkPanel={() => {
          lukkBehandlingsPanel()
        }}
      />
      <ScrollablePanel>
        <BehandlingPanelHeader oppgave={oppgave} sak={sak} />
        <BehandlingPanelContentVelger
          oppgave={oppgave}
          behandling={gjeldendeBehandling}
          erUnderBehandling={oppgaveErUnderBehandlingAvInnloggetAnsatt}
        />
      </ScrollablePanel>
    </Box>
  )
}

function BehandlingPanelContentVelger({
  oppgave,
  behandling,
  erUnderBehandling,
}: {
  oppgave?: Saksbehandlingsoppgave
  behandling?: ReturnType<typeof useBehandling>['gjeldendeBehandling']
  erUnderBehandling: boolean
}) {
  if (isBehandlingFerdigstilt(behandling)) {
    return <BehandlingFerdigstilt behandling={behandling} />
  }

  if (!erUnderBehandling) {
    return <BehandlingLesevisning behandling={behandling} />
  }

  return <BehandlingRedigering oppgave={oppgave} behandling={behandling} />
}

export default memo(BehandlingPanel)
