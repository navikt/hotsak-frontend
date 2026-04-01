import { useSWRConfig } from 'swr'

import { Actions, useActionState } from '../action/Actions.ts'
import { http } from '../io/HttpClient.ts'
import { mutateSak } from '../saksbilde/mutateSak.ts'
import type { NavIdent } from '../tilgang/Ansatt.ts'
import { useOppgaveContext } from './OppgaveContext.ts'
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
