import { useMemo } from 'react'

import { type OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'
import { type OppgaveColumnField } from './oppgaveColumns.tsx'

export type OppgaveFilterOptions = Partial<Record<OppgaveColumnField, Set<string>>>

export function useOppgaveFilterOptions(oppgaver: OppgaveV2[]): OppgaveFilterOptions {
  return useMemo(() => {
    return {
      saksbehandler: toSet(oppgaver, (it) => it.tildeltSaksbehandler?.navn ?? 'Ingen'),
      behandlingstema: toSet(oppgaver, (it) => it.kategorisering.behandlingstema?.term ?? 'Ingen'),
      mappenavn: toSet(oppgaver, (it) => it.mappenavn ?? 'Ingen'),
      innsenderNavn: toSet(oppgaver, (it) => it.innsender?.fulltNavn ?? 'Ingen'),
      kommune: toSet(oppgaver, (it) => it.bruker?.kommune?.navn ?? 'Ingen'),
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
