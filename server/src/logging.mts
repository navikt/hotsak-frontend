import fs from 'fs'
import winston from 'winston'

function secureLogsPath(): string {
  return fs.existsSync('/secure-logs/') ? '/secure-logs/secure.log' : './secure.log'
}

const format = winston.format.combine(
  winston.format.errors({ stack: true }),
  winston.format.timestamp({ alias: '@timestamp' }),
  winston.format.json()
)

export const logger = {
  stdout: winston.createLogger({
    level: 'info',
    format,
    transports: [new winston.transports.Console()],
  }),
  sikker: winston.createLogger({
    level: 'info',
    format,
    transports: [new winston.transports.File({ filename: secureLogsPath(), maxsize: 5242880 })],
  }),
}
