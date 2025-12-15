import { type ReactNode, useMemo } from 'react'

import { type OppgaveSortState } from '../../oppgave/oppgaveTypes.ts'
import { useLocalState } from '../../state/useLocalState.ts'
import { initialState, OppgaveFilterContext } from './OppgaveFilterContext.tsx'

export function OppgaveFilterProvider({
  suffix,
  children,
}: {
  suffix: 'Mine' | 'Enhetens' | 'Medarbeiders'
  children: ReactNode
}) {
  const key = (key: string) => key + suffix
  const [currentPage, setCurrentPage] = useLocalState(key('oppgaveCurrentPage'), initialState.currentPage)
  const [sort, setSort] = useLocalState<OppgaveSortState>(key('oppgaveSort'), initialState.sort)

  const value = useMemo(() => {
    return {
      currentPage,
      setCurrentPage,
      sort,
      setSort,
    }
  }, [currentPage, setCurrentPage, sort, setSort])

  return <OppgaveFilterContext value={value}>{children}</OppgaveFilterContext>
}
