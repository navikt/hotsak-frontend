//import compression from 'compression';
import cookieParser from 'cookie-parser'
import express, { Response } from 'express'
import { Client, generators } from 'openid-client'
import bodyParser from 'body-parser'

import auth from './auth/authSupport'
import azure from './auth/azure'
//import behandlingsstatistikkRoutes from './behandlingsstatistikk/behandlingsstatistikkRoutes';
import config from './config'
//import headers from './headers';
//import oppgaveRoutes from './leggpåvent/leggPåVentRoutes';
import logger from './logging'
import path from 'path'
import setupProxy from './reverse-proxy'
//import opptegnelseRoutes from './opptegnelse/opptegnelseRoutes';
//import overstyringRoutes from './overstyring/overstyringRoutes';
//import paymentRoutes from './payment/paymentRoutes';
//import person from './person/personRoutes';
import { ipAddressFromRequest } from './requestData'
import { sessionStore } from './sessionStore'
//import tildelingRoutes from './tildeling/tildelingRoutes';
import { AuthError, SpeilRequest } from './types'
import onBehalfOf from './auth/onBehalfOf'
//import wiring from './wiring';

const app = express()
const port = config.server.port

// if(process.env.NODE_ENV !== 'production') {
//     app.get(`/mockServiceWorker.js`, (req, res) => {
//         res.sendFile(path.resolve('', 'public', 'mockServiceWorker.js'))
//       })
// }


//const helsesjekk = { redis: false };
//const dependencies = wiring.getDependencies(app, helsesjekk);

app.use(cookieParser());
app.use(sessionStore(config));
//app.use(compression());

//headers.setup(app);
let azureClient: Client | null = null;
azure
    .setup(config.oidc)
    .then((client: Client) => {
        azureClient = client;
    })
    .catch((err) => {
        logger.error(`Failed to discover OIDC provider properties: ${err}`);
        process.exit(1);
    });

// Unprotected routes
app.get('/isalive', (_, res) => res.send('alive'))
app.get('/isready', (_, res) => {
  res.send('ready for action')
  /*if (helsesjekk.redis) {
        return res.send('ready');
    } else {
        logger.warning('Svarer not ready på isReady');
        res.statusCode = 503;
        return res.send('NOT READY');
    }*/
})

const setUpAuthentication = () => {
    app.get('/login', (req: SpeilRequest, res: Response) => {
        const session = req.session;
        session.nonce = generators.nonce();
        session.state = generators.state();
        if(azureClient === null){
          console.log("Azure client er null")
        }
        const url = azureClient!.authorizationUrl({
            scope: config.oidc.scope,
            redirect_uri: auth.redirectUrl(req),
            response_type: config.oidc.responseType[0],
            prompt: 'select_account',
            response_mode: 'form_post',
            nonce: session.nonce,
            state: session.state,
        });
        res.redirect(url);
    });
    app.get('/logout', (req: SpeilRequest, res: Response) => {
        azureClient!.revoke(req.session.speilToken).finally(() => {
            req.session.destroy(() => {});
            res.clearCookie('speil');
            res.redirect(302, config.oidc.logoutUrl);
        });
    });

app.post('/oauth2/callback', (req: SpeilRequest, res: Response) => {
        const session = req.session;
        auth.validateOidcCallback(req, azureClient!, config.oidc)
            .then((tokens: string[]) => {
                const [accessToken, idToken, refreshToken] = tokens;
                res.cookie('speil', `${idToken}`, {
                    secure: true,
                    sameSite: true,
                });
                session.speilToken = accessToken;
                session.refreshToken = refreshToken;
                session.user = auth.valueFromClaim('NAVident', idToken);
                res.redirect(303, '/');
            })
            .catch((err: AuthError) => {
                logger.error(`Error caught during login: ${err.message} (se sikkerLog for detaljer)`);
                logger.sikker.error(`Error caught during login: ${err.message}`, err);
                session.destroy(() => {});
                res.sendStatus(err.statusCode);
            });
    });
};

const _onBehalfOf = onBehalfOf(config.oidc);
setupProxy(app, _onBehalfOf, config)

// Protected routes
app.use('/*', async (req: SpeilRequest, res, next) => {
 if (process.env.NODE_ENV === 'development' || process.env.NAIS_CLUSTER_NAME === 'labs-gcp') {
        res.cookie('speil', auth.createTokenForTest(), {
            secure: false,
            sameSite: true,
        });
        next();
    } else {
        if (
            auth.isValidIn({ seconds: 5, token: req.session!.speilToken }) ||
            (await auth.refreshAccessToken(azureClient!, req.session!))
        ) {
            next();
        } else {
            if (req.session!.speilToken) {
                const name = auth.valueFromClaim('name', req.session!.speilToken);
                logger.info(`No valid session found for ${name}, connecting via ${ipAddressFromRequest(req)}`);
                logger.sikker.info(
                    `No valid session found for ${name}, connecting via ${ipAddressFromRequest(req)}`,
                    logger.requestMeta(req)
                );
            }
            if (req.originalUrl === '/' || req.originalUrl.startsWith('/static')) {
                res.redirect('/login');
            } else {
                // these are xhr's, let the client decide how to handle
                res.clearCookie('speil');
                res.sendStatus(401);
            }
        }
    }
});

/*app.use('/api/person', person.setup({ ...dependencies.person }));
app.use('/api/payments', paymentRoutes(dependencies.payments));
app.use('/api/overstyring', overstyringRoutes(dependencies.overstyring));
app.use('/api/tildeling', tildelingRoutes(dependencies.tildeling));
app.use('/api/opptegnelse', opptegnelseRoutes(dependencies.opptegnelse));
app.use('/api/leggpaavent', oppgaveRoutes(dependencies.leggPåVent));
app.use('/api/behandlingsstatistikk', behandlingsstatistikkRoutes(dependencies.person.spesialistClient));*/




app.use(bodyParser.json())

setUpAuthentication();

// app.get('/*', (req, res, next) => {
//   if (!req.accepts('html') && /\/api/.test(req.url)) {
//     console.debug(`Received a non-HTML request for '${req.url}', which didn't match a route`)
//     res.sendStatus(404)
//     return
//   }
//   next()
// })

const distPath = __dirname + '/../client'
//const clientPath = path.join(distPath, 'client')
const htmlPath = path.join(distPath, 'index.html')

console.log('distpath', distPath)
console.log('htmlPath', htmlPath)

app.use(express.static(__dirname + '/../client'))
app.use('/*', express.static(htmlPath))

// At the time of writing this comment, the setup of the static 'routes' has to be done in a particular order.
//app.use('/static', express.static('dist/client'))
//app.use('/*', express.static('dist/client/index.html'))
//app.use('/', express.static('dist/client/'))

app.listen(port, () => logger.info(`hm-saksbehandling backend listening on port ${port}`))
