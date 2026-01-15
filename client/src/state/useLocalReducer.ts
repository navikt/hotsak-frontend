import { type Dispatch, type Reducer, useEffect, useReducer } from 'react'

import { isFunction } from '../utils/type.ts'
import { jsonLocalStorage, type JSONStorage } from './storage.ts'

/**
 * NB! Pass på at {@link key} ligger i {@link storageKeys}.
 */
export function useLocalReducer<S, A>(
  key: string,
  reducer: Reducer<S, A>,
  initialState: S | ((storedState?: S) => S),
  storage: JSONStorage = jsonLocalStorage
): [S, Dispatch<A>] {
  const [state, dispatch] = useReducer(reducer, null, (): S => {
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
  return [state, dispatch]
}
