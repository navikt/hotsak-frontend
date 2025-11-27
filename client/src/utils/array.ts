export function unique<T>(values: T[]): T[] {
  return [...new Set(values)]
}

export function uniqueBy<T, K extends keyof T>(items: T[], keySelector: K): T[K][]
export function uniqueBy<T, R>(items: T[], keySelector: (value: T) => R): R[]
export function uniqueBy<T, K extends keyof T, R>(items: T[], keySelector: K | ((value: T) => R)): (T[K] | R)[] {
  return unique(items.map((value) => (typeof keySelector === 'function' ? keySelector(value) : value[keySelector])))
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

export type Comparator<T> = (a: T, b: T) => number

export function naturalBy<T, K extends keyof T>(valueSelector: K): Comparator<T>
export function naturalBy<T>(valueSelector: (item: T) => Maybe<string | number>): Comparator<T>
export function naturalBy<T, K extends keyof T>(
  valueSelector: K | ((item: T) => Maybe<string | number>)
): Comparator<T> {
  return (a, b) => {
    let aValue: Maybe<string | number>
    let bValue: Maybe<string | number>
    if (typeof valueSelector === 'function') {
      aValue = valueSelector(a)
      bValue = valueSelector(b)
    } else {
      aValue = a[valueSelector]?.toString()
      bValue = b[valueSelector]?.toString()
    }
    return natural(aValue, bValue)
  }
}

export function compareBy<T, K extends keyof T>(
  key: K,
  direction: 'ascending' | 'descending' | 'none'
): (a: T, b: T) => number {
  if (direction === 'none') {
    return () => 0
  }
  const fn: (a: T, b: T) => number = (a, b) => {
    const x = a[key]
    const y = b[key]
    if (x == null && y == null) return 0
    if (x == null) return -1
    if (y == null) return 1
    return x.toString().localeCompare(y.toString())
  }
  if (direction === 'ascending') {
    return fn
  } else {
    return (a, b) => -fn(a, b)
  }
}
