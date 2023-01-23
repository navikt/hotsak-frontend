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

  constructor(message: string, readonly status: number, options?: ErrorOptions) {
    super(message, options)
  }
}

export function isError(value: unknown): value is Error {
  return value instanceof Error
}

export function isHttpError(value: unknown): value is HttpError {
  return value instanceof HttpError
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
