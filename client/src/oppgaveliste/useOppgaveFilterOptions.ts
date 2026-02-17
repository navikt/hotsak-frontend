import { useMemo } from 'react'

import { toDataGridFilterOptions } from '../felleskomponenter/data/DataGridFilter.ts'
import { Oppgavetype, OppgavetypeLabel, type OppgaveV2 } from '../oppgave/oppgaveTypes.ts'
import { useIsSaksbehandlerBarnebriller } from '../tilgang/useTilgang.ts'
import { type OppgaveColumnField } from './oppgaveColumns.tsx'

export const OPPGAVE_FILTER_OPTION_TOMME = '(Tomme)'

export type OppgaveFilterOptions = Partial<
  Record<OppgaveColumnField, ReadonlySet<string> | ReadonlyMap<string, string>>
>

export function useOppgaveFilterOptions(oppgaver: OppgaveV2[]): OppgaveFilterOptions {
  const isSaksbehandlerBarnebriller = useIsSaksbehandlerBarnebriller()
  return useMemo(() => {
    return {
      saksbehandler: toSet(oppgaver, (it) => it.tildeltSaksbehandler?.navn ?? OPPGAVE_FILTER_OPTION_TOMME),
      oppgavetype: isSaksbehandlerBarnebriller ? oppgavetypeOptionsBarnebriller : oppgavetypeOptions,
      behandlingstema: toSet(oppgaver, (it) => it.kategorisering.behandlingstema?.term ?? OPPGAVE_FILTER_OPTION_TOMME),
      mappenavn: toSet(oppgaver, (it) => it.mappenavn ?? OPPGAVE_FILTER_OPTION_TOMME),
      innsenderNavn: toSet(oppgaver, (it) => it.innsender?.fulltNavn ?? OPPGAVE_FILTER_OPTION_TOMME),
      kommune: toSet(oppgaver, (it) => it.bruker?.kommune?.navn ?? OPPGAVE_FILTER_OPTION_TOMME),
    }
  }, [oppgaver, isSaksbehandlerBarnebriller])
}

const oppgavetypeOptionsBarnebriller = toDataGridFilterOptions(
  OppgavetypeLabel,
  Oppgavetype.JOURNALFØRING,
  Oppgavetype.BEHANDLE_SAK,
  Oppgavetype.GODKJENNE_VEDTAK,
  Oppgavetype.BEHANDLE_UNDERKJENT_VEDTAK
)

const oppgavetypeOptions = toDataGridFilterOptions(OppgavetypeLabel, Oppgavetype.BEHANDLE_SAK)

function toSet<T, R>(items: T[], selector: (item: T) => R): Set<R> {
  const destination = new Set<R>()
  items.forEach((item) => {
    destination.add(selector(item))
  })
  return destination
}
