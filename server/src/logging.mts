import pino, { LoggerOptions, stdSerializers } from 'pino'

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
