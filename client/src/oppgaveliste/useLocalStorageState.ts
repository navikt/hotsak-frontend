import { Dispatch, SetStateAction, useEffect, useState } from 'react'

export function useLocalStorageState<S = undefined>(
  key: string,
  defaultValue: S,
  { serialize = JSON.stringify, deserialize = JSON.parse } = {}
): [S, Dispatch<SetStateAction<S>>] {
  const [state, setState] = useState<S>(() => {
    const localStorageValue = window.localStorage.getItem(key)

    if (localStorageValue) {
      try {
        return deserialize(localStorageValue)
      } catch (error) {
        window.localStorage.removeItem(key)
      }
    }

    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  useEffect(() => {
    window.localStorage.setItem(key, serialize(state))
  }, [key, state, serialize])

  return [state, setState]
}
