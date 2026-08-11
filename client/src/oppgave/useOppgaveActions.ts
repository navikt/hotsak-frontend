import useSWRMutation from 'swr/mutation'

import { useActionState } from '../action/Actions.ts'
import { useToast } from '../felleskomponenter/toast/useToast.ts'
import type { Tilbakemelding } from '../innsikt/Besvarelse.ts'
import { http } from '../io/HttpClient.ts'
import type { HttpError } from '../io/HttpError.ts'
import { mutateSak } from '../sak/useSak.ts'
import { useUmami } from '../sporing/useUmami.ts'
import { type NavIdent } from '../tilgang/Ansatt.ts'
import { mutateOppgavekommentarer, mutateOppgavekommentarerForSak } from './kommentar/useOppgavekommentarer.ts'
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

export interface EndreOppgaveRequest {
  behandlingstema?: string
  aktivDato?: string
  fristFerdigstillelse?: string
  kommentar?: string
}

/**
 * TODO
 *
 * @param oppgave
 * @param isOppgaveContext
 */
export function useOppgaveActions(oppgave: OppgaveBase, isOppgaveContext = true) {
  const { oppgaveId, versjon, sakId } = oppgave
  const { execute, state } = useActionState()
  const { logOppgaveKommentarLagret } = useUmami()
  const { showSuccessToast, showErrorToast } = useToast()
  const mutateOppgaveOgSak = () => {
    if (sakId) {
      return Promise.all([mutateOppgave(oppgaveId), mutateSak(sakId)])
    }
    return mutateOppgave(oppgaveId)
  }

  const oppgaveKey = oppgave ? `/api/oppgaver/${oppgaveId}` : null

  const overførOppgave = useSWRMutation<void, HttpError, string | null, { tilbakemelding: Tilbakemelding }>(
    oppgaveKey,
    (url, { arg }) =>
      http.post(
        `${url}/overforing`,
        {
          ...arg,
          oppgaveId,
        },
        { versjon }
      ),
    {
      async onSuccess() {
        showSuccessToast('Oppgaven ble overført til Gosys')
      },
      async onError() {
        showErrorToast('Oppgaven ble ikke overført til Gosys')
      },
    }
  )

  return {
    /**
     * Endre tildeling av oppgave. Støtter også overtagelse av oppgave.
     *
     * @param request
     */
    async endreOppgavetildeling(request: Omit<EndreOppgavetildelingRequest, 'oppgaveId'>): Promise<void> {
      return execute(async () => {
        await http.post(`/api/oppgaver/${oppgaveId}/tildeling`, request, {
          versjon,
        })
        if (isOppgaveContext) {
          await mutateOppgaveOgSak()
        }
      })
    },

    /**
     * Fjern tildeling av oppgave/sak. Setter behandlende saksbehandler til `null`.
     */
    async fjernOppgavetildeling(): Promise<void> {
      return execute(async () => {
        await http.delete(`/api/oppgaver/${oppgaveId}/tildeling`, {
          versjon,
        })
        if (isOppgaveContext) {
          await mutateOppgaveOgSak()
        }
      })
    },

    /**
     * Endre oppgave.
     *
     * @param request
     */
    async endreOppgave(request: EndreOppgaveRequest): Promise<void> {
      return execute(async () => {
        await http.put(`/api/oppgaver/${oppgaveId}`, request, {
          versjon,
        })
        if (isOppgaveContext) {
          await mutateOppgaveOgSak()
        }
      })
    },

    /**
     * Merk oppgave som lest.
     */
    async merkSomLest(): Promise<void> {
      return execute(() => http.put(`/api/oppgaver/${oppgaveId}/leste`))
    },

    /**
     * Lagre en kommentar til oppgaven.
     *
     * @param tekst
     */
    async lagreKommentar(tekst: string): Promise<void> {
      return execute(async () => {
        await http.post(`/api/oppgaver/${oppgaveId}/kommentarer`, { tekst }, { versjon })
        if (isOppgaveContext) {
          const promises = [mutateOppgavekommentarer(oppgaveId)]
          if (sakId) {
            promises.push(mutateOppgavekommentarerForSak(sakId))
          }
          await Promise.all(promises)
          logOppgaveKommentarLagret()
        }
      })
    },

    /**
     * Overfør oppgaven til behandling i Gosys.
     */
    overførOppgave,

    state,
  }
}
