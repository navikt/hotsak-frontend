import { Actions, useActionState } from '../action/Actions.ts'
import { baseUrl } from '../io/http.ts'
import { http } from '../io/HttpClient.ts'
import type { NavIdent } from '../tilgang/Ansatt.ts'
import { useOptionalOppgaveContext } from './OppgaveContext.ts'
import type { OppgaveBase, OppgaveId } from './oppgaveTypes.ts'

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
   * Endre tildeling av oppgave. Støtter også overtagelse av oppgave.
   *
   * @param request
   * @param onConflict
   */
  endreOppgavetildeling(
    request: Omit<EndreOppgavetildelingRequest, 'oppgaveId'>,
    onConflict?: () => void | Promise<void>
  ): Promise<void>
  /**
   * Fjern tildeling av oppgave/sak. Setter behandlende saksbehandler til `null`.
   */
  fjernOppgavetildeling(): Promise<void>
}

/**
 * Opprett `OppgaveActions` som er knyttet til `oppgaveId`, `versjon` og `sakId` fra `OppgaveContext`.
 */
export function useOppgaveActions(oppgave?: OppgaveBase): UseOppgaveActions {
  const { oppgaveId = oppgave?.oppgaveId, versjon = oppgave?.versjon } = useOptionalOppgaveContext()

  const { execute, state } = useActionState()

  return {
    async endreOppgavetildeling(request) {
      return execute(async () => {
        await http.post(`${baseUrl}/api/oppgaver-v2/${oppgaveId}/tildeling`, request, {
          versjon,
        })
      })
    },

    async fjernOppgavetildeling() {
      return execute(async () => {
        await http.delete(`${baseUrl}/api/oppgaver-v2/${oppgaveId}/tildeling`, {
          versjon,
        })
      })
    },

    state,
  }
}
