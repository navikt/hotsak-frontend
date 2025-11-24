import { Box, VStack } from '@navikt/ds-react'
import { useMemo } from 'react'

import { useJournalføringsoppgaver } from '../../journalføringsoppgaver/useJournalføringsoppgaver.ts'
import { OppgaveTildeltFilter, OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'
import { compareBy, notEmpty, uniqueBy } from '../../utils/array.ts'
import { MineOppgaverTable } from './MineOppgaverTable.tsx'
import { OppgaveFilter } from './OppgaveFilter.tsx'
import { useOppgaveFilterContext } from './OppgaveFilterContext.tsx'
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
      .filter(oneOf(oppgavetypeFilter, (it) => it.kategorisering.oppgavetype))
      .filter(oneOf(gjelderFilter, (it) => it.kategorisering.behandlingstema?.term ?? 'Ingen'))
      .filter(oneOf(oppgaveprioritetFilter, 'prioritet'))
      .toSorted(compareBy(sort.orderBy as any, sort.direction)) // fixme
  }, [alleOppgaver, oppgavetypeFilter, gjelderFilter, oppgaveprioritetFilter, sort])

  const oppgavetyper = useMemo(
    () =>
      uniqueBy(
        alleOppgaver.map((it) => it.kategorisering),
        'oppgavetype'
      ),
    [alleOppgaver]
  )
  const gjelder = useMemo(
    () =>
      uniqueBy(
        alleOppgaver.map((it) => it.kategorisering.behandlingstema ?? { kode: '', term: 'Ingen' }),
        'term'
      ).filter(notEmpty),
    [alleOppgaver]
  )
  const oppgaveprioritet = useMemo(() => uniqueBy(alleOppgaver, 'prioritet'), [alleOppgaver])

  return (
    <Box margin="5">
      <VStack gap="5">
        <OppgaveFilter
          oppgavetyper={oppgavetyper}
          gjelder={gjelder}
          oppgaveprioritet={oppgaveprioritet}
          onSøk={() => {}}
        />
        <MineOppgaverTable oppgaver={filtrerteOppgaver} />
      </VStack>
    </Box>
  )
}

function oneOf<T, K extends keyof T>(filterValues: T[K][], accessor: K): (value: T) => boolean
function oneOf<T, R>(filterValues: R[], accessor: (element: T) => R): (value: T) => boolean
function oneOf<T, K extends keyof T, R>(filterValues: any, accessor: K | ((value: T) => R)): (value: T) => boolean {
  return (value) => {
    if (!filterValues.length) return true
    const filterValue = typeof accessor === 'function' ? accessor(value) : value[accessor]
    return !filterValues.length || filterValues.includes(filterValue)
  }
}

const ingenJournalføringsoppgaver: OppgaveV2[] = []
