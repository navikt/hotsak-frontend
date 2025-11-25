export function unique<T>(values: T[]): T[] {
  return [...new Set(values)]
}

export function uniqueBy<T, K extends keyof T>(values: T[], key: K): T[K][]
export function uniqueBy<T, R>(values: T[], key: (value: T) => R): R[]
export function uniqueBy<T, K extends keyof T, R>(values: T[], key: K | ((value: T) => R)): (T[K] | R)[] {
  return unique(values.map((value) => (typeof key === 'function' ? key(value) : value[key])))
}

export function notEmpty<T>(value: T | null | undefined): value is T {
  return value != null
}

export function natural(a: string | number, b: string | number): number {
  if (a == null) {
    a = ''
  }
  if (b == null) {
    b = ''
  }
  return a.toString().localeCompare(b.toString(), 'nb', { numeric: true })
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
