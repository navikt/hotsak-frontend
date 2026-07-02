import { Actions, useActionState } from '../action/Actions.ts'
import { http } from '../io/HttpClient.ts'
import { mutateSak } from '../sak/useSak.ts'
import { useUmami } from '../sporing/useUmami.ts'
import { type NavIdent } from '../tilgang/Ansatt.ts'
import { mutateOppgavekommentarer } from './kommentar/useOppgavekommentarer.ts'
import { type OppgaveBase, type OppgaveId } from './oppgaveTypes.ts'
import { mutateOppgave } from './useOppgave.ts'

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
   * Endre oppgave.
   *
   * @param request
   */
  endreOppgave(request: EndreOppgaveRequest): Promise<void>

  /**
   * Merk oppgave som lest.
   */
  merkSomLest(): Promise<void>

  /**
   * Lagre en kommentar til oppgaven.
   *
   * @param tekst
   */
  lagreKommentar(tekst: string): Promise<void>
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
  const { logOppgaveKommentarLagret } = useUmami()
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

    async lagreKommentar(tekst: string) {
      return execute(async () => {
        await http.post(`/api/oppgaver/${oppgaveId}/kommentarer`, { tekst }, { versjon })
        if (isOppgaveContext) {
          await mutateOppgavekommentarer(oppgaveId)
          logOppgaveKommentarLagret()
        }
      })
    },

    state,
  }
}
