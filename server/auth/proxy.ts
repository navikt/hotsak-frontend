import { custom, Issuer } from 'openid-client';
import tunnel from 'tunnel';

import logger from '../logging';

('use strict');

export const setup = (issuer: typeof Issuer, bespoke: typeof custom) => {
    let proxyAgent: any = null;
    if (process.env['HTTP_PROXY']) {
        let hostPort = process.env['HTTP_PROXY'].replace('https://', '').replace('http://', '').split(':', 2);
        proxyAgent = tunnel.httpsOverHttp({
            proxy: {
                host: hostPort[0],
                port: +hostPort[1],
            },
        });

        logger.info(`proxying requests via ${process.env['HTTP_PROXY']}`);

        issuer[bespoke.http_options] = function (options: { agent: any }) {
            options.agent = proxyAgent;
            return options;
        };
    } else {
        logger.info(`proxy is not active`);
    }

    return proxyAgent;
};
