import { isError, isString } from './type.ts'

export function toError(error: unknown): Error {
  if (isError(error)) {
    return error
  }
  if (isString(error)) {
    return new Error(error)
  }
  return new Error('Ukjent feil')
}

export function hentUtviklerinformasjon(error?: Error): string {
  if (!isError(error)) {
    return ''
  }
  if (isError(error.cause)) {
    return `${error.stack}\nCaused by:\n${hentUtviklerinformasjon(error.cause)}`
  }
  return error.stack || ''
}
