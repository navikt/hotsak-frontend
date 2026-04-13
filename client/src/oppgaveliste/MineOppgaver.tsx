import { Box } from '@navikt/ds-react'
import { useMemo } from 'react'

import { OppgaveTildelt, Statuskategori } from '../oppgave/oppgaveTypes.ts'
import { intervalString } from '../utils/dato.ts'
import { MineOppgaverTable } from './MineOppgaverTable.tsx'
import { OppgaveToolbarTab, useOppgavelisteContext } from './OppgavelisteContext.tsx'
import { OppgaveToolbar, type OppgaveToolbarProps } from './OppgaveToolbar.tsx'
import { useClientSideOppgaver } from './useClientSideOppgaver.ts'

const ANTALL_DAGER_FERDIGSTILTE = 10

export function MineOppgaver() {
  const { currentTab } = useOppgavelisteContext()
  const ferdigstilte = currentTab === OppgaveToolbarTab.FERDIGSTILTE
  const iDag = useMemo(() => new Date(), [])
  const åpneOppgaver = useClientSideOppgaver({
    statuskategori: Statuskategori.ÅPEN,
    tildelt: OppgaveTildelt.MEG,
  })
  const ferdigstilteOppgaver = useClientSideOppgaver({
    statuskategori: Statuskategori.AVSLUTTET,
    tildelt: OppgaveTildelt.MEG,
    ferdigstiltIntervall: intervalString({ days: ANTALL_DAGER_FERDIGSTILTE }, iDag),
  })
  const { oppgaver, filterOptions, isLoading } = ferdigstilte ? ferdigstilteOppgaver : åpneOppgaver
  const toolbarProps: OppgaveToolbarProps = {
    antallOppgaver: åpneOppgaver.antallOppgaver,
    antallHastesaker: åpneOppgaver.antallHastesaker,
    antallPåVent: åpneOppgaver.antallPåVent,
    antallFerdigstilte: ferdigstilteOppgaver.antallOppgaver,
    ferdigstilte: true,
    loading: åpneOppgaver.isLoading || ferdigstilteOppgaver.isLoading,
  }
  return (
    <Box marginInline="space-20">
      <OppgaveToolbar {...toolbarProps} />
      <MineOppgaverTable oppgaver={oppgaver} filterOptions={filterOptions} loading={isLoading} />
    </Box>
  )
}
