import useSWR from 'swr'

import { createUrl } from '../io/HttpClient.ts'
import type { KodeverkGjelder, OppgaveKodeverk } from './oppgaveTypes.ts'
import type { SetRequired } from 'type-fest'

export function useKodeverkGjelder(behandlingstype?: string): ReadonlyArray<KodeverkGjelder> {
  const url = createUrl('/api/kodeverk/gjelder', { behandlingstype })
  const { data } = useSWR<KodeverkGjelder[]>(url)
  return data ?? noData
}

export function useKodeverkOppgavetype(): ReadonlyArray<OppgaveKodeverk> {
  const url = createUrl('/api/kodeverk/oppgavetype')
  const { data } = useSWR<OppgaveKodeverk[]>(url)
  return data ?? noData
}

const noData: ReadonlyArray<never> = []

export function harBehandlingstema(
  gjelder: KodeverkGjelder
): gjelder is SetRequired<KodeverkGjelder, 'behandlingstema'> {
  return gjelder.behandlingstema != null
}

export function harBehandlingstype(
  gjelder: KodeverkGjelder
): gjelder is SetRequired<KodeverkGjelder, 'behandlingstype'> {
  return gjelder.behandlingstype != null
}
