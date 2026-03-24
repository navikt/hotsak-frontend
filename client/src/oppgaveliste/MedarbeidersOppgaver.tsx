import { Box } from '@navikt/ds-react'

import { OppgaveTildelt, Statuskategori } from '../oppgave/oppgaveTypes.ts'
import { MedarbeidersOppgaverTable } from './MedarbeidersOppgaverTable.tsx'
import { OppgaveToolbar } from './OppgaveToolbar.tsx'
import { useClientSideOppgaver } from './useClientSideOppgaver.ts'

export function MedarbeidersOppgaver() {
  const { oppgaver, isLoading, totalElements, filterOptions, antallHastesaker } = useClientSideOppgaver({
    statuskategori: Statuskategori.ÅPEN,
    tildelt: OppgaveTildelt.MEDARBEIDER,
  })
  return (
    <Box marginInline="space-20">
      <OppgaveToolbar
        text={`${oppgaver.length} av ${totalElements} oppgaver`}
        antallHastesaker={antallHastesaker}
        loading={isLoading}
      />
      <MedarbeidersOppgaverTable oppgaver={oppgaver} filterOptions={filterOptions} loading={isLoading} />
    </Box>
  )
}
