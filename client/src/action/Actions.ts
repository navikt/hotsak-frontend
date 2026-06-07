import { useCallback, useState } from 'react'

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
  const [state, setState] = useState<ActionState>({ loading: false })

  const execute = useCallback(async <T = unknown>(action: () => Promise<T>): ExecutionPromise<T> => {
    setState({ loading: true })
    try {
      return await action()
    } catch (err: unknown) {
      console.error(err)
      setState((current) => ({ ...current, error: toError(err) }))
    } finally {
      setState((current) => ({ ...current, loading: false }))
    }
  }, [])

  return {
    /**
     * Funksjon som f.eks. kan brukes til kjøre et asynkront kall med håndtering av `isLoading` og `error`.
     */
    execute,

    /**
     * Holder på tilstand og evt. `Error`.
     */
    state,
  }
}
