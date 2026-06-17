import { useSWRConfig } from 'swr'
import useSWRMutation from 'swr/mutation'
import { useActionState } from '../../../action/Actions.ts'
import { useToast } from '../../../felleskomponenter/toast/useToast.ts'
import { http } from '../../../io/HttpClient.ts'
import { HttpError } from '../../../io/HttpError.ts'
import { useOppgave } from '../../../oppgave/useOppgave.ts'
import { mutateSak } from '../../../saksbilde/mutateSak.ts'
import {
  Behandling,
  Behandlingsutfall,
  Bestillingsresultat,
  isBehandlingsutfallBestilling,
  isBehandlingsutfallVedtak,
  LagreBehandlingRequest,
  VedtaksResultat,
} from './behandlingTyper.ts'
import { useBehandling } from './useBehandling.ts'
import { useMutateBrevForSak } from '../../../brev/useBrev.ts'

function lagUtfallToastTekst(utfall: Behandlingsutfall | undefined): string {
  if (isBehandlingsutfallBestilling(utfall)) {
    return utfall.utfall === Bestillingsresultat.GODKJENT ? 'Bestillingen ble godkjent' : 'Bestillingen ble avvist'
  }
  if (isBehandlingsutfallVedtak(utfall)) {
    switch (utfall.utfall) {
      case VedtaksResultat.INNVILGET:
        return 'Søknaden ble innvilget'
      case VedtaksResultat.AVSLÅTT:
        return 'Søknaden ble avslått'
      case VedtaksResultat.DELVIS_INNVILGET:
        return 'Søknaden ble delvis innvilget'
    }
  }
  return 'Behandlingen ble lagret'
}

export function useBehandlingActions() {
  const { oppgave, mutate: mutateOppgave } = useOppgave()
  const { oppgaveId, versjon, sakId } = oppgave ?? {}
  const { gjeldendeBehandling, mutate: mutateBehandling } = useBehandling()
  const { showSuccessToast } = useToast()
  const { execute, state } = useActionState()
  const { mutate } = useSWRConfig()
  const mutateBrevForSak = useMutateBrevForSak()

  const mutateOppgaveOgSak = () => Promise.all([mutateOppgave(), mutateSak(sakId)])

  // TODO: Håndtere feil i onError
  // TODO Bruke swr mutate for alle funksjoner her og gjenbruke lagUtfallToastTekst
  const opprettOgferdigstillBestillingBehandling = useSWRMutation<
    Behandling,
    HttpError,
    string | null,
    LagreBehandlingRequest
  >(
    `/api/sak/${sakId}/behandling`,
    (url, { arg: body }) => http.post<LagreBehandlingRequest, Behandling>(url, body, { versjon }),
    {
      async onSuccess(data) {
        await mutateOppgaveOgSak()

        showSuccessToast(lagUtfallToastTekst(data.utfall))
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
        await Promise.all([mutateBehandling(), mutateOppgaveOgSak(), mutateBrevForSak(sakId!)])
      })
    },
    state,
  }
}
