import { useSWRConfig } from 'swr'

import { Actions, useActionState } from '../action/Actions.ts'
import { http } from '../io/HttpClient.ts'
import { mutateSak } from '../saksbilde/mutateSak.ts'
import type { NavIdent } from '../tilgang/Ansatt.ts'
import { useOppgaveContext } from './OppgaveContext.ts'
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
  fjernOppgavetildeling(): Promise<void>
}

/**
 * Opprett `OppgaveActions` som er knyttet til `oppgaveId`, `versjon` og `sakId` fra `OppgaveContext`.
 */
export function useOppgaveActions(oppgave?: OppgaveBase): OppgaveActions {
  const { mutate } = useSWRConfig()
  const {
    oppgaveId = oppgave?.oppgaveId,
    versjon = oppgave?.versjon,
    sakId = oppgave?.sakId,
    isOppgaveContext,
  } = useOppgaveContext()

  const { execute, state } = useActionState()

  const mutateOppgave = () => mutate(`/api/oppgaver/${oppgaveId}`)
  const mutateOppgaveOgSak = () => {
    if (sakId) {
      return Promise.all([mutateOppgave(), mutateSak(sakId)])
    }
    return mutateOppgave()
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

    state,
  }
}
