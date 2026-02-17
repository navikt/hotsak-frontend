import { type OppgaveId, type Oppgaveprioritet, type Oppgavetype, type OppgaveV2 } from '../oppgave/oppgaveTypes.ts'
import { OPPGAVE_FILTER_OPTION_TOMME } from './useOppgaveFilterOptions.ts'

export function selectOppgaveId(it: OppgaveV2): OppgaveId {
  return it.oppgaveId
}

export function selectTildeltSaksbehandlerNavn(it: OppgaveV2): string {
  return it.tildeltSaksbehandler?.navn || OPPGAVE_FILTER_OPTION_TOMME
}

export function selectOppgavetype(it: OppgaveV2): Oppgavetype {
  return it.kategorisering.oppgavetype
}

export function selectBehandlingstemaTerm(it: OppgaveV2): string {
  return it.kategorisering.behandlingstema?.term || OPPGAVE_FILTER_OPTION_TOMME
}

export function selectBehandlingstypeTerm(it: OppgaveV2): string {
  return it.kategorisering.behandlingstype?.term || OPPGAVE_FILTER_OPTION_TOMME
}

export function selectMappenavn(it: OppgaveV2): string {
  return it.mappenavn || OPPGAVE_FILTER_OPTION_TOMME
}

export function selectPrioritet(it: OppgaveV2): Oppgaveprioritet {
  return it.prioritet
}

export function selectInnsenderNavn(it: OppgaveV2): string {
  return it.innsender?.fulltNavn ?? OPPGAVE_FILTER_OPTION_TOMME
}

export function selectBrukerFødselsnummer(it: OppgaveV2): string | undefined {
  return it.bruker?.fnr
}

export function selectBrukerFødselsdato(it: OppgaveV2): string | undefined {
  return it.bruker?.fødselsdato
}

export function selectBrukerAlder(it: OppgaveV2): number | undefined {
  return it.bruker?.alder
}

export function selectBrukerKommuneNavn(it: OppgaveV2): string {
  return it.bruker?.kommune?.navn || OPPGAVE_FILTER_OPTION_TOMME
}

export function selectFerdigstiltTidspunkt(it: OppgaveV2): string | undefined {
  return it.ferdigstiltTidspunkt
}
