import { Box } from '@navikt/ds-react'
import { useMemo } from 'react'

import { OppgaveTildelt, Statuskategori } from '../oppgave/oppgaveTypes.ts'
import { intervalString } from '../utils/dato.ts'
import { MineOppgaverTable } from './MineOppgaverTable.tsx'
import { OppgaveToolbar } from './OppgaveToolbar.tsx'
import { useClientSideOppgaver } from './useClientSideOppgaver.ts'
import { ChipsToggle } from '@navikt/ds-react/Chips'
import { useToggle } from '../state/useToggle.ts'

const ANTALL_DAGER_FERDIGSTILTE = 10

export function MineOppgaver() {
  const [ferdigstilte, toggleFerdigstilte] = useToggle()
  const iDag = useMemo(() => new Date(), [])
  const { oppgaver, filterOptions, isLoading, ...rest } = useClientSideOppgaver({
    statuskategori: ferdigstilte ? Statuskategori.AVSLUTTET : Statuskategori.ÅPEN,
    tildelt: OppgaveTildelt.MEG,
    ferdigstiltIntervall: ferdigstilte ? intervalString({ days: ANTALL_DAGER_FERDIGSTILTE }, iDag) : undefined,
  })
  return (
    <Box marginInline="space-20">
      <OppgaveToolbar loading={isLoading} {...rest}>
        <ChipsToggle
          title={`Vis oppgaver som er ferdigstilt siste ${ANTALL_DAGER_FERDIGSTILTE} dager`}
          selected={ferdigstilte}
          onClick={toggleFerdigstilte}
        >
          Ferdigstilte
        </ChipsToggle>
      </OppgaveToolbar>
      <MineOppgaverTable oppgaver={oppgaver} filterOptions={filterOptions} loading={isLoading} />
    </Box>
  )
}
