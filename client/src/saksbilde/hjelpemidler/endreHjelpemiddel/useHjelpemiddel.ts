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
  hmsArtNr: string
  artikkelnavn: string
  kilde: 'FinnHjelpemiddel' | 'OeBS'
  produktbildeUri?: string
  leverandør?: string
}

export function useHjelpemiddel(hmsnr?: string): UseHjelpemiddelResponse {
  const { data: grunndataProdukt, isLoading: grunndataLoading } = useHjelpemiddelprodukt(hmsnr)

  const {
    data: oebsProdukter,
    error,
    isLoading: oebsLoading,
  } = useSwr<HjelpemiddelProdukt[], HttpError>(
    !grunndataProdukt && hmsnr?.length === 6 ? `/api/hjelpemiddel/${hmsnr}` : null
  )

  const hjelpemiddel = useMemo((): HjelpemiddelData | undefined => {
    if (grunndataProdukt) {
      return {
        hmsArtNr: grunndataProdukt.hmsArtNr,
        artikkelnavn: grunndataProdukt.artikkelnavn,
        kilde: 'FinnHjelpemiddel',
        produktbildeUri: grunndataProdukt.produktbildeUri,
        leverandør: grunndataProdukt.leverandør,
      }
    }

    if (oebsProdukter && oebsProdukter.length > 0) {
      const produkt = oebsProdukter[0]
      return {
        hmsArtNr: produkt.hmsnr,
        artikkelnavn: produkt.navn,
        kilde: 'OeBS',
      }
    }

    return undefined
  }, [grunndataProdukt, oebsProdukter])

  const isLoading = grunndataLoading || (oebsLoading && !grunndataProdukt)
  console.log('Hjelpemiddel ble', hjelpemiddel)
  return {
    hjelpemiddel,
    error,
    isLoading,
  }
}
