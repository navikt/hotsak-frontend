import { decodeJwt, JWTPayload } from 'jose'
import { logger } from './logging.mjs'

export function tryDecodeJwt(jwt: string): JWTPayload {
  try {
    return decodeJwt(jwt)
  } catch (err: unknown) {
    logger.stdout.warn('Kunne ikke lese JWT-token', { err })
    return {}
  }
}
