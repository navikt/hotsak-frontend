import { Box, VStack } from '@navikt/ds-react'

import { OppgaveTildelt } from '../../oppgave/oppgaveTypes.ts'
import { MineOppgaverTable } from './MineOppgaverTable.tsx'
import { OppgaveFilter } from './OppgaveFilter.tsx'
import { useClientSideOppgaver } from './useClientSideOppgaver.ts'

export function MineOppgaver() {
  const { oppgaver, isLoading, uniqueOppgaveValues } = useClientSideOppgaver(OppgaveTildelt.MEG)

  return (
    <Box margin="5">
      <VStack gap="5">
        <OppgaveFilter {...uniqueOppgaveValues} onSøk={() => {}} />
        <MineOppgaverTable oppgaver={oppgaver} loading={isLoading} />
      </VStack>
    </Box>
  )
}
