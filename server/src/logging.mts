import authSupport from './auth/authSupport.mjs'
import type { Request } from 'express'
import fs from 'fs'
import winston from 'winston'

const sikkerLogPath = () => (fs.existsSync('/secure-logs/') ? '/secure-logs/secure.log' : './secure.log')

const stdoutLogger = winston.createLogger({
  level: 'info',
  format: process.env.NODE_ENV === 'development' ? winston.format.cli() : winston.format.json(),
  transports: [new winston.transports.Console()],
})

const sikkerLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: sikkerLogPath(), maxsize: 5242880 })],
})

const info = (message: string, ...meta: any[]) => {
  stdoutLogger.info(message, ...meta)
}

const warning = (message: string, ...meta: any[]) => {
  stdoutLogger.warn(message, ...meta)
}

const error = (message: string, ...meta: any[]) => {
  stdoutLogger.error(message, ...meta)
}

const sikkerInfo = (message: string, ...meta: any[]) => {
  sikkerLogger.info(message, ...meta)
}

const sikkerWarning = (message: string, ...meta: any[]) => {
  sikkerLogger.warning(message, ...meta)
}

const sikkerError = (message: string, ...meta: any[]) => {
  sikkerLogger.error(message, ...meta)
}

const requestMeta = (req: Request) => {
  return {
    hotsakUser: authSupport.valueFromClaim('name', req.headers['authorization']?.split(' ')[1]),
    navIdent: authSupport.valueFromClaim('NAVident', req.headers['authorization']?.split(' ')[1]),
    headers: req.headers,
    method: req.method,
    url: req.url,
    httpVersion: req.httpVersion,
    path: req.path,
    protocol: req.protocol,
    query: req.query,
    hostname: req.hostname,
    ip: req.ip,
    originalUrl: req.originalUrl,
    params: req.params,
  }
}

export default {
  info,
  warning,
  error,
  sikker: {
    info: sikkerInfo,
    warning: sikkerWarning,
    error: sikkerError,
  },
  requestMeta,
}
