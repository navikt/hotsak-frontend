import { useCallback, useMemo } from 'react'
import useSWR, { preload, useSWRConfig, type MutatorCallback, type MutatorOptions } from 'swr'

import { http, type HttpAccept, type HttpAcceptKey } from '../io/HttpClient'
import { type HttpError } from '../io/HttpError'
import { useSakId } from '../saksbilde/useSak'
import { and, type Predicate } from '../utils/predicate'
import { isBrevstatusUtkast } from './brevSelectors'
import { type Brev, type Brevdata, type BrevForSak } from './brevTyper'

/**
 * Tar med accept i key slik at JSON- og PDF-versjon får hver sin cache.
 */
export function brevKeyOf(sakId: string, brevId: string, accept: HttpAccept = 'application/json'): HttpAcceptKey {
  return [`/api/sak/${sakId}/brev/${brevId}`, accept]
}

export function useBrev<T extends Brevdata = Brevdata>(brevId?: string) {
  const sakId = useSakId()
  const { data: brev, ...rest } = useSWR<Brev<T>, HttpError, HttpAcceptKey | null>(
    sakId && brevId ? brevKeyOf(sakId, brevId) : null
  )
  return { brev, ...rest }
}

export function useBrevPdf(brevId?: string) {
  const sakId = useSakId()
  const { data: brev, ...rest } = useSWR<Blob, HttpError, HttpAcceptKey | null>(
    sakId && brevId ? brevKeyOf(sakId, brevId, 'application/pdf') : null,
    {
      revalidateOnFocus: false,
    }
  )
  return { brev, ...rest }
}

export function useBrevForSak(sakId?: string) {
  const mutateBrev = useMutateBrev()

  const key = sakId ? `/api/sak/${sakId}/brev` : null

  const { data: brevForSak, ...rest } = useSWR<BrevForSak, HttpError, string | null>(key, async (url: string) => {
    const brevForSak = await http.get<BrevForSak>(url)
    // prepopuler cache for hvert brev i saken
    await Promise.all(brevForSak.brev.map((brev) => mutateBrev(sakId!, brev.brevId, brev, { revalidate: false })))
    return brevForSak
  })

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
  return preload<Brev<T>, HttpAcceptKey>(brevKeyOf(sakId, brevId), http.get)
}

export function preloadBrevPdf(sakId: string, brevId: string) {
  return preload<Blob, HttpAcceptKey>(brevKeyOf(sakId, brevId, 'application/pdf'), http.get)
}

export function useMutateBrev<T extends Brevdata = Brevdata>() {
  const { mutate } = useSWRConfig()
  return (
    sakId: string,
    brevId: string,
    brev?: Brev<T> | MutatorCallback<Brev<T>>,
    options?: MutatorOptions<Brev<T>>
  ) => mutate<Brev<T>>(brevKeyOf(sakId, brevId), brev, options)
}

export function useMutateBrevPdf() {
  const { mutate } = useSWRConfig()
  return (sakId: string, brevId: string) => mutate<Blob>(brevKeyOf(sakId, brevId, 'application/pdf'))
}

export function useMutateBrevForSak() {
  const { mutate } = useSWRConfig()
  return (sakId: string) => mutate<BrevForSak>(`/api/sak/${sakId}/brev`)
}
