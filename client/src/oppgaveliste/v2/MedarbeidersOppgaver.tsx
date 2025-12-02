import { Box, VStack } from '@navikt/ds-react'

import { OppgaveTildelt } from '../../oppgave/oppgaveTypes.ts'
import { MedarbeidersOppgaverTable } from './MedarbeidersOppgaverTable.tsx'
import { OppgaveFilter } from './OppgaveFilter.tsx'
import { useClientSideOppgaver } from './useClientSideOppgaver.ts'

export function MedarbeidersOppgaver() {
  const { oppgaver, isLoading, uniqueOppgaveValues } = useClientSideOppgaver(OppgaveTildelt.MEDARBEIDER)
  return (
    <Box margin="5">
      <VStack gap="5">
        <OppgaveFilter {...uniqueOppgaveValues} onSøk={() => {}} />
        <MedarbeidersOppgaverTable oppgaver={oppgaver} loading={isLoading} />
      </VStack>
    </Box>
  )
}
