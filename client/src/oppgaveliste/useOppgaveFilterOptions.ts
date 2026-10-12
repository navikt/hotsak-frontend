import { useMemo } from 'react'

import { toDataGridFilterOptions } from '../felleskomponenter/data/DataGridFilter.ts'
import { type Oppgave, Oppgavetype, OppgavetypeLabel } from '../oppgave/oppgaveTypes.ts'
import { useIsSaksbehandlerBarnebriller } from '../tilgang/useTilgang.ts'
import { type OppgaveColumnField } from './oppgaveColumns.tsx'
import {
  selectBehandlingstemaTerm,
  selectBehandlingstypeTerm,
  selectBrukerKommuneNavn,
  selectInnsenderNavn,
  selectMappenavn,
  selectOppgavetype,
  selectTildeltSaksbehandlerNavn,
} from './oppgaveSelectors.ts'

export const OPPGAVE_FILTER_OPTION_TOMME = '(Tomme)'

export type OppgaveFilterOptions = Partial<
  Record<OppgaveColumnField, ReadonlySet<string> | ReadonlyMap<string, string>>
>

export type OppgaveFilterCounts = Partial<Record<OppgaveColumnField, ReadonlyMap<string, number>>>

export function useOppgaveFilterOptions(oppgaver: Oppgave[]): OppgaveFilterOptions {
  const isSaksbehandlerBarnebriller = useIsSaksbehandlerBarnebriller()
  return useMemo(() => {
    return {
      saksbehandler: toSet(oppgaver, selectTildeltSaksbehandlerNavn),
      oppgavetype: isSaksbehandlerBarnebriller
        ? oppgavetypeOptionsBarnebriller
        : toDataGridFilterOptions(OppgavetypeLabel, ...toSet(oppgaver, selectOppgavetype)),
      behandlingstema: toSet(oppgaver, selectBehandlingstemaTerm),
      behandlingstype: toSet(oppgaver, selectBehandlingstypeTerm),
      mappenavn: toSet(oppgaver, selectMappenavn),
      innsenderNavn: toSet(oppgaver, selectInnsenderNavn),
      kommune: toSet(oppgaver, selectBrukerKommuneNavn),
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

function toSet<T, R>(items: T[], selector: (item: T) => R): Set<R> {
  const destination = new Set<R>()
  items.forEach((item) => {
    destination.add(selector(item))
  })
  return destination
}
