import type { Navn } from '../types/types.internal'

export function isNumber(value: unknown): value is number {
  return Number.isFinite(value)
}

export function isString(value: unknown): value is string {
  return typeof value === 'string' || value instanceof String
}

export function isError(value: unknown): value is Error {
  return (
    value instanceof Error || (value != null && isString((value as Error).name) && isString((value as Error).message))
  )
}

export function isNavn(value: unknown): value is Navn {
  return value != null && isString((value as Navn).fornavn) && isString((value as Navn).etternavn)
}

export function isNotBlank(value: unknown): value is string {
  return isString(value) && value.trim().length > 0
}
