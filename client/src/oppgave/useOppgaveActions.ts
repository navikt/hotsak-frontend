import { mutate, preload } from 'swr'

import { Actions, useActionState } from '../action/Actions.ts'
import { http } from '../io/HttpClient.ts'
import { mutateSak } from '../saksbilde/mutateSak.ts'
import type { NavIdent } from '../tilgang/Ansatt.ts'
import type { OppgaveBase, OppgaveId } from './oppgaveTypes.ts'

export interface EndreOppgavetildelingRequest {
  oppgaveId?: OppgaveId
  /**
   * Angis hvis en spesifikk ansatt skal bli saksbehandler.
   */
  saksbehandlerId?: NavIdent
  kommentar?: string
}

export interface FjernOppgavetildelingRequest {
  kommentar?: string
}

export interface EndreOppgaveRequest {
  behandlingstema?: string
  aktivDato?: string
  fristFerdigstillelse?: string
  kommentar?: string
}

export interface OppgaveActions extends Actions {
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
  fjernOppgavetildeling(request?: FjernOppgavetildelingRequest): Promise<void>

  /**
   * TODO
   */
  endreOppgave(request: EndreOppgaveRequest): Promise<void>

  /**
   * TODO
   */
  merkSomLest(): Promise<void>
}

/**
 * TODO
 *
 * @param oppgave
 * @param isOppgaveContext
 */
export function useOppgaveActions(oppgave: OppgaveBase, isOppgaveContext = true): OppgaveActions {
  const { oppgaveId, versjon, sakId } = oppgave
  const { execute, state } = useActionState()

  const mutateOppgaveOgSak = () => {
    if (sakId) {
      return Promise.all([mutateOppgave(oppgaveId), mutateSak(sakId)])
    }
    return mutateOppgave(oppgaveId)
  }

  return {
    async endreOppgavetildeling(request) {
      return execute(async () => {
        await http.post(`/api/oppgaver/${oppgaveId}/tildeling`, request, {
          versjon,
        })
        if (isOppgaveContext) {
          await mutateOppgaveOgSak()
        }
      })
    },

    async fjernOppgavetildeling() {
      return execute(async () => {
        await http.delete(`/api/oppgaver/${oppgaveId}/tildeling`, {
          versjon,
        })
        if (isOppgaveContext) {
          await mutateOppgaveOgSak()
        }
      })
    },

    async endreOppgave(request) {
      return execute(async () => {
        await http.put(`/api/oppgaver/${oppgaveId}`, request, {
          versjon,
        })
        if (isOppgaveContext) {
          await mutateOppgaveOgSak()
        }
      })
    },

    async merkSomLest() {
      return execute(() => http.put(`/api/oppgaver/${oppgaveId}/leste`))
    },

    state,
  }
}

export function preloadOppgave(oppgaveId: OppgaveId) {
  return preload(`/api/oppgaver/${oppgaveId}`, http.get)
}

export function mutateOppgave(oppgaveId: OppgaveId) {
  return mutate(`/api/oppgaver/${oppgaveId}`)
}
