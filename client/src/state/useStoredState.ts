import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'

import { isFunction } from '../utils/type.ts'
import { type JSONStorage } from './storage.ts'

/**
 * NB! Pass på at {@link key} ligger i {@link storageKeys}.
 */
export function useStoredState<S = unknown>(
  key: string,
  initialState: S | ((storedState?: S) => S),
  storage: JSONStorage
): [S, Dispatch<SetStateAction<S>>] {
  const [state, setState] = useState<S>(() => {
    const storedState = storage.get<S>(key)
    if (isFunction(initialState)) {
      return initialState(storedState)
    } else if (storedState == null) {
      return initialState
    } else {
      return storedState
    }
  })
  useEffect(() => storage.set(key, state), [storage, key, state])
  return [state, setState]
}
