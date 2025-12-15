import { useMemo } from 'react'

import { type OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'

export interface UniqueOppgaveValues {
  saksbehandlere: Set<string>
  behandlingstemaer: Set<string>
  mapper: Set<string>
  kommuner: Set<string>
}

export function useUniqueOppgaveValues(oppgaver: OppgaveV2[]): UniqueOppgaveValues {
  return useMemo(() => {
    return {
      saksbehandlere: toSet(oppgaver, (it) => it.tildeltSaksbehandler?.navn ?? 'Ingen'),
      behandlingstemaer: toSet(oppgaver, (it) => it.kategorisering.behandlingstema?.term ?? 'Ingen'),
      mapper: toSet(oppgaver, (it) => it.mappenavn ?? 'Ingen'),
      kommuner: toSet(oppgaver, (it) => it.bruker?.kommune?.navn ?? 'Ingen'),
    }
  }, [oppgaver])
}

function toSet<T, R>(items: T[], selector: (item: T) => R): Set<R> {
  const destination = new Set<R>()
  items.forEach((item) => {
    destination.add(selector(item))
  })
  return destination
}
