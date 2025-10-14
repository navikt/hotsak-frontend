export function unique<T>(values: T[]): T[] {
  return [...new Set(values)]
}

export function uniqueBy<T, K extends keyof T>(values: T[], key: K): T[K][] {
  return unique(values.map((it) => it[key]))
}

export function notEmpty<T>(value: T | null | undefined): value is T {
  return value != null
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
