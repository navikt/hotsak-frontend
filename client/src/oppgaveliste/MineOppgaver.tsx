import { Box, Switch } from '@navikt/ds-react'
import { useMemo, useState } from 'react'

import { OppgaveTildelt, Statuskategori } from '../oppgave/oppgaveTypes.ts'
import { intervalString } from '../utils/dato.ts'
import { MineOppgaverTable } from './MineOppgaverTable.tsx'
import { OppgaveToolbar } from './OppgaveToolbar.tsx'
import { useClientSideOppgaver } from './useClientSideOppgaver.ts'
import { useOppgavemetrikker } from './useOppgavemetrikker.ts'

const ANTALL_DAGER_FERDIGSTILTE = 10

export function MineOppgaver() {
  const [visFerdigstilte, setVisFerdigstilte] = useState(false)
  const iDag = useMemo(() => new Date(), [])
  const { oppgaver, isLoading, totalElements, filterOptions } = useClientSideOppgaver({
    statuskategori: visFerdigstilte ? Statuskategori.AVSLUTTET : Statuskategori.ÅPEN,
    tildelt: OppgaveTildelt.MEG,
    ferdigstiltIntervall: visFerdigstilte ? intervalString({ days: ANTALL_DAGER_FERDIGSTILTE }, iDag) : undefined,
  })
  useOppgavemetrikker('Mine', oppgaver.length, totalElements)
  return (
    <Box marginInline="space-20">
      <OppgaveToolbar text={`${oppgaver.length} av ${totalElements} oppgaver`}>
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
