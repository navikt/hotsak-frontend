import useSWRMutation from 'swr/mutation'

import { useToast } from '../felleskomponenter/toast/useToast.ts'
import { http } from '../io/HttpClient.ts'
import { type HttpError } from '../io/HttpError.ts'
import { type SaksbehandlingsoppgaveBase } from '../oppgave/oppgaveTypes.ts'
import { mutateBehandling } from '../sak/v2/behandling/useBehandling.ts'
import {
  Brevstatus,
  type Brev,
  type Brevdata,
  type FerdigstillBrevutkastRequest,
  type OppdaterBrevutkastRequest,
  type OpprettBrevutkastRequest,
} from './brevTyper.ts'
import { brevKeyOf, mutateBrev, mutateBrevForSak, type BrevKey } from './useBrev.ts'

export function useBrevActions<T extends Brevdata = Brevdata>(oppgave?: SaksbehandlingsoppgaveBase, brevId?: string) {
  const { oppgaveId = '', versjon, sakId } = oppgave ?? {}

  const { showSuccessToast } = useToast()

  const brevForSakKey = sakId ? `/api/sak/${sakId}/brev` : null

  const opprettBrevutkast = useSWRMutation<Brev<T>, HttpError, string | null, OpprettBrevutkastRequest>(
    brevForSakKey,
    (url, { arg: body }) => http.post<OpprettBrevutkastRequest, Brev<T>>(url, body, { versjon }),
    {
      async onSuccess() {
        await mutateBehandling(sakId!)
      },
    }
  )

  const brevKey = sakId && brevId ? brevKeyOf(sakId, brevId) : null

  const oppdaterBrevutkast = useSWRMutation<Brev<T>, HttpError, BrevKey | null, OppdaterBrevutkastRequest>(
    brevKey,
    ([url, accept], { arg: body }) => http.put<OppdaterBrevutkastRequest, Brev<T>>(url, body, { accept, versjon })
  )

  const slettBrevutkast = useSWRMutation<void, HttpError, BrevKey | null>(
    brevKey,
    ([url]) => http.delete(url, { versjon }),
    {
      async onSuccess() {
        await mutateBehandlingOgBrevForSak(sakId!)
        showSuccessToast('Brevutkast slettet')
      },
    }
  )

  // todo -> test ut å bruke samme key som brev
  const ferdigstillingKey = sakId && brevId ? `/api/sak/${sakId}/brev/${brevId}/ferdigstilling` : null

  const ferdigstillBrevutkast = useSWRMutation<void, HttpError, string | null>(
    ferdigstillingKey,
    async (url) => {
      await http.post<FerdigstillBrevutkastRequest>(url, { oppgaveId }, { versjon })
    },
    {
      async onSuccess() {
        await mutateBehandlingOgBrevForSak(sakId!)
        await mutateBrev(sakId!, brevId!, (it) => {
          if (!it) return it
          return {
            ...it,
            ferdigstilt: new Date().toISOString(),
            status: Brevstatus.FERDIGSTILT,
          }
        })
      },
    }
  )

  const redigerBrevutkast = useSWRMutation<void, HttpError, string | null>(
    ferdigstillingKey,
    (url) => http.delete(url, { versjon }),
    {
      async onSuccess() {
        await mutateBehandlingOgBrevForSak(sakId!)
        await mutateBrev(sakId!, brevId!, (it) => {
          if (!it) return it
          return {
            ...it,
            ferdigstilt: undefined,
            ferdigstiltAv: undefined,
            status: Brevstatus.UTKAST,
          }
        })
      },
    }
  )

  return {
    opprettBrevutkast,
    oppdaterBrevutkast,
    slettBrevutkast,
    ferdigstillBrevutkast,
    redigerBrevutkast,
  }
}

function mutateBehandlingOgBrevForSak(sakId: string) {
  return Promise.all([mutateBehandling(sakId), mutateBrevForSak(sakId)])
}
