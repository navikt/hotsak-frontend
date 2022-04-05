import { RefObject, useCallback, useEffect, useRef, useState } from 'react'
import useSwr from 'swr'
import { httpGet, postEndringslogginnslagLest } from '../io/http'
import { amplitude_taxonomy, logAmplitudeEvent } from '../utils/amplitude'

export interface EndringsloggInnslag {
  id: string
  dato: string
  tittel: string
  innhold: string
  lest?: string
}

export type MerkSomLestCallback = (
  endringslogginnslagId: string
) => Promise<{ data: ReadonlyArray<EndringsloggInnslag> } | undefined>

export function useEndringslogg(): {
  innslag: ReadonlyArray<EndringsloggInnslag>
  loading: boolean
  uleste: boolean
  fading: boolean
  merkSomLest: MerkSomLestCallback
} {
  const { data, error, mutate } = useSwr<{ data: ReadonlyArray<EndringsloggInnslag> }>('api/endringslogg', httpGet, {
    refreshInterval: 10000,
  })
  const innslag: ReadonlyArray<EndringsloggInnslag> = data ? data.data : []
  const loading = !data && !error
  const uleste = innslag.some(({ lest }: EndringsloggInnslag) => !lest)
  const fading = !(loading || uleste)
  const merkSomLest = useCallback<MerkSomLestCallback>(
    (endringslogginnslagId) => {
      logAmplitudeEvent(amplitude_taxonomy.ENDRINGSLOGGINNSLAG_LEST, { endringslogginnslagId })
      return postEndringslogginnslagLest(endringslogginnslagId).then(() => {
        return mutate()
      })
    },
    [mutate]
  )
  return {
    innslag,
    loading,
    uleste,
    fading,
    merkSomLest,
  }
}

export default function useOnScreen(ref: RefObject<HTMLElement>) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [isOnScreen, setIsOnScreen] = useState(false)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(([entry]) => setIsOnScreen(entry.isIntersecting), {
      threshold: 1.0,
    })
  }, [])

  useEffect(() => {
    if (observerRef && observerRef.current && ref.current) {
      observerRef.current.observe(ref.current)
    }
    return () => {
      if (observerRef && observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [ref])

  return isOnScreen
}
