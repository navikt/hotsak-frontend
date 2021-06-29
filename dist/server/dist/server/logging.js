"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var winston_1 = __importDefault(require("winston"));
//import authSupport from './auth/authSupport';
//import { SpeilRequest } from './types';
('use strict');
//const sikkerLogPath = () => (fs.existsSync('/secure-logs/') ? '/secure-logs/secure.log' : './secure.log');
var stdoutLogger = winston_1.default.createLogger({
    level: 'info',
    format: process.env.NODE_ENV === 'development' ? winston_1.default.format.cli() : winston_1.default.format.json(),
    transports: [new winston_1.default.transports.Console()],
});
/* const sikkerLogger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [new winston.transports.File({ filename: sikkerLogPath(), maxsize: 5242880 })],
}); */
var info = function (message) {
    var meta = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        meta[_i - 1] = arguments[_i];
    }
    stdoutLogger.info.apply(stdoutLogger, __spreadArray([message], meta));
};
var warning = function (message) {
    var meta = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        meta[_i - 1] = arguments[_i];
    }
    stdoutLogger.warn.apply(stdoutLogger, __spreadArray([message], meta));
};
var error = function (message) {
    var meta = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        meta[_i - 1] = arguments[_i];
    }
    stdoutLogger.error.apply(stdoutLogger, __spreadArray([message], meta));
};
/* const sikkerInfo = (message: string, ...meta: any[]) => {
    sikkerLogger.info(message, ...meta);
};

const sikkerWarning = (message: string, ...meta: any[]) => {
    sikkerLogger.warning(message, ...meta);
};

const sikkerError = (message: string, ...meta: any[]) => {
    sikkerLogger.error(message, ...meta);
}; */
/*const requestMeta = (req: SpeilRequest) => {
    return {
        //speilUser: authSupport.valueFromClaim('name', req.session.speilToken),
        //navIdent: authSupport.valueFromClaim('NAVident', req.session.speilToken),
        headers: req.headers,
        method: req.method,
        url: req.url,
        httpVersion: req.httpVersion,
        path: req.path,
        protocol: req.protocol,
        query: req.query,
        hostname: req.hostname,
        ip: req.ip,
        originalUrl: req.originalUrl,
        params: req.params,
    };
};*/
exports.default = {
    info: info,
    warning: warning,
    error: error,
    /*sikker: {
        info: sikkerInfo,
        warning: sikkerWarning,
        error: sikkerError,
    },
*/ //requestMeta,
};
