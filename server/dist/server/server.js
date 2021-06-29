"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import bodyParser from 'body-parser';
//import compression from 'compression';
//import cookieParser from 'cookie-parser';
var express_1 = __importDefault(require("express"));
//import { Client, generators } from 'openid-client';
//import auth from './auth/authSupport';
//import azure from './auth/azure';
//import behandlingsstatistikkRoutes from './behandlingsstatistikk/behandlingsstatistikkRoutes';
var config_1 = __importDefault(require("./config"));
//import headers from './headers';
//import oppgaveRoutes from './leggpåvent/leggPåVentRoutes';
var logging_1 = __importDefault(require("./logging"));
//import opptegnelseRoutes from './opptegnelse/opptegnelseRoutes';
//import overstyringRoutes from './overstyring/overstyringRoutes';
//import paymentRoutes from './payment/paymentRoutes';
//import person from './person/personRoutes';
//import { ipAddressFromRequest } from './requestData';
//import { sessionStore } from './sessionStore';
//import tildelingRoutes from './tildeling/tildelingRoutes';
//import { AuthError, SpeilRequest } from './types';
//import wiring from './wiring';
var app = express_1.default();
var port = config_1.default.server.port;
//const helsesjekk = { redis: false };
//const dependencies = wiring.getDependencies(app, helsesjekk);
//app.use(bodyParser.json());
//app.use(cookieParser());
//app.use(sessionStore(config, dependencies.redisClient));
//app.use(compression());
//headers.setup(app);
/*let azureClient: Client | null = null;
azure
    .setup(config.oidc)
    .then((client: Client) => {
        azureClient = client;
    })
    .catch((err) => {
        logger.error(`Failed to discover OIDC provider properties: ${err}`);
        process.exit(1);
    });*/
// Unprotected routes
app.get('/isAlive', function (_, res) { return res.send('alive'); });
app.get('/isReady', function (_, res) {
    /*if (helsesjekk.redis) {
        return res.send('ready');
    } else {
        logger.warning('Svarer not ready på isReady');
        res.statusCode = 503;
        return res.send('NOT READY');
    }*/
});
/*const setUpAuthentication = () => {
    app.get('/login', (req: SpeilRequest, res: Response) => {
        const session = req.session;
        session.nonce = generators.nonce();
        session.state = generators.state();
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
    });*/
//app.use(bodyParser.urlencoded({ extended: false }));
/*app.post('/oauth2/callback', (req: SpeilRequest, res: Response) => {
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
};*/
//setUpAuthentication();
// Protected routes
app.use('/*', function (/*req: SpeilRequest*/ _, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        /* if (process.env.NODE_ENV === 'development') {
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
         }*/
        next();
        return [2 /*return*/];
    });
}); });
/*app.use('/api/person', person.setup({ ...dependencies.person }));
app.use('/api/payments', paymentRoutes(dependencies.payments));
app.use('/api/overstyring', overstyringRoutes(dependencies.overstyring));
app.use('/api/tildeling', tildelingRoutes(dependencies.tildeling));
app.use('/api/opptegnelse', opptegnelseRoutes(dependencies.opptegnelse));
app.use('/api/leggpaavent', oppgaveRoutes(dependencies.leggPåVent));
app.use('/api/behandlingsstatistikk', behandlingsstatistikkRoutes(dependencies.person.spesialistClient));*/
app.get('/*', function (req, res, next) {
    if (!req.accepts('html') && /\/api/.test(req.url)) {
        console.debug("Received a non-HTML request for '" + req.url + "', which didn't match a route");
        res.sendStatus(404);
        return;
    }
    next();
});
// At the time of writing this comment, the setup of the static 'routes' has to be done in a particular order.
app.use('/static', express_1.default.static('dist/client'));
app.use('/*', express_1.default.static('dist/client/index.html'));
app.use('/', express_1.default.static('dist/client/'));
app.listen(port, function () { return logging_1.default.info("hm-saksbehandling backend listening on port " + port); });
