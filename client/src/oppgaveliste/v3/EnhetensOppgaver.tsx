import { Box } from '@navikt/ds-react'

import { useOppgavelisteV2 } from '../v2/useOppgavelisteV2.ts'
import { OppgaveFilter } from './OppgaveFilter.tsx'
import { OppgaveTable } from './OppgaveTable.tsx'

export function EnhetensOppgaver() {
  const { oppgaver } = useOppgavelisteV2(
    1,
    {
      orderBy: 'frist',
      direction: 'ascending',
    },
    {
      tildeltFilter: 'INGEN',
      gjelderFilter: [],
    }
  )
  return (
    <>
      <Box margin="5">
        <OppgaveFilter />
        <OppgaveTable oppgaver={oppgaver} />
      </Box>
    </>
  )
}
