import { type SortState } from '@navikt/ds-react'

export type Comparator<T> = (a: T, b: T) => number

export function unique<T>(items: T[]): T[] {
  return [...new Set(items)]
}

export function uniqueBy<T, R>(items: T[], selector: (item: T) => R): R[] {
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

export function entriesOf<T extends Record<string, unknown>>(obj: T): Array<[keyof T & string, T[keyof T & string]]> {
  return Object.entries(obj) as Array<[keyof T & string, T[keyof T & string]]>
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

export function naturalBy<T>(selector: (item: T) => string | number | undefined): Comparator<T> {
  return (a, b) => {
    return natural(selector(a), selector(b))
  }
}

export type Direction = SortState['direction'] | 'ASC' | 'DESC'

export function compareBy<T>(
  selector: (item: T) => string | number | undefined,
  direction: Direction = 'none'
): Comparator<T> {
  if (direction === 'none') {
    return none
  }
  const fn: Comparator<T> = (a, b) => {
    const x = selector(a)
    const y = selector(b)
    if (x == null && y == null) return 0
    if (x == null) return -1
    if (y == null) return 1
    return x.toString().localeCompare(y.toString(), 'nb', { numeric: true })
  }
  if (direction === 'ascending' || direction === 'ASC') {
    return fn
  } else {
    return (a, b) => -fn(a, b)
  }
}

const none: Comparator<unknown> = () => 0
