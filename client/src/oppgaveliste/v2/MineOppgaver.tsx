import { Box } from '@navikt/ds-react'
import { useMemo } from 'react'

import { useJournalføringsoppgaver } from '../../journalføringsoppgaver/useJournalføringsoppgaver.ts'
import { OppgaveTildeltFilter, OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'
import { compareBy, notEmpty, uniqueBy } from '../../utils/array.ts'
import { OppgaveFilter } from './OppgaveFilter.tsx'
import { useOppgaveFilterContext } from './OppgaveFilterContext.tsx'
import { OppgaveTable } from './OppgaveTable.tsx'
import { useMineOppgaver } from './useMineOppgaver.ts'

export function MineOppgaver() {
  const { oppgavetypeFilter, gjelderFilter, oppgaveprioritetFilter, sort } = useOppgaveFilterContext()
  const { oppgaver: eksterneOppgaver } = useMineOppgaver()
  const journalføringsoppgaver =
    useJournalføringsoppgaver(OppgaveTildeltFilter.MEG)?.data?.oppgaver ?? ingenJournalføringsoppgaver
  const alleOppgaver = useMemo(
    () => eksterneOppgaver.concat(journalføringsoppgaver),
    [eksterneOppgaver, journalføringsoppgaver]
  )
  const filtrerteOppgaver = useMemo(() => {
    return alleOppgaver
      .filter(oneOf(oppgavetypeFilter, 'oppgavetype'))
      .filter(oneOf(gjelderFilter, 'gjelder'))
      .filter(oneOf(oppgaveprioritetFilter, 'prioritet'))
      .toSorted(compareBy(sort.orderBy as any, sort.direction)) // fixme
  }, [alleOppgaver, oppgavetypeFilter, gjelderFilter, oppgaveprioritetFilter, sort])

  const oppgavetyper = useMemo(() => uniqueBy(alleOppgaver, 'oppgavetype'), [alleOppgaver])
  const gjelder = useMemo(() => uniqueBy(alleOppgaver, 'gjelder').filter(notEmpty), [alleOppgaver])
  const oppgaveprioritet = useMemo(() => uniqueBy(alleOppgaver, 'prioritet'), [alleOppgaver])

  return (
    <>
      <Box margin="5">
        <OppgaveFilter
          oppgavetyper={oppgavetyper}
          gjelder={gjelder}
          oppgaveprioritet={oppgaveprioritet}
          onSøk={() => {}}
        />
        <OppgaveTable oppgaver={filtrerteOppgaver} mine />
      </Box>
    </>
  )
}

function oneOf<T, K extends keyof T>(filterValues: T[K][], accessor: K): (value: T) => boolean {
  return (it) => !filterValues.length || filterValues.includes(it[accessor])
}

const ingenJournalføringsoppgaver: OppgaveV2[] = []
