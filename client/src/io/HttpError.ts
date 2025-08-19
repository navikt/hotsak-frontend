import { contentTypeIsJson } from './response.ts'

export class HttpError extends Error {
  static async reject(url: string, response: Response): Promise<never> {
    const status = response.status
    const message = `HttpError, url: '${url}', status: ${status}`
    try {
      let cause: unknown
      if (contentTypeIsJson(response)) {
        cause = await response.json()
      } else {
        cause = await response.text()
      }
      return Promise.reject(new HttpError(message, status, { cause }))
    } catch (err: unknown) {
      return Promise.reject(new HttpError(message, status, { cause: err }))
    }
  }

  static wrap(cause: unknown): HttpError {
    if (cause instanceof HttpError) {
      return cause
    }
    return new HttpError('HttpError', 500, { cause })
  }

  static isHttpError(value: unknown): value is HttpError {
    return value instanceof HttpError
  }

  constructor(
    message: string,
    readonly status: number,
    options?: ErrorOptions
  ) {
    super(message, options)
  }

  isBadRequest() {
    return this.status === 400
  }

  isUnauthorized() {
    return this.status === 401
  }

  isForbidden() {
    return this.status === 403
  }

  isNotFound() {
    return this.status === 404
  }

  isConflict() {
    return this.status === 409
  }

  isInternalServerError() {
    return this.status === 500
  }
}
