import { useCallback } from 'react'
import useSwr from 'swr'

import { http } from '../../io/HttpClient.ts'

export interface EndringsloggInnslag {
  id: string
  dato: string
  tittel: string
  innhold: string
  lest?: string
}

export type MerkSomLestCallback = (
  endringslogginnslagId: string
) => Promise<ReadonlyArray<EndringsloggInnslag> | undefined>

export function useEndringslogg(): {
  innslag: ReadonlyArray<EndringsloggInnslag>
  isLoading: boolean
  uleste: boolean
  fading: boolean
  merkSomLest: MerkSomLestCallback
} {
  const { data, mutate, isLoading } = useSwr<EndringsloggInnslag[]>('/api/endringslogg')
  const innslag = data ? data : []
  const uleste = innslag.some(({ lest }: EndringsloggInnslag) => !lest)
  const fading = !(isLoading || uleste)
  const merkSomLest = useCallback<MerkSomLestCallback>(
    async (endringslogginnslagId) => {
      await http.post('/api/endringslogg/leste', { endringslogginnslagId })
      return mutate()
    },
    [mutate]
  )
  return {
    innslag,
    isLoading,
    uleste,
    fading,
    merkSomLest,
  }
}
