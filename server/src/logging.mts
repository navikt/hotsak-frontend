import fs from 'fs'
import winston from 'winston'
import { ecsFormat } from '@elastic/ecs-winston-format'

function secureLogsPath(): string {
  return fs.existsSync('/secure-logs/') ? '/secure-logs/secure.log' : './secure.log'
}

const format = ecsFormat({ convertErr: true, convertReqRes: true })

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
