import { useMemo } from 'react'

import { DataGridCollection } from '../../felleskomponenter/data/DataGridCollection.ts'
import { useDataGridFilterContext } from '../../felleskomponenter/data/DataGridFilterContext.ts'
import { type HttpError } from '../../io/HttpError.ts'
import { useJournalføringsoppgaver } from '../../journalføringsoppgaver/useJournalføringsoppgaver.ts'
import { OppgaveTildelt, type OppgaveV2, Statuskategori } from '../../oppgave/oppgaveTypes.ts'
import { useOppgaver } from '../../oppgave/useOppgaver.ts'
import { type OppgaveColumnField } from './oppgaveColumns.tsx'
import { useOppgavePaginationContext } from './OppgavePaginationContext.tsx'
import {
  selectBehandlingstemaTerm,
  selectBehandlingstypeTerm,
  selectBrukerKommuneNavn,
  selectMappenavn,
  selectOppgavetype,
  selectPrioritet,
  selectTildeltSaksbehandlerNavn,
} from './oppgaveSelectors.ts'
import { useOppgaveComparator } from './useOppgaveComparator.ts'
import { type OppgaveFilterOptions, useOppgaveFilterOptions } from './useOppgaveFilterOptions.ts'

const pageNumber = 1
const pageSize = 1_000
const ingenOppgaver: OppgaveV2[] = []

export interface UseClientSideOppgaverResponse {
  oppgaver: ReadonlyArray<OppgaveV2>
  totalElements: number
  error?: HttpError
  isLoading: boolean
  isValidating: boolean
  filterOptions: OppgaveFilterOptions
}

export function useClientSideOppgaver(tildelt: OppgaveTildelt): UseClientSideOppgaverResponse {
  const { sort } = useOppgavePaginationContext()
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

  const filterState = useDataGridFilterContext<OppgaveColumnField>()
  const comparator = useOppgaveComparator()
  const filtrerteOppgaver = useMemo(() => {
    return DataGridCollection.from(alleOppgaver)
      .filterBy(selectTildeltSaksbehandlerNavn, filterState.saksbehandler)
      .filterBy(selectOppgavetype, filterState.oppgavetype)
      .filterBy(selectBehandlingstemaTerm, filterState.behandlingstema)
      .filterBy(selectBehandlingstypeTerm, filterState.behandlingstype)
      .filterBy(selectMappenavn, filterState.mappenavn)
      .filterBy(selectPrioritet, filterState.prioritet)
      .filterBy(selectBrukerKommuneNavn, filterState.kommune)
      .toSorted(comparator)
      .toArray()
  }, [alleOppgaver, filterState, comparator])

  const filterOptions = useOppgaveFilterOptions(alleOppgaver)

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
