import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'

import { logDebug } from '../utvikling/logDebug.ts'
import { replacer } from './serde.ts'
import { isFunction } from '../utils/type.ts'

/**
 * NB! Pass på at {@link key} ligger i {@link storageKeys}.
 */
export function useStoredState<S = unknown>(
  key: string,
  defaultValue?: S | (() => S),
  { storage = window.localStorage, serialize = JSON.stringify, deserialize = JSON.parse } = {}
): [S, Dispatch<SetStateAction<S>>] {
  const [state, setState] = useState<S>(() => {
    const storedValue = storage.getItem(key)
    if (storedValue) {
      try {
        return deserialize(storedValue)
      } catch (err: unknown) {
        logDebug(err)
        storage.removeItem(key)
      }
    }

    return isFunction(defaultValue) ? defaultValue() : defaultValue
  })

  useEffect(() => {
    storage.setItem(key, serialize(state, replacer))
  }, [key, storage, serialize, state])

  return [state, setState]
}
