import { useState } from 'react'
import { toError } from '../utils/error.ts'

export interface Service {
  /**
   * Holder på tilstand inkludert evt. `error`.
   */
  state: ServiceState
}

export interface ServiceState {
  loading: boolean
  error?: Error | null
}

export function useServiceState() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const state: ServiceState = {
    loading,
    error,
  }

  return {
    setLoading,

    /**
     * @param err som blir oversatt til `Error` hvis ikke den ikke er det alt.
     */
    setError(err: unknown) {
      setError(toError(err))
    },

    /**
     * Funksjon som kan brukes til kjøre et asynkront kall med håndtering av `loading` og `error`.
     */
    async execute<T = unknown>(action: () => Promise<T>): Promise<T | undefined> {
      setLoading(true)
      try {
        return await action()
      } catch (err: unknown) {
        setError(toError(err))
      } finally {
        setLoading(false)
      }
    },

    /**
     * Holder på tilstand og evt. `Error`.
     */
    state,
  }
}
