import { Box } from '@navikt/ds-react'
import { memo } from 'react'

import { PanelTittel } from '../../../felleskomponenter/panel/PanelTittel.tsx'
import { ScrollablePanel } from '../../../felleskomponenter/ScrollablePanel.tsx'
import { useOppgave } from '../../../oppgave/useOppgave.ts'
import { useOppgaveregler } from '../../../oppgave/useOppgaveregler.ts'
import { type Innsenderbehovsmelding } from '../../../types/BehovsmeldingTypes.ts'
import { type Sak } from '../../../types/types.internal.ts'
import { useClosePanel } from '../paneler/usePanelHooks.ts'
import { BehandlingFerdigstilt } from './BehandlingFerdigstilt.tsx'
import { BehandlingLesevisning } from './BehandlingLesevisning.tsx'
import classes from './BehandlingPanel.module.css'
import { BehandlingRedigering } from './BehandlingRedigering.tsx'
import { isBehandlingFerdigstilt } from './behandlingTyper.ts'
import { useBehandling } from './useBehandling.ts'
import { BehandlingPanelHeader } from './BehandlingPanelHeader.tsx'

export interface BehandlingPanelProps {
  sak: Sak
  behovsmelding: Innsenderbehovsmelding
}

function BehandlingPanel({ sak }: BehandlingPanelProps) {
  const lukkBehandlingsPanel = useClosePanel('behandlingspanel')
  const { oppgave } = useOppgave()
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
        <BehandlingPanelHeader sak={sak} oppgave={oppgave} />
        <BehandlingPanelContentVelger
          behandling={gjeldendeBehandling}
          erUnderBehandling={oppgaveErUnderBehandlingAvInnloggetAnsatt}
        />
      </ScrollablePanel>
    </Box>
  )
}

function BehandlingPanelContentVelger({
  behandling,
  erUnderBehandling,
}: {
  behandling?: ReturnType<typeof useBehandling>['gjeldendeBehandling']
  erUnderBehandling: boolean
}) {
  if (isBehandlingFerdigstilt(behandling)) {
    return <BehandlingFerdigstilt behandling={behandling} />
  }

  if (!erUnderBehandling) {
    return <BehandlingLesevisning behandling={behandling} />
  }

  return <BehandlingRedigering behandling={behandling} />
}

export default memo(BehandlingPanel)
