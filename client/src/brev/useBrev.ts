import { useCallback, useMemo } from 'react'
import useSWR, { mutate, type MutatorCallback, type MutatorOptions, preload } from 'swr'

import { http, type RequestOptions } from '../io/HttpClient'
import { type HttpError } from '../io/HttpError'
import { useSakId } from '../saksbilde/useSak'
import { and, type Predicate } from '../utils/predicate'
import { isBrevstatusUtkast } from './brevSelectors'
import { type Brev, type Brevdata, type BrevForSak } from './brevTyper'

export type BrevKey = [string, RequestOptions['accept']]

/**
 * Tar med accept i key slik at JSON- og PDF-versjon får hver sin cache.
 */
export function brevKeyOf(
  sakId: string,
  brevId: string,
  accept: RequestOptions['accept'] = 'application/json'
): BrevKey {
  return [`/api/sak/${sakId}/brev/${brevId}`, accept]
}

async function brevFetcher<T>([url, accept]: BrevKey): Promise<T> {
  return await http.get<T>(url, { accept })
}

async function brevUrlFetcher([url, accept]: BrevKey): Promise<string> {
  const data = await http.get<Blob>(url, { accept })
  return window.URL.createObjectURL(data)
}

export function useBrev<T extends Brevdata = Brevdata>(brevId?: string) {
  const sakId = useSakId()
  const { data: brev, ...rest } = useSWR<Brev<T>, HttpError, BrevKey | null>(
    sakId && brevId ? brevKeyOf(sakId, brevId, 'application/json') : null,
    brevFetcher
  )
  return { brev, ...rest }
}

export function useBrevUrl(brevId?: string) {
  const sakId = useSakId()
  const { data: brev, ...rest } = useSWR<string, HttpError, BrevKey | null>(
    sakId && brevId ? brevKeyOf(sakId, brevId, 'application/pdf') : null,
    brevUrlFetcher,
    {
      revalidateOnFocus: false,
    }
  )
  return { brev, ...rest }
}

export function useBrevForSak(sakId?: string) {
  const { data: brevForSak, ...rest } = useSWR<BrevForSak, HttpError, string | null>(
    sakId ? `/api/sak/${sakId}/brev` : null,
    async (url: string) => {
      const brevForSak = await http.get<BrevForSak>(url)
      // prepopuler cache for hvert brev i saken
      await Promise.all(brevForSak.brev.map((brev) => mutateBrev(sakId!, brev.brevId, brev, { revalidate: false })))
      return brevForSak
    }
  )

  const harBrev = useMemo(() => {
    if (!brevForSak) return
    return brevForSak.brev.length > 0
  }, [brevForSak])

  const harBrevutkast = useMemo(() => {
    if (!brevForSak) return
    return brevForSak.brev.some(isBrevstatusUtkast)
  }, [brevForSak])

  const finnBrev = useCallback(
    <T extends Brevdata = Brevdata>(...predicates: Predicate<Brev>[]): Brev<T> | undefined => {
      if (!brevForSak) return
      return brevForSak.brev.find(and(...predicates)) as Brev<T> | undefined
    },
    [brevForSak]
  )

  return { brevForSak, harBrev, harBrevutkast, finnBrev, ...rest }
}

export function preloadBrev<T extends Brevdata = Brevdata>(sakId: string, brevId: string) {
  return preload<Brev<T>, BrevKey>(brevKeyOf(sakId, brevId, 'application/json'), brevFetcher)
}

export function preloadBrevUrl(sakId: string, brevId: string) {
  return preload<string, BrevKey>(brevKeyOf(sakId, brevId, 'application/pdf'), brevUrlFetcher)
}

export function mutateBrev<T extends Brevdata = Brevdata>(
  sakId: string,
  brevId: string,
  brev?: Brev<T> | MutatorCallback<Brev<T>>,
  options?: MutatorOptions<Brev<T>>
) {
  return mutate<Brev<T>>(brevKeyOf(sakId, brevId, 'application/json'), brev, options)
}

export function mutateBrevUrl(sakId: string, brevId: string) {
  return mutate<string>(brevKeyOf(sakId, brevId, 'application/pdf'))
}

export function mutateBrevForSak(sakId: string) {
  return mutate<BrevForSak>(`/api/sak/${sakId}/brev`)
}
