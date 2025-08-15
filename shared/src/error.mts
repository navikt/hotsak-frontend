import { isError, isString } from './type.mjs'

export function toError(error: unknown): Error {
  if (isError(error)) {
    return error
  }
  if (isString(error)) {
    return new Error(error)
  }
  return new Error('Error', { cause: error })
}
