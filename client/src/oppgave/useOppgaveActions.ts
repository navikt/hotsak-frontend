import { useOppgaveContext } from './OppgaveContext.ts'
import type { OppgaveBase, OppgaveId } from './oppgaveTypes.ts'
import type { NavIdent } from '../tilgang/Ansatt.ts'
import { baseUrl, del, ifMatchVersjon, post } from '../io/http.ts'
import { Actions, useActionState } from '../action/Actions.ts'

export interface EndreOppgavetildelingRequest {
  oppgaveId?: OppgaveId | null
  /**
   * Angis hvis en spesifikk ansatt skal bli saksbehandler.
   */
  saksbehandlerId?: NavIdent | null
  melding?: string | null
  /**
   * `true` hvis tildelingen skal skje selv om oppgaven allerede er tildelt en annen saksbehandler.
   */
  overtaHvisTildelt?: boolean
}

export interface UseOppgaveActions extends Actions {
  /**
   * Endre tildeling av oppgave/sak. Støtter også overtagelse av oppgave/sak.
   *
   * @param request
   */
  endreOppgavetildeling(request: Omit<EndreOppgavetildelingRequest, 'oppgaveId'>): Promise<void>
  /**
   * Fjern tildeling av oppgave/sak. Setter behandlende saksbehandler til `null`.
   */
  fjernOppgavetildeling(): Promise<void>
}

/**
 * Opprett `OppgaveActions` som er knyttet til `oppgaveId`, `versjon` og `sakId` fra `OppgaveContext`.
 */
export function useOppgaveActions(oppgave?: OppgaveBase): UseOppgaveActions {
  const { oppgaveId = oppgave?.oppgaveId, versjon = oppgave?.versjon } = useOppgaveContext()

  const { execute, state } = useActionState()

  const headers = ifMatchVersjon(versjon)

  return {
    async endreOppgavetildeling(request) {
      return execute(async () => {
        await post(`${baseUrl}/api/oppgaver-v2/${oppgaveId}/tildeling`, request, headers)
      })
    },

    async fjernOppgavetildeling() {
      return execute(async () => {
        await del(`${baseUrl}/api/oppgaver-v2/${oppgaveId}/tildeling`, null, headers)
      })
    },

    state,
  }
}
