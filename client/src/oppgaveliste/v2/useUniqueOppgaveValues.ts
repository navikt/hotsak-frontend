import { useMemo } from 'react'

import { type OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'
import { natural, notEmpty, uniqueBy } from '../../utils/array.ts'

export interface UniqueOppgaveValues {
  saksbehandlere: string[]
  // oppgavetyper: Oppgavetype[]
  behandlingstemaer: string[]
  // behandlingstyper: string[]
  mapper: string[]
  // prioriteter: Oppgaveprioritet[]
  kommuner: string[]
}

export function useUniqueOppgaveValues(oppgaver: OppgaveV2[]): UniqueOppgaveValues {
  return useMemo(() => {
    return {
      saksbehandlere: uniqueBy(oppgaver, (it) => it.tildeltSaksbehandler?.navn ?? 'Ingen')
        .filter(notEmpty)
        .sort(natural),
      // oppgavetyper: uniqueBy(oppgaver, (it) => it.kategorisering.oppgavetype).sort(natural),
      behandlingstemaer: uniqueBy(oppgaver, (it) => it.kategorisering.behandlingstema?.term ?? 'Ingen')
        .filter(notEmpty)
        .sort(natural),
      /* behandlingstyper: uniqueBy(oppgaver, (it) => it.kategorisering.behandlingstype?.term ?? 'Ingen')
        .filter(notEmpty)
        .sort(natural), */
      mapper: uniqueBy(oppgaver, (it) => it.mappenavn ?? 'Ingen')
        .filter(notEmpty)
        .sort(natural),
      // prioriteter: uniqueBy(oppgaver, select('prioritet')).sort(natural),
      kommuner: uniqueBy(oppgaver, (it) => it.bruker?.kommune?.navn ?? 'Ingen')
        .filter(notEmpty)
        .sort(natural),
    }
  }, [oppgaver])
}
