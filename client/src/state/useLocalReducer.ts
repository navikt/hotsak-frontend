import { type Dispatch, type Reducer, useEffect, useReducer } from 'react'

import { replacer } from './serde.ts'
import { isFunction } from '../utils/type.ts'

/**
 * NB! Pass på at {@link key} ligger i {@link storageKeys}.
 */
export function useLocalReducer<S, A>(
  key: string,
  reducer: Reducer<S, A>,
  initialState: S | (() => S),
  { storage = window.localStorage, serialize = JSON.stringify, deserialize = JSON.parse } = {}
): [S, Dispatch<A>] {
  const [state, dispatch] = useReducer(reducer, null, (): S => {
    try {
      const stored = storage.getItem(key)
      if (stored != null) {
        return deserialize(stored)
      }
    } catch (err: unknown) {
      console.warn('Error deserializing stored reducer state:', err)
      storage.removeItem(key)
    }
    return isFunction(initialState) ? initialState() : initialState
  })

  useEffect(() => {
    try {
      storage.setItem(key, serialize(state, replacer))
    } catch (err: unknown) {
      console.warn('Error serializing reducer state:', err)
    }
  }, [key, storage, serialize, state])

  return [state, dispatch]
}
