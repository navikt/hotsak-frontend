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

interface HjelpemiddelData {
  hmsnr: string
  navn: string
  kilde: 'finnhjelpemiddel' | 'oebs'
  produktbildeUri?: string
  leverandør?: string
}

export function useHjelpemiddel(hmsnr?: string): UseHjelpemiddelResponse {
  const grunndataProdukt = useHjelpemiddelprodukt(hmsnr)

  // TODO kalle FinnHjelpemiddel for å hente hjelpemiddel her og eventuelt fallback til OeBS hvis ikke funnet i FinnHjelpemiddel
  const {
    data: oebsProdukt,
    error,
    isLoading,
  } = useSwr<HjelpemiddelProdukt, HttpError>(
    !grunndataProdukt && hmsnr?.length === 6 ? `/api/hjelpemiddel/${hmsnr}` : null
  )

  const hjelpemiddel = useMemo((): HjelpemiddelData | undefined => {
    if (grunndataProdukt) {
      return {
        hmsnr: grunndataProdukt.hmsnr,
        navn: grunndataProdukt.artikkelnavn,
        kilde: 'finnhjelpemiddel',
        produktbildeUri: grunndataProdukt.produktbildeUri,
        leverandør: grunndataProdukt.leverandør,
      }
    }

    if (oebsProdukt) {
      return {
        hmsnr: oebsProdukt.hmsnr,
        navn: oebsProdukt.navn,
        kilde: 'oebs',
      }
    }

    return undefined
  }, [grunndataProdukt, oebsProdukt])

  return {
    hjelpemiddel,
    error,
    isLoading,
  }
}
