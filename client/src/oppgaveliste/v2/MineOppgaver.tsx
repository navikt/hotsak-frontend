import { Box, VStack } from '@navikt/ds-react'
import { useMemo } from 'react'

import { useJournalføringsoppgaver } from '../../journalføringsoppgaver/useJournalføringsoppgaver.ts'
import { OppgaveTildeltFilter, OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'
import { compareBy, notEmpty, uniqueBy } from '../../utils/array.ts'
import { MineOppgaverTable } from './MineOppgaverTable.tsx'
import { OppgaveFilter } from './OppgaveFilter.tsx'
import { useOppgaveFilterContext, type OppgaveFilter as OppgaveFilterType } from './OppgaveFilterContext.tsx'
import { useMineOppgaver } from './useMineOppgaver.ts'

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

  const oppgavetyper = useMemo(
    () =>
      uniqueBy(
        alleOppgaver.map((it) => it.kategorisering),
        'oppgavetype'
      ),
    [alleOppgaver]
  )
  const behandlingstemaer = useMemo(
    () =>
      uniqueBy(
        alleOppgaver.map((it) => it.kategorisering.behandlingstema ?? { kode: '', term: 'Ingen' }),
        'term'
      ).filter(notEmpty),
    [alleOppgaver]
  )
  const behandlingstyper = useMemo(
    () =>
      uniqueBy(
        alleOppgaver.map((it) => it.kategorisering.behandlingstype ?? { kode: '', term: 'Ingen' }),
        'term'
      ).filter(notEmpty),
    [alleOppgaver]
  )
  const mapper = useMemo(
    () =>
      uniqueBy(
        alleOppgaver.map((it) => ({ mappenavn: it.mappenavn ?? 'Ingen' })),
        'mappenavn'
      ),
    [alleOppgaver]
  )
  const prioriteter = useMemo(() => uniqueBy(alleOppgaver, 'prioritet'), [alleOppgaver])
  const kommuner = useMemo(
    () =>
      uniqueBy(
        alleOppgaver.map((it) => ({ kommune: it.bruker?.kommune?.navn ?? 'Ingen' })),
        'kommune'
      ),
    [alleOppgaver]
  )

  return (
    <Box margin="5">
      <VStack gap="5">
        <OppgaveFilter
          oppgavetyper={oppgavetyper}
          behandlingstemaer={behandlingstemaer}
          behandlingstyper={behandlingstyper}
          mapper={mapper}
          prioriteter={prioriteter}
          kommuner={kommuner}
          onSøk={() => {}}
        />
        <MineOppgaverTable oppgaver={filtrerteOppgaver} />
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
    if (!(filter.enabled && filter.values.length)) return true
    const filterValue = typeof accessor === 'function' ? accessor(value) : value[accessor]
    return filter.values.includes(filterValue)
  }
}

const ingenJournalføringsoppgaver: OppgaveV2[] = []
