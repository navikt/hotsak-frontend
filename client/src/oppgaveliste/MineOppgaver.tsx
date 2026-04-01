import { Box } from '@navikt/ds-react'
import { useMemo } from 'react'

import { Oppgavestatus, OppgaveTildelt, Statuskategori } from '../oppgave/oppgaveTypes.ts'
import { intervalString } from '../utils/dato.ts'
import { MineOppgaverTable } from './MineOppgaverTable.tsx'
import { OppgaveToolbar } from './OppgaveToolbar.tsx'
import { useClientSideOppgaver } from './useClientSideOppgaver.ts'
import { ChipsToggle } from '@navikt/ds-react/Chips'
import { emptyDataGridFilterValues } from '../felleskomponenter/data/DataGridFilter.ts'
import {
  useDataGridFilterContext,
  useDataGridFilterDispatch,
  useIsDataGridOnlyFilteredBy,
} from '../felleskomponenter/data/DataGridFilterContext.ts'
import { OppgaveColumnFilter } from './oppgaveColumns.tsx'

const ANTALL_DAGER_FERDIGSTILTE = 10

export function MineOppgaver() {
  const { oppgavestatus = emptyDataGridFilterValues } = useDataGridFilterContext<'oppgavestatus'>()
  const ferdigstilte = oppgavestatus.values.has(Oppgavestatus.FERDIGSTILT)
  const iDag = useMemo(() => new Date(), [])
  const { oppgaver, filterOptions, isLoading, ...rest } = useClientSideOppgaver({
    statuskategori: ferdigstilte ? Statuskategori.AVSLUTTET : Statuskategori.ÅPEN,
    tildelt: OppgaveTildelt.MEG,
    ferdigstiltIntervall: ferdigstilte ? intervalString({ days: ANTALL_DAGER_FERDIGSTILTE }, iDag) : undefined,
  })
  return (
    <Box marginInline="space-20">
      <OppgaveToolbar loading={isLoading} {...rest}>
        <FerdigstiltToggle />
      </OppgaveToolbar>
      <MineOppgaverTable oppgaver={oppgaver} filterOptions={filterOptions} loading={isLoading} />
    </Box>
  )
}

function FerdigstiltToggle() {
  const dispatch = useDataGridFilterDispatch<OppgaveColumnFilter>()
  const selected = useIsDataGridOnlyFilteredBy<OppgaveColumnFilter>('oppgavestatus', ferdigstiltValues)
  return (
    <ChipsToggle
      title={`Vis oppgaver som er ferdigstilt siste ${ANTALL_DAGER_FERDIGSTILTE} dager`}
      selected={selected}
      onClick={() => {
        const values = selected ? emptyDataGridFilterValues.values : ferdigstiltValues
        dispatch({
          type: 'setFieldValues',
          field: 'oppgavestatus',
          values,
          resetOthers: true,
        })
      }}
    >
      Ferdigstilte
    </ChipsToggle>
  )
}

const ferdigstiltValues = new Set([Oppgavestatus.FERDIGSTILT])
