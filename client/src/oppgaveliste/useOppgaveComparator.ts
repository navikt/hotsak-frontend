import { useMemo } from 'react'

import { type Oppgave } from '../oppgave/oppgaveTypes.ts'
import { comparator, type Comparator, compareBy } from '../utils/array.ts'
import { useOppgavelisteContext } from './OppgavelisteContext.tsx'
import {
  selectBrukerAlder,
  selectBrukerFødselsdato,
  selectBrukerFødselsnummer,
  selectFerdigstiltTidspunkt,
  selectOppgaveId,
  selectSakId,
} from './oppgaveSelectors.ts'

export function useOppgaveComparator(): Comparator<Oppgave> | undefined {
  const {
    sort: { orderBy, direction },
  } = useOppgavelisteContext()
  return useMemo(() => {
    switch (orderBy) {
      case 'oppgaveId':
        return compareBy(direction, selectOppgaveId)
      case 'sakId':
        return compareBy(direction, selectSakId)
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
