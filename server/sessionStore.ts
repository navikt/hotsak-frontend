import connectRedis from 'connect-redis';
import expressSession from 'express-session';
import { RedisClient } from 'redis';
import redisClient from './redisClient'

import logger from './logging';
import { AppConfig } from './types';

const redisStore = connectRedis(expressSession);

export const sessionStore = (config: AppConfig) => {
    return process.env.NODE_ENV === 'development' || process.env.NAIS_CLUSTER_NAME === 'labs-gcp'
        ? createMemoryStoreSession(config)
        : createRedisSession(config, redisClient.init(config.redis));
};

const createMemoryStoreSession = (config: AppConfig) => {
    logger.info('Setting up MemoryStore session store');

    return expressSession({
        secret: config.server.sessionSecret!,
        saveUninitialized: false,
        resave: false,
    });
};

const createRedisSession = (config: AppConfig, redisClient: RedisClient) => {
    logger.info('Setting up Redis session store');

    return expressSession({
        secret: config.server.sessionSecret!,
        saveUninitialized: false,
        resave: false,
        store: new redisStore({
            client: redisClient,
            ttl: 43200, // 12 hours
        }),
    });
};
