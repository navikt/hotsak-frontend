export function useOppgaveUrl(oppgaveId: string) {
  const oppgavebehandlingUrl =
    window.appSettings.GOSYS_OPPGAVEBEHANDLING_URL ?? 'http://localhost/gosys/oppgavebehandling'
  return `${oppgavebehandlingUrl}/oppgave/${oppgaveId}`
}
