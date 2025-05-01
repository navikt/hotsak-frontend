export class HttpError extends Error {
  static kallFeilet(url: string, response: Response): HttpError {
    return new HttpError(`Kall mot url: '${url}' feilet, status: ${response.status}`, response.status)
  }

  static wrap(err: unknown): HttpError {
    let error: HttpError
    if (err instanceof Error) {
      error = new HttpError(err.message, 500, { cause: err })
    } else if (typeof err === 'string') {
      error = new HttpError(err, 500)
    } else {
      error = new HttpError('Ukjent feil', 500)
    }
    return error
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
