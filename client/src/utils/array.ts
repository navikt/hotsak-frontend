import { type SortState } from '@navikt/ds-react'

export function unique<T>(values: T[]): T[] {
  return [...new Set(values)]
}

export function uniqueBy<T, R>(items: T[], selector: (item: T) => R) {
  return unique(items.map(selector))
}

export function groupBy<K extends PropertyKey, T>(
  items: Iterable<T>,
  keySelector: (item: T, index: number) => K
): Partial<Record<K, T[]>> {
  return Object.groupBy(items, keySelector)
}

export function associateBy<K extends PropertyKey, T>(
  items: Iterable<T>,
  keySelector: (item: T, index: number) => K
): Partial<Record<K, T>> {
  const entries = Array.from(Map.groupBy(items, keySelector).entries()).map(([key, values]) => [key, values[0]])
  return Object.fromEntries(entries)
}

export function notEmpty<T>(value: T | null | undefined): value is T {
  return value != null
}

export function natural(a?: string | number, b?: string | number): number {
  if (a == null) {
    a = ''
  }
  if (b == null) {
    b = ''
  }
  return a.toString().localeCompare(b.toString(), 'nb', { numeric: true })
}

export function naturalBy<T>(selector: (item: T) => string | number | undefined): (a: T, b: T) => number {
  return (a, b) => {
    return natural(selector(a), selector(b))
  }
}

export type Direction = SortState['direction'] | 'ASC' | 'DESC'
export function compareBy<T, K extends keyof T>(key: K, direction: Direction = 'none'): (a: T, b: T) => number {
  if (direction === 'none') {
    return none
  }
  const fn: (a: T, b: T) => number = (a, b) => {
    const x = a[key]
    const y = b[key]
    if (x == null && y == null) return 0
    if (x == null) return -1
    if (y == null) return 1
    return x.toString().localeCompare(y.toString())
  }
  if (direction === 'ascending' || direction === 'ASC') {
    return fn
  } else {
    return (a, b) => -fn(a, b)
  }
}

function none() {
  return 0
}
