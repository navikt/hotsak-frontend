import env from 'dotenv';

import { OidcConfig, RedisConfig, ServerConfig } from './types'

('use strict');

env.config();

 const oidc: OidcConfig = {
    wellKnownEndpoint: process.env.AZURE_APP_WELL_KNOWN_URL || 'https://login.microsoftonline.com/966ac572-f5b7-4bbe-aa88-c76419c0f851/v2.0/.well-known/openid-configuration',
    tokenEndpoint: process.env.AZURE_OPENID_CONFIG_TOKEN_ENDPOINT || 'https://login.microsoftonline.com/966ac572-f5b7-4bbe-aa88-c76419c0f851/oauth2/v2.0/token',
    clientID: process.env.AZURE_APP_CLIENT_ID || '182b0696-e9a4-423d-b2bb-763bc7075fb7',
    clientIDSpesialist: process.env.CLIENT_ID_SPESIALIST || '23727dac-e9a5-47b7-a33f-51f20fe3a48c',
    responseType: ['code'],
    clientSecret: process.env.AZURE_APP_CLIENT_SECRET || 'PsCRzgLoo21Av.fh8.cS.7Q.p._q0xPj7-',
    scope: `profile offline_access openid email 23727dac-e9a5-47b7-a33f-51f20fe3a48c/.default`,
    logoutUrl: process.env.LOGOUT_URL ?? 'https://navno.sharepoint.com/sites/intranett',
};

const server: ServerConfig = {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3001,
    sessionSecret: process.env.SESSION_SECRET,
};

 const redis: RedisConfig = {
   host: process.env.REDIS_HOST,
   port: process.env.REDIS_PORT || "6379",
   password: process.env.REDIS_PASSWORD,
};

export default {
    oidc,
    redis,
    server,
};
