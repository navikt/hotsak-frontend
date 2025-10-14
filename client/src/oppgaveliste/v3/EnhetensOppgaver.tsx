import { Box } from '@navikt/ds-react'

import { OppgaveGjelderFilter, Oppgaveprioritet, Oppgavetype } from '../../oppgave/oppgaveTypes.ts'
import { useOppgavelisteV2 } from '../v2/useOppgavelisteV2.ts'
import { OppgaveFilter } from './OppgaveFilter.tsx'
import { useOppgaveFilterContext } from './OppgaveFilterContext.tsx'
import { OppgaveTable } from './OppgaveTable.tsx'

export function EnhetensOppgaver() {
  const { currentPage, sort, oppgavetypeFilter, gjelderFilter } = useOppgaveFilterContext()
  const { oppgaver } = useOppgavelisteV2(currentPage, 100, sort, {
    tildeltFilter: 'INGEN',
    oppgavetypeFilter,
    gjelderFilter,
  })
  return (
    <>
      <Box margin="5">
        <OppgaveFilter oppgavetyper={oppgavetyper} gjelder={gjelder} oppgaveprioritet={oppgaveprioritet} />
        <OppgaveTable oppgaver={oppgaver} />
      </Box>
    </>
  )
}

const oppgavetyper = Object.values(Oppgavetype)
const gjelder = Object.values(OppgaveGjelderFilter)
const oppgaveprioritet = Object.values(Oppgaveprioritet)
