import { useMemo } from 'react'

export function useSortering<T, K extends keyof T>(
  elements: ReadonlyArray<T>,
  key: K,
  compareFn: (a: T[K], b: T[K]) => number
): ReadonlyArray<T> {
  return useMemo((): ReadonlyArray<T> => {
    if (elements == null) return []
    return elements.toSorted((a: T, b: T) => compareFn(a[key], b[key]))
  }, [key, compareFn, elements])
}
