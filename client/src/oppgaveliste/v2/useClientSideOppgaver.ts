import { useMemo } from 'react'

import type { HttpError } from '../../io/HttpError.ts'
import { useJournalføringsoppgaver } from '../../journalføringsoppgaver/useJournalføringsoppgaver.ts'
import { OppgaveTildelt, type OppgaveV2, Statuskategori } from '../../oppgave/oppgaveTypes.ts'
import { useOppgaver } from '../../oppgave/useOppgaver.ts'
import { compareBy } from '../../utils/array.ts'
import { select } from '../../utils/select.ts'
import { OppgaveFilter as OppgaveFilterType, useOppgaveFilterContext } from './OppgaveFilterContext.tsx'
import { type UniqueOppgaveValues, useUniqueOppgaveValues } from './useUniqueOppgaveValues.ts'

const pageNumber = 1
const pageSize = 1_000

export interface UseClientSideOppgaverResponse {
  oppgaver: OppgaveV2[]
  totalElements: number
  error?: HttpError
  isLoading: boolean
  isValidating: boolean
  uniqueOppgaveValues: UniqueOppgaveValues
}

export function useClientSideOppgaver(tildelt: OppgaveTildelt): UseClientSideOppgaverResponse {
  const {
    filters: {
      oppgavetypeFilter,
      behandlingstemaFilter,
      behandlingstypeFilter,
      mappeFilter,
      prioritetFilter,
      kommuneFilter,
      saksbehandlerFilter,
    },
    sort,
  } = useOppgaveFilterContext()

  const eksterneOppgaver = useOppgaver({
    tildelt,
    statuskategori: Statuskategori.ÅPEN,
    sorteringsfelt: sort.orderBy === 'opprettetTidspunkt' ? 'OPPRETTET_TIDSPUNKT' : 'FRIST',
    sorteringsrekkefølge: sort.direction === 'descending' ? 'DESC' : 'ASC',
    page: pageNumber,
    limit: pageSize,
  })

  const journalføringsoppgaver = useJournalføringsoppgaver(tildelt)

  const alleOppgaver = useMemo(() => {
    return (eksterneOppgaver.data?.oppgaver ?? []).concat(journalføringsoppgaver.data?.oppgaver ?? [])
  }, [eksterneOppgaver.data?.oppgaver, journalføringsoppgaver.data?.oppgaver])

  const filtrerteOppgaver = useMemo(() => {
    return alleOppgaver
      .filter(oneOf(oppgavetypeFilter, (it) => it.kategorisering.oppgavetype))
      .filter(oneOf(behandlingstemaFilter, (it) => it.kategorisering.behandlingstema?.term || 'Ingen'))
      .filter(oneOf(behandlingstypeFilter, (it) => it.kategorisering.behandlingstype?.term || 'Ingen'))
      .filter(oneOf(mappeFilter, (it) => it.mappenavn || 'Ingen'))
      .filter(oneOf(prioritetFilter, select('prioritet')))
      .filter(oneOf(kommuneFilter, (it) => it.bruker?.kommune?.navn || 'Ingen'))
      .filter(oneOf(saksbehandlerFilter, (it) => it.tildeltSaksbehandler?.navn || 'Ingen'))
      .toSorted(sort.orderBy === 'fnr' ? compareBy(sort.orderBy, sort.direction) : undefined)
  }, [
    alleOppgaver,
    oppgavetypeFilter,
    behandlingstemaFilter,
    behandlingstypeFilter,
    mappeFilter,
    prioritetFilter,
    kommuneFilter,
    saksbehandlerFilter,
    sort,
  ])

  const uniqueOppgaveValues = useUniqueOppgaveValues(alleOppgaver)

  if (!eksterneOppgaver.data || !journalføringsoppgaver.data) {
    return {
      oppgaver: ingenOppgaver,
      totalElements: 0,
      error: eksterneOppgaver.error ?? journalføringsoppgaver.error,
      isLoading: eksterneOppgaver.isLoading || journalføringsoppgaver.isLoading,
      isValidating: eksterneOppgaver.isValidating || journalføringsoppgaver.isValidating,
      uniqueOppgaveValues,
    }
  }

  return {
    oppgaver: filtrerteOppgaver,
    totalElements: eksterneOppgaver.data.totalElements + journalføringsoppgaver.data.totalElements,
    error: eksterneOppgaver.error ?? journalføringsoppgaver.error,
    isLoading: eksterneOppgaver.isLoading || journalføringsoppgaver.isLoading,
    isValidating: eksterneOppgaver.isValidating || journalføringsoppgaver.isValidating,
    uniqueOppgaveValues,
  }
}

function oneOf<T, R>(filter: OppgaveFilterType<R>, selector: (item: T) => R): (value: T) => boolean {
  return (value) => {
    if (filter.values.length === 0) return true
    return filter.values.includes(selector(value))
  }
}

const ingenOppgaver: OppgaveV2[] = []
