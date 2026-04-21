import useSWRImmutable from 'swr/immutable'
import type { SetRequired } from 'type-fest'

import { createUrl } from '../io/HttpClient.ts'
import type { KodeverkGjelder, OppgaveKodeverk } from './oppgaveTypes.ts'

export function useKodeverkGjelder(behandlingstype?: string): ReadonlyArray<KodeverkGjelder> {
  const url = createUrl('/api/kodeverk/gjelder', { behandlingstype })
  const { data } = useSWRImmutable<KodeverkGjelder[]>(url)
  return data ?? noData
}

export function useKodeverkOppgavetype(): ReadonlyArray<OppgaveKodeverk> {
  const url = createUrl('/api/kodeverk/oppgavetype')
  const { data } = useSWRImmutable<OppgaveKodeverk[]>(url)
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
