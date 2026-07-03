import { useMemo } from 'react'
import useSWRImmutable from 'swr/immutable'

import { createUrl } from '../io/HttpClient.ts'
import type { KodeverkGjelder, OppgaveKodeverk } from './oppgaveTypes.ts'

export function useKodeverkBehandlingstyper(): ReadonlyArray<OppgaveKodeverk> {
  const { data } = useSWRImmutable<OppgaveKodeverk[]>('/api/kodeverk/behandlingstyper')
  return data ?? noData
}

export function useKodeverkGjelder(behandlingstype?: string): ReadonlyArray<KodeverkGjelder> {
  const url = createUrl('/api/kodeverk/gjelder', { behandlingstype })
  const { data } = useSWRImmutable<KodeverkGjelder[]>(url)
  return data ?? noData
}

export interface GjelderOption {
  label: string
  value: string
  /** Normalisert søketekst uten «|» for kryssfelt-søk (f.eks. «rullestol barn») */
  searchTerms: string
}

/**
 * Returnerer alle Gjelder-kombinasjoner som memoiserte {@link GjelderOption}-objekter,
 * sortert alfabetisk på behandlingstema og deretter behandlingstype.
 */
export function useGjelderOptions(): GjelderOption[] {
  const alleGjelder = useKodeverkGjelder()

  return useMemo(
    () =>
      alleGjelder
        .filter((gjelder) => gjelder.behandlingstema != null || gjelder.behandlingstype != null)
        .sort((a, b) => {
          const temasammenligning = (a.behandlingstema?.term ?? '').localeCompare(b.behandlingstema?.term ?? '', 'nb')
          if (temasammenligning !== 0) return temasammenligning
          return (a.behandlingstype?.term ?? '').localeCompare(b.behandlingstype?.term ?? '', 'nb')
        })
        .map((gjelder) => {
          const behandlingstema = gjelder.behandlingstema?.term ?? ''
          const behandlingstype = gjelder.behandlingstype?.term ?? ''
          const label =
            behandlingstema && behandlingstype
              ? `${behandlingstema} | ${behandlingstype}`
              : behandlingstema || behandlingstype
          return {
            label,
            value: `${gjelder.behandlingstema?.kode ?? ''}|${gjelder.behandlingstype?.kode ?? ''}`,
            searchTerms: `${behandlingstema} ${behandlingstype}`.toLowerCase().trim(),
          }
        }),
    [alleGjelder]
  )
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
