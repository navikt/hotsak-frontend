import useSwr from 'swr'
import type { Saksbehandler } from '../types/types.internal.ts'

export interface Saksbehandlere {
  saksbehandlere: Saksbehandler[]
}

export function useSaksbehandlere(): Saksbehandlere {
  const { data, error } = useSwr<{ saksbehandlere: Saksbehandler[] }>('/api/saksbehandlere')
  if (error) {
    return { saksbehandlere: [] }
  }
  return {
    saksbehandlere: data?.saksbehandlere ?? [],
  }
}
