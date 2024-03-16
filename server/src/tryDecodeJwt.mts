import { decodeJwt, JWTPayload } from 'jose'
import { logger } from './logging.mjs'

export function tryDecodeJwt(jwt: string): JWTPayload {
  try {
    return decodeJwt(jwt)
  } catch (err: unknown) {
    logger.stdout.warn(new Error('Kunne ikke lese JWT-token', { cause: err }))
    return {}
  }
}
