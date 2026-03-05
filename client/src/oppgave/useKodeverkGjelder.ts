import useSWR from 'swr'

import { createUrl } from '../io/HttpClient.ts'
import type { OppgaveKodeverk } from './oppgaveTypes.ts'

export interface KodeverkGjelder {
  behandlingstema?: OppgaveKodeverk
  behandlingstype?: OppgaveKodeverk
}

export function useKodeverkGjelder(behandlingstype?: string): ReadonlyArray<KodeverkGjelder> {
  const url = createUrl('/api/kodeverk/gjelder', { behandlingstype })
  const { data } = useSWR<KodeverkGjelder[]>(url)
  return data ?? noData
}

export function useKodeverkOppgavetype(behandlingstype?: string): ReadonlyArray<OppgaveKodeverk> {
  const url = createUrl('/api/kodeverk/oppgavetype', { behandlingstype })
  const { data } = useSWR<OppgaveKodeverk[]>(url)
  return data ?? noData
}

const noData: ReadonlyArray<never> = []
