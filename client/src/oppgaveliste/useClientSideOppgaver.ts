import { useMemo } from 'react'

import { DataGridCollection } from '../felleskomponenter/data/DataGridCollection.ts'
import { type DataGridFilterValues } from '../felleskomponenter/data/DataGridFilter.ts'
import { useDataGridFilterContext } from '../felleskomponenter/data/DataGridFilterContext.ts'
import { type HttpError } from '../io/HttpError.ts'
import { type FinnOppgaverRequest, type Oppgave, Oppgaveprioritet } from '../oppgave/oppgaveTypes.ts'
import { useOppgavesøk } from '../oppgave/useOppgavesøk.ts'
import { type OppgaveColumnField } from './oppgaveColumns.tsx'
import { OppgaveToolbarTab, useOppgavelisteContext } from './OppgavelisteContext.tsx'
import {
  selectBehandlingstemaTerm,
  selectBehandlingstypeTerm,
  selectBrukerKommuneNavn,
  selectInnsenderNavn,
  selectIsAktiv,
  selectIsHastesak,
  selectIsPåVent,
  selectMappenavn,
  selectOppgavetype,
  selectPrioritet,
  selectSaksstatus,
  selectTildeltSaksbehandlerNavn,
} from './oppgaveSelectors.ts'
import { useOppgaveComparator } from './useOppgaveComparator.ts'
import {
  type OppgaveFilterCounts,
  type OppgaveFilterOptions,
  useOppgaveFilterOptions,
} from './useOppgaveFilterOptions.ts'

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
  filterCounts: OppgaveFilterCounts
  antallOppgaver: number
  antallViste: number
  antallHastesaker: number
  antallAktive: number
  antallPåVent: number
}

export function useClientSideOppgaver(request: Partial<FinnOppgaverRequest> = {}): UseClientSideOppgaverResponse {
  const { currentTab, sort } = useOppgavelisteContext()
  const { tildelt, ...rest } = request

  const response = useOppgavesøk({
    tildelt,
    sorteringsfelt: sort.orderBy === 'opprettetTidspunkt' ? 'OPPRETTET_TIDSPUNKT' : 'FRIST',
    sorteringsrekkefølge: sort.direction === 'descending' ? 'DESC' : 'ASC',
    pageNumber,
    pageSize,
    ...rest,
  })
  const alleOppgaver = response.data?.oppgaver ?? ingenOppgaver

  const filterState = useDataGridFilterContext<OppgaveColumnField>(currentTab)
  const comparator = useOppgaveComparator()
  const filtrerteOppgaver = useMemo(() => {
    return filtrer(alleOppgaver, filterState, currentTab).toSorted(comparator).toArray()
  }, [alleOppgaver, currentTab, filterState, comparator])

  // Antall per verdi, regnet mot alle aktive filtre bortsett fra kolonnens eget filter
  const filterCounts = useMemo((): OppgaveFilterCounts => {
    const result: OppgaveFilterCounts = {}
    for (const [field, selector] of filterSelectors) {
      const counts = new Map<string, number>()
      for (const oppgave of filtrer(alleOppgaver, filterState, currentTab, field).toArray()) {
        const value = selector(oppgave)
        counts.set(value, (counts.get(value) ?? 0) + 1)
      }
      result[field] = counts
    }
    return result
  }, [alleOppgaver, currentTab, filterState])

  const filterOptions = useOppgaveFilterOptions(alleOppgaver)
  const totalElements = response.data ? response.data.totalElements : 0
  const antallHastesaker = useMemo(() => alleOppgaver.filter(selectIsHastesak).length, [alleOppgaver])
  const antallAktive = useMemo(() => alleOppgaver.filter(selectIsAktiv).length, [alleOppgaver])
  const antallPåVent = useMemo(() => alleOppgaver.filter(selectIsPåVent).length, [alleOppgaver])
  return {
    oppgaver: filtrerteOppgaver,
    totalElements,
    error: response.error,
    isLoading: response.isLoading,
    isValidating: response.isValidating,
    filterOptions,
    filterCounts,
    antallViste: filtrerteOppgaver.length,
    antallOppgaver: totalElements, // filtrerteOppgaver.length
    antallHastesaker,
    antallAktive,
    antallPåVent,
  }
}

const filterSelectors: ReadonlyArray<[OppgaveColumnField, (oppgave: Oppgave) => string]> = [
  ['saksbehandler', selectTildeltSaksbehandlerNavn],
  ['oppgavetype', selectOppgavetype],
  ['behandlingstema', selectBehandlingstemaTerm],
  ['behandlingstype', selectBehandlingstypeTerm],
  ['mappenavn', selectMappenavn],
  ['prioritet', selectPrioritet],
  ['innsenderNavn', selectInnsenderNavn],
  ['kommune', selectBrukerKommuneNavn],
  ['saksstatus', selectSaksstatus],
]

function filtrer(
  oppgaver: ReadonlyArray<Oppgave>,
  filterState: Partial<Record<OppgaveColumnField, DataGridFilterValues>>,
  currentTab: OppgaveToolbarTab,
  utenFelt?: OppgaveColumnField
): DataGridCollection<Oppgave> {
  const filter = (field: OppgaveColumnField) => (field === utenFelt ? undefined : filterState[field])
  return DataGridCollection.from(oppgaver)
    .filterBy(selectTildeltSaksbehandlerNavn, filter('saksbehandler'))
    .filterBy(selectOppgavetype, filter('oppgavetype'))
    .filterBy(selectBehandlingstemaTerm, filter('behandlingstema'))
    .filterBy(selectBehandlingstypeTerm, filter('behandlingstype'))
    .filterBy(selectMappenavn, filter('mappenavn'))
    .filterBy(selectPrioritet, filter('prioritet'))
    .filterBy(selectInnsenderNavn, filter('innsenderNavn'))
    .filterBy(selectBrukerKommuneNavn, filter('kommune'))
    .filterBy(selectSaksstatus, filter('saksstatus'))
    .filterBy(selectPrioritet, hastesakFilter(currentTab))
    .filterBy(selectIsAktiv, isAktivFilter(currentTab))
    .filterBy(selectIsPåVent, isPåVentFilter(currentTab))
}

function hastesakFilter(currentTab: OppgaveToolbarTab): DataGridFilterValues | undefined {
  if (currentTab === OppgaveToolbarTab.HASTESAKER) return hastesakValues
}

function isAktivFilter(currentTab: OppgaveToolbarTab): DataGridFilterValues | undefined {
  if (currentTab === OppgaveToolbarTab.AKTIVE) return isAktivValues
}

function isPåVentFilter(currentTab: OppgaveToolbarTab): DataGridFilterValues | undefined {
  if (currentTab === OppgaveToolbarTab.PÅ_VENT) return isPåVentValues
}

const hastesakValues: DataGridFilterValues = { values: new Set([Oppgaveprioritet.HØY, Oppgaveprioritet.KRITISK]) }
const isAktivValues: DataGridFilterValues = { values: new Set([true]) }
const isPåVentValues: DataGridFilterValues = { values: new Set([true]) }
