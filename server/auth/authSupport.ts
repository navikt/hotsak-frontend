import { Request } from 'express';
import { Client, TokenSet } from 'openid-client';

import logger from '../logging';
import { ipAddressFromRequest } from '../requestData';
import { AuthError, OidcConfig, SpeilRequest, SpeilSession } from '../types';

interface IsValidInProps {
    seconds: number;
    token?: string;
}

const isValidIn = ({ seconds, token }: IsValidInProps) => {
    if (!token) return false;
    const timeToCheck = Math.floor(Date.now() / 1000) + seconds;
    const expirationTime = parseInt(claimsFrom(token)['exp'] as string);
    return timeToCheck < expirationTime;
};

const redirectUrl = (req: Request) => {
    if (process.env.NODE_ENV === 'development') return 'http://localhost:3000/oauth2/callback';
    return 'https://' + req.get('Host') + '/oauth2/callback';
};

const authError = (statusCode: number, reason: string, cause?: any): AuthError => {
    return {
        name: 'auth_error',
        message: reason,
        statusCode: statusCode,
        cause: cause,
    };
};

const validateOidcCallback = (req: SpeilRequest, azureClient: Client, config: OidcConfig) => {
    if (req.body.code === undefined) {
        return Promise.reject(authError(400, 'missing data in POST after login'));
    }
    const params = azureClient.callbackParams(req);
    const nonce = req.session!.nonce;
    const state = req.session!.state;

    return azureClient
        .callback(redirectUrl(req), params, { nonce, state })
        .catch((err) => Promise.reject(authError(500, `Azure error: ${err.error_description}`, err)))
        .then((tokenSet: TokenSet) => retrieveTokens(tokenSet, 'access_token', 'id_token', 'refresh_token'))
        .then(([accessToken, idToken, refreshToken]) => {
            const username = valueFromClaim('name', idToken as string);
            logger.info(`User ${username} has been authenticated, from IP address ${ipAddressFromRequest(req)}`);
            return [accessToken, idToken, refreshToken];
        });
};

const retrieveTokens = (tokenSet: TokenSet, ...tokenKeys: string[]): Promise<string[]> => {
    const tokens = tokenKeys.map((key) => tokenSet[key]);
    for (let key of tokenKeys) {
        if (tokenSet[key] === undefined) {
            return Promise.reject(authError(500, `Missing ${key} in response from Azure AD.`));
        }
    }
    return Promise.resolve(tokens as string[]);
};

const isMemberOf = (token: string, group?: string) => {
    const claims = claimsFrom(token);
    const groups = claims['groups'] as string[];
    return groups.filter((element: string) => element === group).length === 1;
};

const valueFromClaim = (claim: string, token?: string): string => {
    if (token === undefined) {
        logger.info(`No token, cannot extract claim value '${claim}'`);
        return 'unknown value';
    }
    try {
        return (claimsFrom(token)[claim] as string) || 'unknown value';
    } catch (err) {
        logger.error(`error while extracting value from claim '${claim}': ${err}`);
        return 'unknown value';
    }
};
const claimsFrom = (token: string): any => {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
};

const createTokenForTest = () =>
    `${Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64')}.${Buffer.from(
        JSON.stringify({ name: 'S. A. Ksbehandler', email: 'dev@nav.no', NAVident: 'dev-ident', oid: 'uuid' })
    ).toString('base64')}.bogussignature`;

const refreshAccessToken = async (azureClient: Client, session: SpeilSession): Promise<boolean> => {
    if (!session.refreshToken) return false;
    return await azureClient
        .refresh(session.refreshToken)
        .then((tokenSet: TokenSet) => retrieveTokens(tokenSet, 'access_token', 'refresh_token'))
        .then(([accessToken, refreshToken]) => {
            logger.info(`Refresher access token for ${session.user}`);
            session.speilToken = accessToken;
            session.refreshToken = refreshToken;
            return true;
        })
        .catch((errorMessage) => {
            logger.error(`Feilet refresh av access token for ${session.user}: ${errorMessage}`);
            return false;
        });
};

export default {
    isValidIn,
    redirectUrl,
    validateOidcCallback,
    isMemberOf,
    valueFromClaim,
    createTokenForTest,
    refreshAccessToken,
};
