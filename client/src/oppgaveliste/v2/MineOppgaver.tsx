import { Box, VStack } from '@navikt/ds-react'
import { useMemo } from 'react'

import { useJournalføringsoppgaver } from '../../journalføringsoppgaver/useJournalføringsoppgaver.ts'
import { OppgaveTildeltFilter, OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'
import { compareBy } from '../../utils/array.ts'
import { MineOppgaverTable } from './MineOppgaverTable.tsx'
import { OppgaveFilter } from './OppgaveFilter.tsx'
import { type OppgaveFilter as OppgaveFilterType, useOppgaveFilterContext } from './OppgaveFilterContext.tsx'
import { useMineOppgaver } from './useMineOppgaver.ts'
import { useUniqueOppgaveValues } from './useUniqueOppgaveValues.ts'

export function MineOppgaver() {
  const {
    filters: {
      oppgavetypeFilter,
      behandlingstemaFilter,
      behandlingstypeFilter,
      mappeFilter,
      prioritetFilter,
      kommuneFilter,
    },
    sort,
  } = useOppgaveFilterContext()
  const { oppgaver: eksterneOppgaver, isLoading } = useMineOppgaver()
  const journalføringsoppgaver =
    useJournalføringsoppgaver(OppgaveTildeltFilter.MEG)?.data?.oppgaver ?? ingenJournalføringsoppgaver
  const alleOppgaver = useMemo(
    () => eksterneOppgaver.concat(journalføringsoppgaver),
    [eksterneOppgaver, journalføringsoppgaver]
  )
  const filtrerteOppgaver = useMemo(() => {
    return alleOppgaver
      .filter(oneOf(oppgavetypeFilter, (it) => it.kategorisering.oppgavetype))
      .filter(oneOf(behandlingstemaFilter, (it) => it.kategorisering.behandlingstema?.term ?? 'Ingen'))
      .filter(oneOf(behandlingstypeFilter, (it) => it.kategorisering.behandlingstype?.term ?? 'Ingen'))
      .filter(oneOf(mappeFilter, (it) => it.mappenavn ?? 'Ingen'))
      .filter(oneOf(prioritetFilter, 'prioritet'))
      .filter(oneOf(kommuneFilter, (it) => it.bruker?.kommune?.navn ?? 'Ingen'))
      .toSorted(compareBy(sort.orderBy as any, sort.direction)) // fixme
  }, [
    alleOppgaver,
    oppgavetypeFilter,
    behandlingstemaFilter,
    behandlingstypeFilter,
    mappeFilter,
    prioritetFilter,
    kommuneFilter,
    sort,
  ])

  const uniqueOppgaveValues = useUniqueOppgaveValues(alleOppgaver)

  return (
    <Box margin="5">
      <VStack gap="5">
        <OppgaveFilter {...uniqueOppgaveValues} onSøk={() => {}} />
        <MineOppgaverTable oppgaver={filtrerteOppgaver} loading={isLoading} />
      </VStack>
    </Box>
  )
}

function oneOf<T, K extends keyof T>(filter: OppgaveFilterType<T[K]>, accessor: K): (value: T) => boolean
function oneOf<T, R>(filter: OppgaveFilterType<R>, accessor: (element: T) => R): (value: T) => boolean
function oneOf<T, K extends keyof T, R>(
  filter: OppgaveFilterType<unknown>,
  accessor: K | ((value: T) => R)
): (value: T) => boolean {
  return (value) => {
    if (!filter.enabled || filter.values.length === 0) return true
    const filterValue = typeof accessor === 'function' ? accessor(value) : value[accessor]
    return filter.values.includes(filterValue)
  }
}

const ingenJournalføringsoppgaver: OppgaveV2[] = []
