import { Box, Switch } from '@navikt/ds-react'
import { useMemo, useState } from 'react'

import { OppgaveTildelt, Statuskategori } from '../oppgave/oppgaveTypes.ts'
import { intervalString } from '../utils/dato.ts'
import { MineOppgaverTable } from './MineOppgaverTable.tsx'
import { OppgaveToolbar } from './OppgaveToolbar.tsx'
import { useClientSideOppgaver } from './useClientSideOppgaver.ts'

const ANTALL_DAGER_FERDIGSTILTE = 10

export function MineOppgaver() {
  const [visFerdigstilte, setVisFerdigstilte] = useState(false)
  const iDag = useMemo(() => new Date(), [])
  const { oppgaver, isLoading, totalElements, filterOptions, antallHastesaker } = useClientSideOppgaver({
    statuskategori: visFerdigstilte ? Statuskategori.AVSLUTTET : Statuskategori.ÅPEN,
    tildelt: OppgaveTildelt.MEG,
    ferdigstiltIntervall: visFerdigstilte ? intervalString({ days: ANTALL_DAGER_FERDIGSTILTE }, iDag) : undefined,
  })
  return (
    <Box marginInline="space-20">
      <OppgaveToolbar
        text={`${oppgaver.length} av ${totalElements} oppgaver`}
        antallHastesaker={antallHastesaker}
        loading={isLoading}
      >
        <Switch
          checked={visFerdigstilte}
          onChange={(event) => {
            setVisFerdigstilte(event.target.checked)
          }}
          size="small"
        >
          {`Vis ferdigstilte siste ${ANTALL_DAGER_FERDIGSTILTE} dager`}
        </Switch>
      </OppgaveToolbar>
      <MineOppgaverTable oppgaver={oppgaver} filterOptions={filterOptions} loading={isLoading} />
    </Box>
  )
}
