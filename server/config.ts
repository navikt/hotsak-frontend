import env from 'dotenv'

import { OidcConfig, ServerConfig } from './types'
;('use strict')

env.config()

const oidc: OidcConfig = {
  wellKnownEndpoint: process.env.AZURE_APP_WELL_KNOWN_URL || 'unknown',
  tokenEndpoint: process.env.AZURE_OPENID_CONFIG_TOKEN_ENDPOINT || 'unknown',
  clientID: process.env.AZURE_APP_CLIENT_ID || 'unknown',
  clientIDHotsakApi: process.env.CLIENT_ID_HOTSAK_API || 'unknown',
  responseType: ['code'],
  clientSecret: process.env.AZURE_APP_CLIENT_SECRET || 'unknown',
  scope: `profile offline_access openid email ${process.env.AZURE_APP_CLIENT_ID}/.default`,
  logoutUrl: process.env.LOGOUT_URL ?? 'https://navno.sharepoint.com/sites/intranett',
}

const server: ServerConfig = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3001,
  sessionSecret: process.env.SESSION_SECRET,
}

export default {
  oidc,
  server,
}
