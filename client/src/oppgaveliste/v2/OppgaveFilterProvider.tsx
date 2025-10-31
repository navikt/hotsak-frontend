import { type ReactNode } from 'react'

import { type OppgaveSortState } from '../../oppgave/oppgaveTypes.ts'
import { useLocalState } from '../../state/useLocalState.ts'
import { initialState, OppgaveFilterContext } from './OppgaveFilterContext.tsx'

export function OppgaveFilterProvider({ prefix, children }: { prefix: 'mine' | 'kø'; children: ReactNode }) {
  const key = (key: string) => prefix + key
  const [oppgavetypeFilter, setOppgavetypeFilter] = useLocalState(
    key('OppgavetypeFilter'),
    initialState.oppgavetypeFilter
  )
  const [gjelderFilter, setGjelderFilter] = useLocalState(key('OppgaveGjelderFilter'), initialState.gjelderFilter)
  const [oppgaveprioritetFilter, setOppgaveprioritetFilter] = useLocalState(
    key('OppgaveprioritetFilter'),
    initialState.oppgaveprioritetFilter
  )
  const [currentPage, setCurrentPage] = useLocalState(key('OppgaveCurrentPage'), initialState.currentPage)
  const [sort, setSort] = useLocalState<OppgaveSortState>(key('OppgaveSort'), initialState.sort)

  function clearFilters() {
    setOppgavetypeFilter([])
    setGjelderFilter([])
    setOppgaveprioritetFilter([])
    setCurrentPage(1)
    setSort(initialState.sort)
  }

  return (
    <OppgaveFilterContext.Provider
      value={{
        oppgavetypeFilter,
        gjelderFilter,
        oppgaveprioritetFilter,
        currentPage,
        sort,
        setOppgavetypeFilter,
        setGjelderFilter,
        setOppgaveprioritetFilter,
        setCurrentPage,
        setSort,
        clearFilters,
      }}
    >
      {children}
    </OppgaveFilterContext.Provider>
  )
}
