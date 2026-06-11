import { useSWRConfig } from 'swr'
import useSWRMutation from 'swr/mutation'

import { useActionState } from '../../../action/Actions.ts'
import { mutateBrevForSak } from '../../../brev/useBrev.ts'
import { useToast } from '../../../felleskomponenter/toast/useToast.ts'
import { http } from '../../../io/HttpClient.ts'
import { HttpError } from '../../../io/HttpError.ts'
import { useOppgave } from '../../../oppgave/useOppgave.ts'
import { mutateSak } from '../../../saksbilde/mutateSak.ts'
import { Behandlingsutfall, LagreBehandlingRequest } from './behandlingTyper.ts'
import { useBehandling } from './useBehandling.ts'

export function useBehandlingActions() {
  const { oppgave, mutate: mutateOppgave } = useOppgave()
  const { oppgaveId, versjon, sakId } = oppgave ?? {}
  const { gjeldendeBehandling, mutate: mutateBehandling } = useBehandling()
  const { showSuccessToast } = useToast()
  const { execute, state } = useActionState()
  const { mutate } = useSWRConfig()

  const mutateOppgaveOgSak = () => Promise.all([mutateOppgave(), mutateSak(sakId)])

  // TODO: Håndtere feil i onError
  const opprettOgferdigstillBestillingBehandling = useSWRMutation<
    Behandlingsutfall,
    HttpError,
    string | null,
    LagreBehandlingRequest
  >(
    `/api/sak/${sakId}/behandling`,
    (url, { arg: body }) => http.post<LagreBehandlingRequest, Behandlingsutfall>(url, body),
    {
      async onSuccess() {
        await mutateOppgaveOgSak()
        showSuccessToast('Endringene ble lagret')
      },
    }
  )

  return {
    opprettOgferdigstillBestillingBehandling,
    async lagreBehandling(utfall?: Behandlingsutfall): Promise<void> {
      if (gjeldendeBehandling) {
        const behandlingId = gjeldendeBehandling.behandlingId
        return execute(async () => {
          await http.put(`/api/sak/${sakId}/behandling/${behandlingId}`, { utfall })
          await mutateBehandling()
          mutate(`/api/sak/${sakId}/serviceforesporsel`)
        })
      }
      return execute(async () => {
        await http.post(`/api/sak/${sakId}/behandling`, { utfall, oppgaveId })
        await mutateBehandling()
      })
    },
    async ferdigstillBehandling({
      problemsammendrag,
      postbegrunnelse,
      utleveringMerknad,
    }: {
      problemsammendrag?: string
      postbegrunnelse?: string
      utleveringMerknad?: string
    }) {
      return execute(async () => {
        await http.post(
          `/api/sak/${sakId}/behandling/${gjeldendeBehandling?.behandlingId}/ferdigstilling`,
          { problemsammendrag, postbegrunnelse, utleveringMerknad },
          { versjon }
        )
        await mutateBehandling()
        await mutateOppgaveOgSak()
        await mutateBrevForSak(sakId!)
      })
    },
    state,
  }
}
