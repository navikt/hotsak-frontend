import { useMemo } from 'react'

import { type HttpError } from '../../io/HttpError.ts'
import { useJournalføringsoppgaver } from '../../journalføringsoppgaver/useJournalføringsoppgaver.ts'
import { OppgaveTildelt, type OppgaveV2, Statuskategori } from '../../oppgave/oppgaveTypes.ts'
import { useOppgaver } from '../../oppgave/useOppgaver.ts'
import { compareBy } from '../../utils/array.ts'
import { useOppgavePaginationContext } from './OppgavePaginationContext.tsx'
import { useDataGridFilterContext } from '../../felleskomponenter/data/DataGridFilterContext.ts'
import { type DataGridFilterValues, emptyDataGridFilterValues } from '../../felleskomponenter/data/DataGridFilter.ts'
import { type OppgaveFilterOptions, useOppgaveFilterOptions } from './useOppgaveFilterOptions.ts'
import { type OppgaveColumnField } from './oppgaveColumns.tsx'
import {
  selectBehandlingstemaTerm,
  selectBehandlingstypeTerm,
  selectBrukerKommuneNavn,
  selectMappenavn,
  selectOppgavetype,
  selectPrioritet,
  selectTildeltSaksbehandlerNavn,
} from './oppgaveSelectors.ts'

const pageNumber = 1
const pageSize = 1_000
const ingenOppgaver: OppgaveV2[] = []

export interface UseClientSideOppgaverResponse {
  oppgaver: OppgaveV2[]
  totalElements: number
  error?: HttpError
  isLoading: boolean
  isValidating: boolean
  filterOptions: OppgaveFilterOptions
}

export function useClientSideOppgaver(tildelt: OppgaveTildelt): UseClientSideOppgaverResponse {
  const { sort } = useOppgavePaginationContext()

  const state = useDataGridFilterContext<OppgaveColumnField>()
  const {
    saksbehandlerFilter,
    oppgavetypeFilter,
    behandlingstemaFilter,
    behandlingstypeFilter,
    mappeFilter,
    prioritetFilter,
    kommuneFilter,
  } = useMemo(() => {
    return {
      saksbehandlerFilter: state['saksbehandler'] ?? emptyDataGridFilterValues,
      oppgavetypeFilter: state['oppgavetype'] ?? emptyDataGridFilterValues,
      behandlingstemaFilter: state['behandlingstema'] ?? emptyDataGridFilterValues,
      behandlingstypeFilter: state['behandlingstype'] ?? emptyDataGridFilterValues,
      mappeFilter: state['mappenavn'] ?? emptyDataGridFilterValues,
      prioritetFilter: state['prioritet'] ?? emptyDataGridFilterValues,
      kommuneFilter: state['kommune'] ?? emptyDataGridFilterValues,
    }
  }, [state])

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

  const filterOptions = useOppgaveFilterOptions(alleOppgaver)

  const filtrerteOppgaver = useMemo(() => {
    return alleOppgaver
      .filter(oneOf(saksbehandlerFilter, selectTildeltSaksbehandlerNavn))
      .filter(oneOf(oppgavetypeFilter, selectOppgavetype))
      .filter(oneOf(behandlingstemaFilter, selectBehandlingstemaTerm))
      .filter(oneOf(behandlingstypeFilter, selectBehandlingstypeTerm))
      .filter(oneOf(mappeFilter, selectMappenavn))
      .filter(oneOf(prioritetFilter, selectPrioritet))
      .filter(oneOf(kommuneFilter, selectBrukerKommuneNavn))
      .toSorted(sort.orderBy === 'fnr' ? compareBy(sort.orderBy, sort.direction) : undefined)
  }, [
    alleOppgaver,
    saksbehandlerFilter,
    oppgavetypeFilter,
    behandlingstemaFilter,
    behandlingstypeFilter,
    mappeFilter,
    prioritetFilter,
    kommuneFilter,
    sort,
  ])

  if (!eksterneOppgaver.data || !journalføringsoppgaver.data) {
    return {
      oppgaver: ingenOppgaver,
      totalElements: 0,
      error: eksterneOppgaver.error ?? journalføringsoppgaver.error,
      isLoading: eksterneOppgaver.isLoading || journalføringsoppgaver.isLoading,
      isValidating: eksterneOppgaver.isValidating || journalføringsoppgaver.isValidating,
      filterOptions,
    }
  }

  return {
    oppgaver: filtrerteOppgaver,
    totalElements: eksterneOppgaver.data.totalElements + journalføringsoppgaver.data.totalElements,
    error: eksterneOppgaver.error ?? journalføringsoppgaver.error,
    isLoading: eksterneOppgaver.isLoading || journalføringsoppgaver.isLoading,
    isValidating: eksterneOppgaver.isValidating || journalføringsoppgaver.isValidating,
    filterOptions,
  }
}

function oneOf<T, R extends string>(filter: DataGridFilterValues<R>, selector: (item: T) => R): (value: T) => boolean {
  if (filter.values.size === 0) return noFilter
  return (value) => filter.values.has(selector(value))
}

function noFilter(): true {
  return true
}
