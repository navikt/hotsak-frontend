"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
('use strict');
dotenv_1.default.config();
/* const oidc: OidcConfig = {
    wellKnownEndpoint: process.env.AZURE_APP_WELL_KNOWN_URL || 'unknown',
    tokenEndpoint: process.env.AZURE_OPENID_CONFIG_TOKEN_ENDPOINT || 'unknown',
    clientID: process.env.AZURE_APP_CLIENT_ID || 'unknown',
    clientIDSpesialist: process.env.CLIENT_ID_SPESIALIST || 'unknown',
    //responseType: ['code'],
    clientSecret: process.env.AZURE_APP_CLIENT_SECRET || 'unknown',
    scope: `profile offline_access openid email ${process.env.AZURE_APP_CLIENT_ID}/.default`,
    logoutUrl: process.env.LOGOUT_URL ?? 'https://navno.sharepoint.com/sites/intranett',
};
 */
var server = {
    port: process.env.HM_SAKSBEHANDLING_API_PORT ? parseInt(process.env.HM_SAKSBEHANDLING_API_PORT) : 3000,
    sessionSecret: process.env.SESSION_SECRET,
};
/* const redis = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
};
 */
exports.default = {
    //oidc,
    //redis,
    server: server,
};
