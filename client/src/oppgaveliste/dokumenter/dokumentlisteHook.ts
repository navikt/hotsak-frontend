import useSwr from 'swr'

import { httpGet } from '../../io/http'

import {
  DokumentOppgave,
  OmrådeFilter,
  Oppgave,
  OppgaveStatusType,
  SakerFilter,
  SakstypeFilter,
} from '../../types/types.internal'

interface DataResponse {
  dokumenter: DokumentOppgave[]
  totalCount: number
  isLoading: boolean
  error: unknown
  mutate: (...args: any[]) => any
}

const basePath = 'api/dokumenter'

export function useDokumentListe(): DataResponse {
  const { data, error, mutate } = useSwr<{ data: DokumentOppgave[] }>(basePath, httpGet, { refreshInterval: 10000 })

  // Avventer å legge inn dette til vi ser om vi trenger filter, paging osv
  /*useEffect(() => {
    logAmplitudeEvent(amplitude_taxonomy.DOKUMENTLISTE_OPPDATERT, {
      currentPage,
      ...sort,
      ...filters,
    })
  }, [currentPage, sort, filters])*/

  return {
    dokumenter: data?.data || [],
    totalCount: data?.data.length || 0,
    isLoading: !error && !data,
    error,
    mutate,
  }
}
