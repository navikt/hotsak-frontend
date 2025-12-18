import type { Dispatch, SetStateAction } from 'react'

import { useStoredState } from './useStoredState.ts'

/**
 * NB! Pass på at {@link key} ligger i {@link storageKeys}.
 */
export function useSessionState<S = undefined>(
  key: string,
  defaultValue?: S | (() => S)
): [S, Dispatch<SetStateAction<S>>] {
  return useStoredState(key, defaultValue, { storage: window.sessionStorage })
}
