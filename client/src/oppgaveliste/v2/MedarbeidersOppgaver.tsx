import { Box } from '@navikt/ds-react'

import { OppgaveTildelt, Statuskategori } from '../../oppgave/oppgaveTypes.ts'
import { MedarbeidersOppgaverTable } from './MedarbeidersOppgaverTable.tsx'
import { OppgaveToolbar } from './OppgaveToolbar.tsx'
import { useClientSideOppgaver } from './useClientSideOppgaver.ts'
import { useOppgavemetrikker } from './useOppgavemetrikker.ts'

export function MedarbeidersOppgaver() {
  const { oppgaver, isLoading, totalElements, filterOptions } = useClientSideOppgaver({
    statuskategori: Statuskategori.ÅPEN,
    tildelt: OppgaveTildelt.MEDARBEIDER,
  })
  useOppgavemetrikker(oppgaver.length, totalElements)
  return (
    <Box.New marginInline="5">
      <OppgaveToolbar text={`${oppgaver.length} av ${totalElements} oppgaver`} />
      <MedarbeidersOppgaverTable oppgaver={oppgaver} filterOptions={filterOptions} loading={isLoading} />
    </Box.New>
  )
}
