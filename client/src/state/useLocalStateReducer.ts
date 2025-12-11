import { type Dispatch, type Reducer, useEffect, useReducer } from 'react'

type StorageAPI = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

export function useLocalStateReducer<S, A>(
  key: string,
  reducer: Reducer<S, A>,
  initialState: S | (() => S),
  {
    storage = window.localStorage,
    serialize = JSON.stringify,
    deserialize = JSON.parse,
  }: {
    storage?: StorageAPI
    serialize?: (value: S) => string
    deserialize?: (text: string) => S
  } = {}
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
      storage.setItem(key, serialize(state))
    } catch (err: unknown) {
      console.warn('Error serializing reducer state:', err)
    }
  }, [key, storage, serialize, state])

  return [state, dispatch]
}

function isFunction<S>(value: unknown): value is () => S {
  return typeof value === 'function'
}
