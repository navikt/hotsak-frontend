import type { Dispatch, SetStateAction } from 'react'

import { useStoredState } from './useStoredState.ts'

export function useLocalState<S = unknown>(
  key: string,
  defaultValue?: S | (() => S)
): [S, Dispatch<SetStateAction<S>>] {
  return useStoredState(key, defaultValue, { storage: window.localStorage })
}
