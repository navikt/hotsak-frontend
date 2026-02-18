import { useMemo } from 'react'

import { type Oppgave } from '../oppgave/oppgaveTypes.ts'
import { comparator, type Comparator, compareBy } from '../utils/array.ts'
import { useOppgavePaginationContext } from './OppgavePaginationContext.tsx'
import {
  selectBrukerAlder,
  selectBrukerFødselsdato,
  selectBrukerFødselsnummer,
  selectFerdigstiltTidspunkt,
} from './oppgaveSelectors.ts'

export function useOppgaveComparator(): Comparator<Oppgave> | undefined {
  const {
    sort: { orderBy, direction },
  } = useOppgavePaginationContext()
  return useMemo(() => {
    switch (orderBy) {
      case 'fnr':
        return compareBy(direction, selectBrukerFødselsnummer)
      case 'fødselsdato':
        return comparator(direction, selectBrukerFødselsdato, dayMonthYear)
      case 'alder':
        return compareBy(direction, selectBrukerAlder)
      case 'ferdigstiltTidspunkt':
        return compareBy(direction, selectFerdigstiltTidspunkt)
      default:
        return
    }
  }, [orderBy, direction])
}

function dayMonthYear(a: Date, b: Date) {
  return a.getDate() - b.getDate() || a.getMonth() - b.getMonth() || a.getFullYear() - b.getFullYear()
}
