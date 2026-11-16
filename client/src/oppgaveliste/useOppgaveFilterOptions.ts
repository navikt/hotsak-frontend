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
  selectNøkkelord,
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
      saksbehandler: mapToSet(oppgaver, selectTildeltSaksbehandlerNavn),
      oppgavetype: isSaksbehandlerBarnebriller
        ? oppgavetypeOptionsBarnebriller
        : toDataGridFilterOptions(OppgavetypeLabel, ...mapToSet(oppgaver, selectOppgavetype)),
      behandlingstema: mapToSet(oppgaver, selectBehandlingstemaTerm),
      behandlingstype: mapToSet(oppgaver, selectBehandlingstypeTerm),
      nøkkelord: flatMapToSet(oppgaver, selectNøkkelord),
      mappenavn: mapToSet(oppgaver, selectMappenavn),
      innsenderNavn: mapToSet(oppgaver, selectInnsenderNavn),
      kommune: mapToSet(oppgaver, selectBrukerKommuneNavn),
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

function mapToSet<T, R>(items: ReadonlyArray<T>, selector: (item: T) => R): Set<R> {
  return new Set(items.map(selector))
}

function flatMapToSet<T, R>(items: ReadonlyArray<T>, selector: (item: T) => ReadonlyArray<R>): Set<R> {
  return new Set(items.flatMap(selector))
}
