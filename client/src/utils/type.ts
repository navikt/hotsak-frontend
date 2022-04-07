export function isNumber(value: unknown): value is number {
  return Number.isFinite(value)
}

export function isString(value: unknown): value is string {
  return typeof value === 'string' || value instanceof String
}

export function isError(value: unknown): value is Error {
  return value instanceof Error || (!!value && isString((value as Error).message) && isString((value as Error).stack))
}
