import { useMemo } from 'react'

import { DataGridCollection } from '../felleskomponenter/data/DataGridCollection.ts'
import { useDataGridFilterContext } from '../felleskomponenter/data/DataGridFilterContext.ts'
import { type HttpError } from '../io/HttpError.ts'
import { type FinnOppgaverRequest, type OppgaveV2 } from '../oppgave/oppgaveTypes.ts'
import { useOpppgavesøk } from '../oppgave/useOppgavesøk.ts'
import { type OppgaveColumnField } from './oppgaveColumns.tsx'
import { useOppgavePaginationContext } from './OppgavePaginationContext.tsx'
import {
  selectBehandlingstemaTerm,
  selectBehandlingstypeTerm,
  selectBrukerKommuneNavn,
  selectInnsenderNavn,
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

export function useClientSideOppgaver(request: Partial<FinnOppgaverRequest> = {}): UseClientSideOppgaverResponse {
  const { sort } = useOppgavePaginationContext()
  const { tildelt, ...rest } = request

  const response = useOpppgavesøk({
    tildelt,
    sorteringsfelt: sort.orderBy === 'opprettetTidspunkt' ? 'OPPRETTET_TIDSPUNKT' : 'FRIST',
    sorteringsrekkefølge: sort.direction === 'descending' ? 'DESC' : 'ASC',
    pageNumber,
    pageSize,
    ...rest,
  })
  const alleOppgaver = response.data?.oppgaver ?? ingenOppgaver

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
      .filterBy(selectInnsenderNavn, filterState.innsenderNavn)
      .filterBy(selectBrukerKommuneNavn, filterState.kommune)
      .toSorted(comparator)
      .toArray()
  }, [alleOppgaver, filterState, comparator])

  const filterOptions = useOppgaveFilterOptions(alleOppgaver)
  return {
    oppgaver: filtrerteOppgaver,
    totalElements: response.data ? response.data.totalElements : 0,
    error: response.error,
    isLoading: response.isLoading,
    isValidating: response.isValidating,
    filterOptions,
  }
}
