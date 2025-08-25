import { useState } from 'react'

import { toError } from '../utils/error.ts'

export type ExecutionPromise<T> = Promise<T | undefined>

export interface Actions {
  /**
   * Holder på tilstand inkludert evt. `error`.
   */
  state: ActionState
}

export interface ActionState {
  // todo -> rename til isLoading
  loading: boolean
  error?: Error | null
}

export function useActionState() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const state: ActionState = {
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
     * Funksjon som f.eks. kan brukes til kjøre et asynkront kall med håndtering av `loading` og `error`.
     */
    async execute<T = unknown>(action: () => Promise<T>): ExecutionPromise<T> {
      setLoading(true)
      try {
        return await action()
      } catch (err: unknown) {
        console.error(err)
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
