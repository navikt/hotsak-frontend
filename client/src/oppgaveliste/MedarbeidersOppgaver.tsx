import { Box } from '@navikt/ds-react'

import { OppgaveTildelt, Statuskategori } from '../oppgave/oppgaveTypes.ts'
import { MedarbeidersOppgaverTable } from './MedarbeidersOppgaverTable.tsx'
import { OppgaveToolbar } from './OppgaveToolbar.tsx'
import { useClientSideOppgaver } from './useClientSideOppgaver.ts'

export function MedarbeidersOppgaver() {
  const { oppgaver, filterOptions, isLoading, ...rest } = useClientSideOppgaver({
    statuskategori: Statuskategori.ÅPEN,
    tildelt: OppgaveTildelt.MEDARBEIDER,
  })
  return (
    <Box marginInline="space-20">
      <OppgaveToolbar loading={isLoading} {...rest} />
      <MedarbeidersOppgaverTable oppgaver={oppgaver} filterOptions={filterOptions} loading={isLoading} />
    </Box>
  )
}
