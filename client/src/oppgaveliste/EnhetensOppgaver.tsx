import { Box } from '@navikt/ds-react'

import { OppgaveTildelt, Statuskategori } from '../oppgave/oppgaveTypes.ts'
import { EnhetensOppgaverTable } from './EnhetensOppgaverTable.tsx'
import { OppgaveToolbar } from './OppgaveToolbar.tsx'
import { useClientSideOppgaver } from './useClientSideOppgaver.ts'

export function EnhetensOppgaver() {
  const { oppgaver, filterOptions, isLoading, ...rest } = useClientSideOppgaver({
    statuskategori: Statuskategori.ÅPEN,
    tildelt: OppgaveTildelt.INGEN,
  })
  return (
    <Box marginInline="space-20">
      <OppgaveToolbar loading={isLoading} {...rest} />
      <EnhetensOppgaverTable oppgaver={oppgaver} filterOptions={filterOptions} loading={isLoading} />
    </Box>
  )
}
