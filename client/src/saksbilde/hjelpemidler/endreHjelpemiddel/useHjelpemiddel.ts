import useSwr from 'swr'

import type { HttpError } from '../../../io/HttpError.ts'
import type { HjelpemiddelProdukt } from '../../../types/types.internal'

interface UseHjelpemiddelResponse {
  hjelpemiddel?: HjelpemiddelProdukt
  error?: HttpError
  isLoading: boolean
}

export function useHjelpemiddel(hmsnr?: string): UseHjelpemiddelResponse {
  // TODO kalle FinnHjelpemiddel for å hente hjelpemiddel her og eventuelt fallback til OeBS hvis ikke funnet i FinnHjelpemiddel
  const {
    data: hjelpemiddel,
    error,
    isLoading,
  } = useSwr<HjelpemiddelProdukt, HttpError>(hmsnr ? `/api/hjelpemiddel/${hmsnr}` : null)

  return {
    hjelpemiddel,
    error,
    isLoading,
  }
}
