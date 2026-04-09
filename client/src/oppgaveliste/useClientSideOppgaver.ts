import { useMemo } from 'react'

import { DataGridCollection } from '../felleskomponenter/data/DataGridCollection.ts'
import { type DataGridFilterValues } from '../felleskomponenter/data/DataGridFilter.ts'
import { useDataGridFilterContext } from '../felleskomponenter/data/DataGridFilterContext.ts'
import { type HttpError } from '../io/HttpError.ts'
import { type FinnOppgaverRequest, type Oppgave, Oppgaveprioritet } from '../oppgave/oppgaveTypes.ts'
import { useOpppgavesøk } from '../oppgave/useOppgavesøk.ts'
import { type OppgaveColumnField } from './oppgaveColumns.tsx'
import { OppgaveToolbarTab, useOppgavelisteContext } from './OppgavelisteContext.tsx'
import {
  selectBehandlingstemaTerm,
  selectBehandlingstypeTerm,
  selectBrukerKommuneNavn,
  selectInnsenderNavn,
  selectIsHastesak,
  selectIsPåVent,
  selectMappenavn,
  selectOppgavetype,
  selectPrioritet,
  selectSaksstatus,
  selectTildeltSaksbehandlerNavn,
} from './oppgaveSelectors.ts'
import { useOppgaveComparator } from './useOppgaveComparator.ts'
import { type OppgaveFilterOptions, useOppgaveFilterOptions } from './useOppgaveFilterOptions.ts'

const pageNumber = 1
const pageSize = 1_000
const ingenOppgaver: Oppgave[] = []

export interface UseClientSideOppgaverResponse {
  oppgaver: ReadonlyArray<Oppgave>
  totalElements: number
  error?: HttpError
  isLoading: boolean
  isValidating: boolean
  filterOptions: OppgaveFilterOptions
  antallOppgaver: number
  antallHastesaker: number
  antallPåVent: number
}

export function useClientSideOppgaver(request: Partial<FinnOppgaverRequest> = {}): UseClientSideOppgaverResponse {
  const { currentTab, sort } = useOppgavelisteContext()
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
      .filterBy(selectSaksstatus, filterState.saksstatus)
      .filterBy(selectPrioritet, hastesakFilter(currentTab))
      .filterBy(selectIsPåVent, isPåVentFilter(currentTab))
      .toSorted(comparator)
      .toArray()
  }, [alleOppgaver, currentTab, filterState, comparator])

  const filterOptions = useOppgaveFilterOptions(alleOppgaver)
  const totalElements = response.data ? response.data.totalElements : 0
  const antallHastesaker = useMemo(() => alleOppgaver.filter(selectIsHastesak).length, [alleOppgaver])
  const antallPåVent = useMemo(() => alleOppgaver.filter(selectIsPåVent).length, [alleOppgaver])
  return {
    oppgaver: filtrerteOppgaver,
    totalElements,
    error: response.error,
    isLoading: response.isLoading,
    isValidating: response.isValidating,
    filterOptions,
    antallOppgaver: totalElements, // filtrerteOppgaver.length
    antallHastesaker,
    antallPåVent,
  }
}

function hastesakFilter(currentTab: OppgaveToolbarTab): DataGridFilterValues | undefined {
  if (currentTab === OppgaveToolbarTab.HASTESAKER) return hastesakValues
}

function isPåVentFilter(currentTab: OppgaveToolbarTab): DataGridFilterValues | undefined {
  if (currentTab === OppgaveToolbarTab.PÅ_VENT) return isPåVentValues
}

const hastesakValues: DataGridFilterValues = { values: new Set([Oppgaveprioritet.HØY, Oppgaveprioritet.KRITISK]) }
const isPåVentValues: DataGridFilterValues = { values: new Set([true]) }
