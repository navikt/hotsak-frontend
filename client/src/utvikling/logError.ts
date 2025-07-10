interface ErrorPayload {
  level?: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace'
  message: string
  stack?: string
  context?: Record<string, unknown>
  url: string
  userAgent: string
}

type ErrorType = Omit<ErrorPayload, 'url' | 'userAgent'>

export function logError(error: ErrorType | Error) {
  const payload: ErrorPayload = {
    level: (error as ErrorType).level ?? 'error',
    message: error.message,
    stack: error.stack,
    context: (error as ErrorType).context,
    url: window.location.href,
    userAgent: navigator.userAgent,
  }

  fetch('/api/errors', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: JSON.stringify(payload),
  }).catch((e: unknown) => {
    console.error('Failed to send error to logging server:', e)
  })
}
