import { useMemo } from 'react'

import { type OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'
import { type OppgaveColumnField } from './oppgaveColumns.tsx'

export const OPPGAVE_FILTER_OPTION_TOMME = '(Tomme)'

export type OppgaveFilterOptions = Partial<Record<OppgaveColumnField, Set<string>>>

export function useOppgaveFilterOptions(oppgaver: OppgaveV2[]): OppgaveFilterOptions {
  return useMemo(() => {
    return {
      saksbehandler: toSet(oppgaver, (it) => it.tildeltSaksbehandler?.navn ?? OPPGAVE_FILTER_OPTION_TOMME),
      behandlingstema: toSet(oppgaver, (it) => it.kategorisering.behandlingstema?.term ?? OPPGAVE_FILTER_OPTION_TOMME),
      mappenavn: toSet(oppgaver, (it) => it.mappenavn ?? OPPGAVE_FILTER_OPTION_TOMME),
      innsenderNavn: toSet(oppgaver, (it) => it.innsender?.fulltNavn ?? OPPGAVE_FILTER_OPTION_TOMME),
      kommune: toSet(oppgaver, (it) => it.bruker?.kommune?.navn ?? OPPGAVE_FILTER_OPTION_TOMME),
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
