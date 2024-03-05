import { logger } from './logging.mjs'
import type { AppConfig } from './types.d.mts'
import expressSession from 'express-session'

export const sessionStore = (config: AppConfig) => {
  return createSessionStore(config)
}

const createSessionStore = (config: AppConfig) => {
  logger.info('Setting up MemoryStore session store')

  return expressSession({
    secret: config.server.sessionSecret!,
    saveUninitialized: false,
    resave: false,
  })
}
