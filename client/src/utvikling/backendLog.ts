type Level = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace'

interface LogPayload {
  level?: Level
  message: string
  stack?: string
  context?: Record<string, unknown>
  url: string
  userAgent: string
}

type LogMessage = Omit<LogPayload, 'level' | 'url' | 'userAgent'>

function logBackend(level: Level, messageOrError: LogMessage | Error) {
  const payload: LogPayload = {
    level,
    message: messageOrError.message,
    stack: messageOrError.stack,
    context: (messageOrError as LogMessage).context,
    url: window.location.href,
    userAgent: navigator.userAgent,
  }

  fetch('/log', {
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

export const backendLog = {
  info(messageOrError: LogMessage | Error) {
    logBackend('info', messageOrError)
  },
  warn(messageOrError: LogMessage | Error) {
    logBackend('warn', messageOrError)
  },
  error(messageOrError: LogMessage | Error) {
    logBackend('error', messageOrError)
  },
}
