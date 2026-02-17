import { useMemo } from 'react'

import { type OppgaveV2 } from '../oppgave/oppgaveTypes.ts'
import { type Comparator, compareBy } from '../utils/array.ts'
import { useOppgavePaginationContext } from './OppgavePaginationContext.tsx'
import {
  selectBrukerAlder,
  selectBrukerFødselsdato,
  selectBrukerFødselsnummer,
  selectFerdigstiltTidspunkt,
} from './oppgaveSelectors.ts'

export function useOppgaveComparator(): Comparator<OppgaveV2> | undefined {
  const {
    sort: { orderBy, direction },
  } = useOppgavePaginationContext()
  return useMemo(() => {
    switch (orderBy) {
      case 'fnr':
        return compareBy(selectBrukerFødselsnummer, direction)
      case 'fødselsdato':
        return compareBy(selectBrukerFødselsdato, direction)
      case 'alder':
        return compareBy(selectBrukerAlder, direction)
      case 'ferdigstiltTidspunkt':
        return compareBy(selectFerdigstiltTidspunkt, direction)
      default:
        return
    }
  }, [orderBy, direction])
}
