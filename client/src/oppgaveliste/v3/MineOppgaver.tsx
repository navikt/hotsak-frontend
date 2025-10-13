import { Box } from '@navikt/ds-react'

import { useOppgavelisteV2 } from '../v2/useOppgavelisteV2'
import { OppgaveFilter } from './OppgaveFilter.tsx'
import { OppgaveTable } from './OppgaveTable.tsx'

export function MineOppgaver() {
  const { oppgaver } = useOppgavelisteV2(
    1,
    {
      orderBy: 'frist',
      direction: 'ascending',
    },
    {
      tildeltFilter: 'MEG',
      gjelderFilter: [],
    }
  )
  return (
    <>
      <Box margin="5">
        <OppgaveFilter søk />
        <OppgaveTable oppgaver={oppgaver} mine />
      </Box>
    </>
  )
}
