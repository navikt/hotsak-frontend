import useSWRMutation from 'swr/mutation'

import { useToast } from '../felleskomponenter/toast/useToast.ts'
import type { Tilbakemelding } from '../innsikt/Besvarelse.ts'
import { http } from '../io/HttpClient.ts'
import type { HttpError } from '../io/HttpError.ts'
import { mutateSak } from '../sak/useSak.ts'
import { useUmami } from '../sporing/useUmami.ts'
import { type NavIdent } from '../tilgang/Ansatt.ts'
import { mutateOppgavekommentarer, mutateOppgavekommentarerForSak } from './kommentar/useOppgavekommentarer.ts'
import { type OppgaveBase } from './oppgaveTypes.ts'

export interface EndreOppgavetildelingRequest {
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
  const { logOppgaveLagtTilbake, logOppgaveKommentarLagret } = useUmami()
  const { showSuccessToast, showErrorToast } = useToast()

  const oppgaveKey = oppgave ? `/api/oppgaver/${oppgaveId}` : null

  const endreOppgavetildeling = useSWRMutation<void, HttpError, typeof oppgaveKey, EndreOppgavetildelingRequest>(
    oppgaveKey,
    (url, { arg: body }) => http.post(`${url}/tildeling`, body, { versjon }),
    {
      async onSuccess() {
        if (isOppgaveContext) {
          mutateSak(sakId)
        }
      },
    }
  )

  const fjernOppgavetildeling = useSWRMutation<void, HttpError, typeof oppgaveKey>(
    oppgaveKey,
    (url) => http.delete(`${url}/tildeling`, { versjon }),
    {
      async onSuccess() {
        logOppgaveLagtTilbake()
        showSuccessToast('Oppgaven ble lagt tilbake til felles oppgavekø')
        if (isOppgaveContext) {
          mutateSak(sakId)
        }
      },
    }
  )

  const endreOppgave = useSWRMutation<void, HttpError, typeof oppgaveKey, EndreOppgaveRequest>(
    oppgaveKey,
    (url, { arg: body }) => http.put(url, body, { versjon }),
    {
      async onSuccess() {
        if (isOppgaveContext) {
          mutateSak(sakId)
        }
      },
    }
  )

  const merkSomLest = useSWRMutation<void, HttpError, typeof oppgaveKey>(
    oppgaveKey,
    (url) => http.put(`${url}/leste`),
    {
      async onSuccess() {},
    }
  )

  const lagreKommentar = useSWRMutation<void, HttpError, typeof oppgaveKey, string>(
    oppgaveKey,
    (url, { arg: tekst }) =>
      http.post(
        `${url}/kommentarer`,
        {
          tekst,
        },
        { versjon }
      ),
    {
      async onSuccess() {
        logOppgaveKommentarLagret()
        showSuccessToast('Kommentaren ble lagret')
        if (isOppgaveContext) {
          const promises = [mutateOppgavekommentarer(oppgaveId)]
          if (sakId) {
            promises.push(mutateOppgavekommentarerForSak(sakId))
          }
          await Promise.all(promises)
        }
      },
    }
  )

  const overførOppgave = useSWRMutation<void, HttpError, typeof oppgaveKey, { tilbakemelding: Tilbakemelding }>(
    oppgaveKey,
    (url, { arg: body }) => http.post(`${url}/overforing`, body, { versjon }),
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
     */
    endreOppgavetildeling,

    /**
     * Fjern tildeling av oppgave. Setter behandlende saksbehandler til `null`.
     */
    fjernOppgavetildeling,

    /**
     * Endre oppgave.
     */
    endreOppgave,

    /**
     * Merk oppgave som lest.
     */
    merkSomLest,

    /**
     * Lagre en kommentar til oppgaven.
     */
    lagreKommentar,

    /**
     * Overfør oppgaven til behandling i Gosys.
     */
    overførOppgave,
  }
}
