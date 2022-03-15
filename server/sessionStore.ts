import expressSession from 'express-session'

import logger from './logging'
import { AppConfig } from './types'

export const sessionStore = (config: AppConfig) => {
    return createMemoryStoreSession(config)
}

const createMemoryStoreSession = (config: AppConfig) => {
  logger.info('Setting up MemoryStore session store')

  return expressSession({
    secret: config.server.sessionSecret!,
    saveUninitialized: false,
    resave: false,
  })
}
