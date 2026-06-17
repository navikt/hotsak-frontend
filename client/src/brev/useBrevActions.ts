import useSWRMutation from 'swr/mutation'

import { useToast } from '../felleskomponenter/toast/useToast.ts'
import { http, type HttpAcceptKey } from '../io/HttpClient.ts'
import { type HttpError } from '../io/HttpError.ts'
import { SaksbehandlingsoppgaveBase } from '../oppgave/oppgaveTypes.ts'
import { useMutateBehandling } from '../sak/v2/behandling/useBehandling.ts'
import {
  type Brev,
  type Brevdata,
  type FerdigstillBrevutkastRequest,
  type OppdaterBrevutkastRequest,
  type OpprettBrevutkastRequest,
} from './brevTyper.ts'
import { brevKeyOf, useMutateBrevForSak, useMutateBrevPdf } from './useBrev.ts'

export function useBrevActions<T extends Brevdata = Brevdata>(oppgave?: SaksbehandlingsoppgaveBase, brevId?: string) {
  const { oppgaveId = '', versjon, sakId } = oppgave ?? {}

  const { showSuccessToast } = useToast()

  const mutateBrevPdf = useMutateBrevPdf()
  const mutateBehandling = useMutateBehandling()
  const mutateBrevForSak = useMutateBrevForSak()
  const mutateBehandlingOgBrevForSak = (sakId: string) =>
    Promise.all([mutateBehandling(sakId), mutateBrevForSak(sakId)])

  const brevForSakKey = sakId ? `/api/sak/${sakId}/brev` : null

  // todo -> flytt til useBrevForSak og bruk samme key
  const opprettBrevutkast = useSWRMutation<Brev<T>, HttpError, string | null, OpprettBrevutkastRequest>(
    brevForSakKey,
    (url, { arg: body }) => http.post<OpprettBrevutkastRequest, Brev<T>>(url, body, { versjon }),
    {
      async onSuccess(brev) {
        await mutateBehandlingOgBrevForSak(brev.sakId)
      },
    }
  )

  const brevKey = sakId && brevId ? brevKeyOf(sakId, brevId) : null

  const oppdaterBrevutkast = useSWRMutation<Brev<T>, HttpError, HttpAcceptKey | null, OppdaterBrevutkastRequest>(
    brevKey,
    ([url, accept], { arg: body }) => http.put<OppdaterBrevutkastRequest, Brev<T>>(url, body, { accept, versjon }),
    {
      async onSuccess(brev) {
        await mutateBrevForSak(brev.sakId)
      },
    }
  )

  const slettBrevutkast = useSWRMutation<void, HttpError, HttpAcceptKey | null>(
    brevKey,
    ([url]) => http.delete(url, { versjon }),
    {
      async onSuccess() {
        await mutateBehandlingOgBrevForSak(sakId!)
        showSuccessToast('Brevutkast slettet')
      },
    }
  )

  const forhåndsvisBrev = useSWRMutation<Blob, HttpError, HttpAcceptKey | null>(
    sakId && brevId ? brevKeyOf(sakId, brevId, 'application/pdf') : null,
    async ([url, accept]) => http.get<Blob>(url, { accept }),
    {
      async onSuccess() {},
    }
  )

  const ferdigstillBrevutkast = useSWRMutation<void, HttpError, HttpAcceptKey | null>(
    brevKey,
    async ([url]) => {
      await http.post<FerdigstillBrevutkastRequest>(`${url}/ferdigstilling`, { oppgaveId }, { versjon })
    },
    {
      async onSuccess() {
        await Promise.all([mutateBehandlingOgBrevForSak(sakId!), mutateBrevPdf(sakId!, brevId!)])
      },
    }
  )

  const redigerBrevutkast = useSWRMutation<void, HttpError, HttpAcceptKey | null>(
    brevKey,
    ([url]) => http.delete(`${url}/ferdigstilling`, { versjon }),
    {
      async onSuccess() {
        await mutateBehandlingOgBrevForSak(sakId!)
      },
    }
  )

  return {
    opprettBrevutkast,
    oppdaterBrevutkast,
    slettBrevutkast,
    forhåndsvisBrev,
    ferdigstillBrevutkast,
    redigerBrevutkast,
  }
}

export type UseBrevActionsResponse<T extends Brevdata = Brevdata> = ReturnType<typeof useBrevActions<T>>
