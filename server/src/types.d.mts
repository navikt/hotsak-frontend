import type { ResponseType } from 'openid-client'

export interface OidcConfig {
  wellKnownEndpoint: string
  tokenEndpoint: string
  clientID: string
  clientIDHotsakApi: string
  clientIDHeitKrukkaApi: string
  responseType: ResponseType[]
  clientSecret: string
  scope: string
  logoutUrl: string
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
