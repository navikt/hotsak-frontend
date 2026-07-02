import useSWRImmutable from 'swr/immutable'

import { createUrl } from '../io/HttpClient.ts'
import type { KodeverkGjelder, OppgaveKodeverk } from './oppgaveTypes.ts'
import type { Stønadsklassifisering } from '../journalføring/journalføringTypes.ts'

export function useKodeverkStønadsklassifisering(): Stønadsklassifisering | undefined {
  const { data } = useSWRImmutable<Stønadsklassifisering>('/api/kodeverk/stonadsklassifisering')
  return data
}

export function useKodeverkBehandlingstyper(): ReadonlyArray<OppgaveKodeverk> {
  const { data } = useSWRImmutable<OppgaveKodeverk[]>('/api/kodeverk/behandlingstyper')
  return data ?? noData
}

export function useKodeverkGjelder(behandlingstype?: string): ReadonlyArray<KodeverkGjelder> {
  const url = createUrl('/api/kodeverk/gjelder', { behandlingstype })
  const { data } = useSWRImmutable<KodeverkGjelder[]>(url)
  return data ?? noData
}

// TODO preload
export function useKodeverkDokumenttitler(): string[] {
  const { data } = useSWRImmutable<string[]>('/api/kodeverk/dokumenttitler')
  return data ?? []
}

export function useKodeverkOppgavetype(): ReadonlyArray<OppgaveKodeverk> {
  const url = createUrl('/api/kodeverk/oppgavetype')
  const { data } = useSWRImmutable<OppgaveKodeverk[]>(url)
  return data ?? noData
}

const noData: ReadonlyArray<never> = []

export function harBehandlingstema(
  gjelder: KodeverkGjelder
): gjelder is KodeverkGjelder & { behandlingstema: OppgaveKodeverk } {
  return gjelder.behandlingstema != null
}

export function harBehandlingstype(
  gjelder: KodeverkGjelder
): gjelder is KodeverkGjelder & { behandlingstype: OppgaveKodeverk } {
  return gjelder.behandlingstype != null
}
