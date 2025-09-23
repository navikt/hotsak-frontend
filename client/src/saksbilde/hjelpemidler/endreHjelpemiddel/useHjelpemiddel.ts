import useSwr from 'swr'

import type { HttpError } from '../../../io/HttpError.ts'
import type { HjelpemiddelProdukt } from '../../../types/types.internal'
import { useHjelpemiddelprodukt } from '../useHjelpemiddelprodukter.ts'
import { useMemo } from 'react'

interface UseHjelpemiddelResponse {
  hjelpemiddel?: HjelpemiddelData
  error?: HttpError
  isLoading: boolean
}

export interface HjelpemiddelData {
  hmsnr: string
  navn: string
  kilde: 'FinnHjelpemiddel' | 'OeBS'
  produktbildeUri?: string
  leverandør?: string
}

export function useHjelpemiddel(hmsnr?: string): UseHjelpemiddelResponse {
  const { data: grunndataProdukt, isLoading: grunndataLoading } = useHjelpemiddelprodukt(hmsnr)

  const {
    data: oebsProdukt,
    error,
    isLoading: oebsLoading,
  } = useSwr<HjelpemiddelProdukt, HttpError>(
    !grunndataProdukt && hmsnr?.length === 6 ? `/api/hjelpemiddel/${hmsnr}` : null
  )

  const hjelpemiddel = useMemo((): HjelpemiddelData | undefined => {
    if (grunndataProdukt) {
      return {
        hmsnr: grunndataProdukt.hmsnr,
        navn: grunndataProdukt.artikkelnavn,
        kilde: 'FinnHjelpemiddel',
        produktbildeUri: grunndataProdukt.produktbildeUri,
        leverandør: grunndataProdukt.leverandør,
      }
    }

    if (oebsProdukt) {
      return {
        hmsnr: oebsProdukt.hmsnr,
        navn: oebsProdukt.navn,
        kilde: 'OeBS',
      }
    }

    return undefined
  }, [grunndataProdukt, oebsProdukt])

  const isLoading = grunndataLoading || (oebsLoading && !grunndataProdukt)

  return {
    hjelpemiddel,
    error,
    isLoading,
  }
}
