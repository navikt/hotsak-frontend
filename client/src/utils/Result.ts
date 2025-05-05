import { toError } from './error.ts'

class Success<T> {
  constructor(public readonly value: T) {}

  map<U>(fn: (value: T) => U): Result<U> {
    return new Success(fn(this.value))
  }

  flatMap<U>(fn: (value: T) => Result<U>): Result<U> {
    return fn(this.value)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getOrElse<U>(_defaultValue: U): T | U {
    return this.value
  }

  isSuccess(): this is Success<T> {
    return true
  }

  isFailure(): this is Failure {
    return false
  }
}

class Failure {
  constructor(public readonly err: Error) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  map<U>(_fn: (value: unknown) => U): Result<U> {
    return this // No-op for failure
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  flatMap<U>(_fn: (value: unknown) => Result<U>): Result<U> {
    return this // No-op for failure
  }

  getOrElse<U>(defaultValue: U): U {
    return defaultValue
  }

  isSuccess(): this is Success<any> {
    return false
  }

  isFailure(): this is Failure {
    return true
  }
}

export type Result<T> = Success<T> | Failure

export async function runCatching<T>(fn: () => T | Promise<T>): Promise<Result<T>> {
  try {
    const result = await fn()
    return new Success(result)
  } catch (err: unknown) {
    return new Failure(toError(err))
  }
}
