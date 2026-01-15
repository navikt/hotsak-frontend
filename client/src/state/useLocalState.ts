import type { Dispatch, SetStateAction } from 'react'

import { useStoredState } from './useStoredState.ts'
import { jsonLocalStorage } from './storage.ts'

/**
 * NB! Pass på at {@link key} ligger i {@link storageKeys}.
 */
export function useLocalState<S = unknown>(
  key: string,
  initialState: S | ((storedState?: S) => S)
): [S, Dispatch<SetStateAction<S>>] {
  return useStoredState(key, initialState, jsonLocalStorage)
}
