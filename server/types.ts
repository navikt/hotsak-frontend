import { Request } from 'express'
import { Session } from 'express-session'
import { ResponseType } from 'openid-client'

export interface OidcConfig {
  wellKnownEndpoint: string
  tokenEndpoint: string
  clientID: string
  clientIDHotsakApi: string
  responseType: ResponseType[]
  clientSecret: string
  scope: string
  logoutUrl: string
  redirectUrl: string
}

export interface ServerConfig {
  port: number
  sessionSecret?: string
}

export interface AppConfig {
  oidc: OidcConfig
  server: ServerConfig
}

export type OnBehalfOf = { hentFor: (tjenesteId: string, token: string) => Promise<string> }

export interface HotsakSession extends Session {
  hotsakToken: string
  refreshToken: string
  nonce: string
  state: string
  user: string
}

export interface HotsakRequest extends Request {
  session: HotsakSession
}

export interface AuthError extends Error {
  statusCode: number
  cause?: any
}
