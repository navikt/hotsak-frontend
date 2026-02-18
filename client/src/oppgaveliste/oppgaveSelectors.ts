import { parseISO } from 'date-fns'

import { type Oppgave, type OppgaveId, type Oppgaveprioritet, type Oppgavetype } from '../oppgave/oppgaveTypes.ts'
import { OPPGAVE_FILTER_OPTION_TOMME } from './useOppgaveFilterOptions.ts'

export function selectOppgaveId(it: Oppgave): OppgaveId {
  return it.oppgaveId
}

export function selectTildeltSaksbehandlerNavn(it: Oppgave): string {
  return it.tildeltSaksbehandler?.navn || OPPGAVE_FILTER_OPTION_TOMME
}

export function selectOppgavetype(it: Oppgave): Oppgavetype {
  return it.kategorisering.oppgavetype
}

export function selectBehandlingstemaTerm(it: Oppgave): string {
  return it.kategorisering.behandlingstema?.term || OPPGAVE_FILTER_OPTION_TOMME
}

export function selectBehandlingstypeTerm(it: Oppgave): string {
  return it.kategorisering.behandlingstype?.term || OPPGAVE_FILTER_OPTION_TOMME
}

export function selectMappenavn(it: Oppgave): string {
  return it.mappenavn || OPPGAVE_FILTER_OPTION_TOMME
}

export function selectPrioritet(it: Oppgave): Oppgaveprioritet {
  return it.prioritet
}

export function selectInnsenderNavn(it: Oppgave): string {
  return it.innsender?.fulltNavn ?? OPPGAVE_FILTER_OPTION_TOMME
}

export function selectBrukerFødselsnummer(it: Oppgave): string | undefined {
  return it.bruker?.fnr
}

export function selectBrukerFødselsdato(it: Oppgave): Date | undefined {
  if (it.bruker?.fødselsdato) {
    return parseISO(it.bruker.fødselsdato)
  }
}

export function selectBrukerAlder(it: Oppgave): number | undefined {
  return it.bruker?.alder
}

export function selectBrukerKommuneNavn(it: Oppgave): string {
  return it.bruker?.kommune?.navn || OPPGAVE_FILTER_OPTION_TOMME
}

export function selectFerdigstiltTidspunkt(it: Oppgave): string | undefined {
  return it.ferdigstiltTidspunkt
}
