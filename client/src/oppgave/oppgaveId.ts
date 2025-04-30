/**
 * Oppgaven er kun opprettet i Hotsak-tabellen `oppgave_v1`.
 */
type InternOppgaveId = `I-${number}`

/**
 * Oppgaven er opprettet i felles oppgaveløsning.
 */
type EksternOppgaveId = `E-${number}`

/**
 * Vi har kun en sak. Siffer etter `S-` er `sakId`.
 */
type SakOppgaveId = `S-${number}`

/**
 * Vi har tre ulike typer `OppgaveId`. Typen forteller oss hvor oppgaven er lagret.
 */
export type OppgaveId = InternOppgaveId | EksternOppgaveId | SakOppgaveId

function harPrefix(prefix: string, value: unknown): value is string {
  if (!(value && typeof value === 'string')) return false
  return value.substring(0, 2) === prefix
}

export function erInternOppgaveId(value: unknown): value is InternOppgaveId {
  return harPrefix('I-', value)
}

export function erEksternOppgaveId(value: unknown): value is EksternOppgaveId {
  return harPrefix('E-', value)
}

export function erSakOppgaveId(value: unknown): value is SakOppgaveId {
  return harPrefix('S-', value)
}

export function oppgaveIdUtenPrefix(oppgaveId: OppgaveId): string {
  return oppgaveId.substring(2)
}
