import { Box } from '@navikt/ds-react'

import { OppgaveTildelt, Statuskategori } from '../oppgave/oppgaveTypes.ts'
import { EnhetensOppgaverTable } from './EnhetensOppgaverTable.tsx'
import { OppgaveToolbar } from './OppgaveToolbar.tsx'
import { useClientSideOppgaver } from './useClientSideOppgaver.ts'
import { useOppgavemetrikker } from './useOppgavemetrikker.ts'

export function EnhetensOppgaver() {
  const { oppgaver, isLoading, totalElements, filterOptions, antallHastesaker } = useClientSideOppgaver({
    statuskategori: Statuskategori.ÅPEN,
    tildelt: OppgaveTildelt.INGEN,
  })
  useOppgavemetrikker('Enhetens', oppgaver.length, totalElements)
  return (
    <Box marginInline="space-20">
      <OppgaveToolbar text={`${oppgaver.length} av ${totalElements} oppgaver`} antallHastesaker={antallHastesaker} />
      <EnhetensOppgaverTable oppgaver={oppgaver} filterOptions={filterOptions} loading={isLoading} />
    </Box>
  )
}
