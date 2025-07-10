import { Level, LoggerOptions, pino, stdSerializers } from 'pino'
import type { Express } from 'express-serve-static-core'

const options: LoggerOptions = {
  timestamp() {
    return `,"@timestamp":"${new Date(Date.now()).toISOString()}"`
  },
  level: 'info',
  messageKey: 'message',
  formatters: {
    level(label, number) {
      return { level: label, level_value: number }
    },
    log(object) {
      if (object.err instanceof Error) {
        const err = stdSerializers.err(object.err)
        object.message = err.message
        object.stack_trace = err.stack
        delete object.err
      }
      return object
    },
  },
}

export const logger = {
  stdout: pino(options),
}

interface LogPayload {
  level?: Level
  message: string
  stack?: string
  context?: Record<string, unknown>
  url: string
  userAgent: string
}

export function clientLog(server: Express) {
  server.post<never, never, LogPayload>('/log', (req, res) => {
    const { level = 'info', message, ...payload } = req.body
    logger.stdout[level]?.(
      {
        ...payload,
        source: 'client',
        ip: req.ip,
      },
      message
    )
    res.status(202).send()
  })
}
