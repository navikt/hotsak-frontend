import { decodeJwt, JWTPayload } from 'jose'
import { logger } from './logging.mjs'

export function tryDecodeJwt(jwt: string): JWTPayload {
  try {
    return decodeJwt(jwt)
  } catch (e: unknown) {
    if (e instanceof Error) {
      logger.warning(e.message)
    }
    return {}
  }
}
