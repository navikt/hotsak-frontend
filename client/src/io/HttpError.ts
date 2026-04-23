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

  static BAD_REQUEST = new HttpError('Bad Request', 400)
  static UNAUTHORIZED = new HttpError('Unauthorized', 401)
  static FORBIDDEN = new HttpError('Forbidden', 401)
  static NOT_FOUND = new HttpError('Not Found', 404)
  static CONFLICT = new HttpError('Conflict', 409)
  static INTERNAL_SERVER_ERROR = new HttpError('Internal Server Error', 401)

  constructor(
    message: string,
    readonly status: number,
    options?: ErrorOptions
  ) {
    super(message, options)
  }

  isBadRequest() {
    return this.status === HttpError.BAD_REQUEST.status
  }

  isUnauthorized() {
    return this.status === HttpError.UNAUTHORIZED.status
  }

  isForbidden() {
    return this.status === HttpError.FORBIDDEN.status
  }

  isNotFound() {
    return this.status === HttpError.NOT_FOUND.status
  }

  isConflict() {
    return this.status === HttpError.CONFLICT.status
  }

  isInternalServerError() {
    return this.status === HttpError.INTERNAL_SERVER_ERROR.status
  }
}
