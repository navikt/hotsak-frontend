import useSwr from 'swr'
import type { Notat } from '../../../types/types.internal'

export function useSaksnotater(sakId?: string) {
  const { data: notater, mutate, isLoading } = useSwr<Notat[]>(sakId ? `/api/sak/${sakId}/notater` : null)
  return {
    notater,
    mutate,
    isLoading,
  }
}
