import type { Request } from 'express'

export function ipAddressFromRequest(req: Request): string | string[] {
  return req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'
}
