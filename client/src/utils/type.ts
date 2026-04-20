import type { Personnavn } from '../types/hotlibs.ts'

export function isNumber(value: unknown): value is number {
  return Number.isFinite(value)
}

export function isInteger(value: unknown): value is number {
  return value != null && value !== '' && Number.isInteger(Number(value))
}

export function isString(value: unknown): value is string {
  return typeof value === 'string' || value instanceof String
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isFunction(value: unknown): value is (...args: any[]) => unknown {
  return typeof value === 'function'
}

export function isError(value: unknown): value is Error {
  return (
    value instanceof Error || (value != null && isString((value as Error).name) && isString((value as Error).message))
  )
}

export function isPersonnavn(value: unknown): value is Personnavn {
  return value != null && isString((value as Personnavn).fornavn) && isString((value as Personnavn).etternavn)
}

export function isNotBlank(value: unknown): value is string {
  return isString(value) && value.trim().length > 0
}

export function isKeyOfObject<T extends object>(key: PropertyKey, obj: T): key is keyof T {
  return key in obj
}

export function assertNever(value: never): never {
  throw new Error(`Uhåndtert verdi: ${value}`)
}
