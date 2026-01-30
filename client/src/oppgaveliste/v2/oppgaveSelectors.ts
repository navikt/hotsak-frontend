import { OppgaveId, type Oppgaveprioritet, type Oppgavetype, type OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'

export function selectOppgaveId(it: OppgaveV2): OppgaveId {
  return it.oppgaveId
}

export function selectTildeltSaksbehandlerNavn(it: OppgaveV2): string {
  return it.tildeltSaksbehandler?.navn || 'Ingen'
}

export function selectOppgavetype(it: OppgaveV2): Oppgavetype {
  return it.kategorisering.oppgavetype
}

export function selectBehandlingstemaTerm(it: OppgaveV2): string {
  return it.kategorisering.behandlingstema?.term || 'Ingen'
}

export function selectBehandlingstypeTerm(it: OppgaveV2): string {
  return it.kategorisering.behandlingstype?.term || 'Ingen'
}

export function selectMappenavn(it: OppgaveV2): string {
  return it.mappenavn || 'Ingen'
}

export function selectPrioritet(it: OppgaveV2): Oppgaveprioritet {
  return it.prioritet
}

export function selectBrukerFødselsnummer(it: OppgaveV2): string | undefined {
  return it.bruker?.fnr
}

export function selectBrukerAlder(it: OppgaveV2): number | undefined {
  return it.bruker?.alder
}

export function selectBrukerKommuneNavn(it: OppgaveV2): string {
  return it.bruker?.kommune?.navn || 'Ingen'
}

export function selectFerdigstiltTidspunkt(it: OppgaveV2): string | undefined {
  return it.ferdigstiltTidspunkt
}
