import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { logDebug } from '../utvikling/logDebug.ts'

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
    storage.setItem(key, serialize(state))
  }, [key, storage, serialize, state])

  return [state, setState]
}

function isFunction<S>(value: unknown): value is () => S {
  return typeof value === 'function'
}
