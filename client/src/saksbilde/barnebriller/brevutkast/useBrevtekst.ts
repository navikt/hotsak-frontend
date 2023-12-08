import useSWR from 'swr'
import { BrevTekst, Brevtype } from '../../../types/types.internal'

export function useBrevtekst(sakId: string, brevtype: Brevtype) {
  const { data, isLoading, mutate } = useSWR<BrevTekst>(`/api/sak/${sakId}/brevutkast/${brevtype}`)

  return {
    data,
    isLoading,
    mutate,
  }
}
