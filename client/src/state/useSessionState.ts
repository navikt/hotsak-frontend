import type { Dispatch, SetStateAction } from 'react'

import { useStoredState } from './useStoredState.ts'
import { jsonSessionStorage } from './storage.ts'

/**
 * NB! Pass på at {@link key} ligger i {@link storageKeys}.
 */
export function useSessionState<S = unknown>(
  key: string,
  initialState: S | ((storedState?: S) => S)
): [S, Dispatch<SetStateAction<S>>] {
  return useStoredState(key, initialState, jsonSessionStorage)
}
