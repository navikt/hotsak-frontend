export function useOppgaveUrl(oppgaveId?: string) {
  if (!oppgaveId) {
    return undefined
  }
  const oppgavebehandlingUrl =
    window.appSettings.GOSYS_OPPGAVEBEHANDLING_URL ?? 'http://localhost/gosys/oppgavebehandling'
  return `${oppgavebehandlingUrl}/oppgave/${oppgaveId}`
}
