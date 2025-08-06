export interface Success<T> {
  success: true
  data: T
}

export interface Failure {
  success: false
  error: Error
}

export type Result<T> = Success<T> | Failure

export function success<T>(data: T): Success<T> {
  return { success: true, data }
}

export function failure(cause: unknown): Failure {
  return { success: false, error: new Error('Failure', { cause }) }
}

export function isSuccess<T>(result: Result<T>): result is Success<T> {
  return result.success
}

export function isFailure<T>(result: Result<T>): result is Failure {
  return !result.success
}

export function mapResult<T, R>(result: Result<T>, transform: (data: T) => R): Result<R> {
  if (isSuccess(result)) {
    return { success: true, data: transform(result.data) }
  } else {
    return result
  }
}

export function flatMapResult<T, R>(result: Result<T>, transform: (data: T) => Result<R>): Result<R> {
  if (isSuccess(result)) {
    return transform(result.data)
  } else {
    return result
  }
}

export function runCatching<T>(action: () => Promise<T>): Promise<Result<T>>
export function runCatching<T>(action: () => T): Result<T>
export function runCatching<T>(action: () => T | Promise<T>): Promise<Result<T>> | Result<T> {
  try {
    const dataOrPromise = action()
    if (isPromise(dataOrPromise)) {
      return dataOrPromise.then(success).catch(failure)
    }
    return success(dataOrPromise)
  } catch (err: unknown) {
    return failure(err)
  }
}

export function isPromise<T>(value: unknown): value is Promise<T> {
  if (value instanceof Promise) {
    return true
  }
  return (
    value != null &&
    typeof (value as Promise<T>).then === 'function' &&
    typeof (value as Promise<T>).catch === 'function'
  )
}
