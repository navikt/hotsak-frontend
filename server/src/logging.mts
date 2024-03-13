import type { Request } from 'express'
import fs from 'fs'
import winston from 'winston'
import { ecsFormat } from '@elastic/ecs-winston-format'
import { getToken } from '@navikt/oasis'
import { decodeJwt } from 'jose'

function secureLogsPath(): string {
  return fs.existsSync('/secure-logs/') ? '/secure-logs/secure.log' : './secure.log'
}

const stdoutLogger = winston.createLogger({
  level: 'info',
  format: process.env.NODE_ENV === 'development' ? winston.format.cli() : ecsFormat(),
  transports: [new winston.transports.Console()],
})

const sikkerLogger = winston.createLogger({
  level: 'info',
  format: ecsFormat(),
  transports: [new winston.transports.File({ filename: secureLogsPath(), maxsize: 5242880 })],
})

export const logger = {
  info(message: string, ...meta: any[]): void {
    stdoutLogger.info(message, ...meta)
  },
  warning(message: string, ...meta: any[]): void {
    stdoutLogger.warn(message, ...meta)
  },
  error(message: string, ...meta: any[]): void {
    stdoutLogger.error(message, ...meta)
  },
  sikker: {
    info(message: string, ...meta: any[]): void {
      sikkerLogger.info(message, ...meta)
    },
    warning(message: string, ...meta: any[]): void {
      sikkerLogger.warn(message, ...meta)
    },
    error(message: string, ...meta: any[]): void {
      sikkerLogger.error(message, ...meta)
    },
  },
}

export function requestMeta(req: Request) {
  return {
    headers: req.headers,
    hostname: req.hostname,
    httpVersion: req.httpVersion,
    ip: req.ip,
    method: req.method,
    originalUrl: req.originalUrl,
    params: req.params,
    path: req.path,
    protocol: req.protocol,
    query: req.query,
    url: req.url,
  }
}
