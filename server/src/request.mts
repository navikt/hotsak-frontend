import type { Request } from 'express'

export function ipAddressFromRequest(req: Request): string | string[] {
  return req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'
}

export function tokenFromRequest(req: Request): string | undefined {
  const header = req.headers.authorization
  return header?.split('Bearer ')[1]
}
